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

const params = {
  Bucket: process.env.S3_BUCKET
}

console.log('params', params)
console.info('retrieving data...')

s3.listMultipartUploads(params, function (err, data) {
  if (err) console.log(err)
  else console.log(data)
})
