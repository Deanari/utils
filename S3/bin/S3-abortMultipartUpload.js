const path = require('path')
const fullPath = path.join(__dirname, '/.env')
const yargs = require('yargs')
const options = yargs
  .usage('Usage: -k <key>')
  .option('k', { alias: 'key', describe: 'Object key', type: 'string', demandOption: true })
  .usage('Usage: -uid <uploadId>')
  .option('uid', { alias: 'uploadId', describe: 'Upload Id', type: 'string', demandOption: true })
  .argv
require('dotenv').config({ path: fullPath })

const s3Config = {
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  apiVersion: '2006-03-01',
  region: process.env.S3_REGION
}

const AWS = require('aws-sdk')
const s3 = new AWS.S3(s3Config)

const params = {
  Bucket: process.env.S3_BUCKET,
  Key: options.key,
  UploadId: options.uploadId
}

console.log('params', params)
console.info('Aborting upload...')

s3.abortMultipartUpload(params, function (err, data) {
  if (err) console.log(err)
  else console.log('Operation completed')
})
