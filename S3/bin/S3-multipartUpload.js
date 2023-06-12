const path = require('path')
const fullPath = path.join(__dirname, '/.env')
require('dotenv').config({ path: fullPath })
const AWS = require('aws-sdk')
const fs = require('fs')
const yargs = require('yargs')

const options = yargs
  .usage('Usage: -k <key>')
  .option('k', { alias: 'key', describe: 'Object key', type: 'string', demandOption: true })
  .usage('Usage: -f <file>')
  .option('f', { alias: 'file', describe: 'File path', type: 'string', demandOption: true })
  .argv

const partSize = 1073741824 // 1GB (min 5MB max 5GB, impacts on memory usage)
const maxRetries = 3
const API_VERSION = '2006-03-01'
const s3 = initS3()

let uploadId
const uploadedParts = { Parts: [] } // Required to complete the process.
let totalUploadedParts = 0

/**
 *
 *  Covers whole process to upload a file to s3 in parts, uses streaming of data to read the file
 *  Expected order : create multipart upload, upload parts, complete / abort multipart upload
 *  Requirements:
 *  - Each part should be more than 5 MB and up to 5 GB and all parts should be the same size, except for the last one.
 *  - Maximun of upload total size 5TB
 *  - Maximun number of parts 10000
 *  - It is required to either complete the multipart upload or abort it to free s3 memory allocation and avoid extra costs
 *  More info at https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
 *
 * */

async function run () {
  try {
    const data = await createMultipartUpload()
    uploadId = data.UploadId

    console.log('Multipart upload created, id:', uploadId)

    const readStream = fs.createReadStream(options.file, { highWaterMark: partSize })

    readStream.on('data', (currentPart) => onData(readStream, currentPart))

    readStream.on('error', (error) => {
      console.log('stream error', error)
      readStream.destroy()
    })

    readStream.on('close', (err) => {
      if (err) {
        console.log('error on stream close', err)
        abortUpload()
      } else {
        console.log('Stream completed, waiting for upload to be completed')
      }
    })
  } catch (error) {
    console.log('error on create multipart', error)
  }
}

function initS3 () {
  const s3Config = {
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
    apiVersion: API_VERSION,
    region: process.env.S3_REGION
  }

  return new AWS.S3(s3Config)
};

async function createMultipartUpload (whenUploaded) {
  return new Promise((resolve, reject) => {
    console.log('Creating multipart upload')

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: options.key
    }

    const whenUploaded = async (err, data) => {
      if (err) reject(err)
      else resolve(data)
    }

    s3.createMultipartUpload(params, whenUploaded)
  })
};

async function onData (readStream, currentPart) {
  // stops reading at the end of the part so it can upload it
  readStream.pause()
  let uploaded = false
  let currentRetries = 0

  while (!uploaded && currentRetries <= maxRetries) {
    try {
      uploaded = await uploadPart(totalUploadedParts + 1, currentPart)
      // checks if it is the last part
      if (currentPart.length < partSize) {
        console.log('Last part uploaded, closing upload')
        // Sends the order to complete the upload
        completeUpload()
      } else {
        // keeps reading next part
        console.log('part uploaded, continue reading...'); readStream.resume()
      }
    } catch (error) {
      console.log('Could not upload, retrying...', error)
      currentRetries++
    }
  }

  if (!uploaded && currentRetries > maxRetries) {
    console.log('no more retries')
    // sends the order to cancel the multipart upload and to free s3 memory
    abortUpload()
    readStream.destroy()
  }
};

function uploadPart (partNumber, body) {
  return new Promise((resolve, reject) => {
    console.log('3 uploading part, size:', body.length)
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: options.key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: body,
      ContentLength: body.length
    }
    console.log('Uploading part params', params)

    s3.uploadPart(params)
      .promise()
      .then((response) => {
        uploadedParts.Parts.push({ PartNumber: partNumber, ETag: response.ETag })
        totalUploadedParts++
        console.log(`Part ${totalUploadedParts} uploaded:`, response.ETag)
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function abortUpload () {
  console.log('Aborting process')
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: options.key,
    UploadId: uploadId
  }

  s3.abortMultipartUpload(params)
    .promise()
    .then((response) => { console.log('Multipart upload cancelled', response) })
    .catch((error) => { console.log('Could not cancel upload', error) })
};

function completeUpload () {
  console.log('closing multipart upload')

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: options.key,
    UploadId: uploadId,
    MultipartUpload: uploadedParts
  }

  s3.completeMultipartUpload(params)
    .promise()
    .then((response) => { console.log(`Upload multipart completed. Location: ${response.Location} Entity tag: ${response.ETag}`) })
    .catch((error) => { console.log('Error at complete multipart upload', error); abortUpload() })
};

await run()
