const path = require('path')
const fullPath = path.join(__dirname, '/.env')
require('dotenv').config({ path: fullPath })

const AWS = require('aws-sdk')

const s3Config = {
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  apiVersion: '2006-03-01',
  region: process.env.S3_REGION
}

const s3 = new AWS.S3(s3Config)

async function run () {
  const paramsList = {
    Bucket: process.env.S3_BUCKET
  }

  console.log('params', paramsList)
  console.info('retrieving data...')

  let uploadsToDelete = []

  await s3.listMultipartUploads(paramsList, function (err, data) {
    if (err) console.log(err)
    else uploadsToDelete = data.Uploads
  }).promise()

  if (uploadsToDelete && uploadsToDelete.length) {
    console.log('found elements', uploadsToDelete.length)
    uploadsToDelete.forEach(async (upload) => {
      const paramsAbort = {
        Bucket: process.env.S3_BUCKET,
        Key: upload.Key,
        UploadId: upload.UploadId
      }
      await s3.abortMultipartUpload(paramsAbort, function (err) {
        if (err) console.log(err)
        else console.log('Upload deleted', upload.Key)
      }).promise()
    })
  } else {
    console.log('No items to delete')
  }
}

run()
