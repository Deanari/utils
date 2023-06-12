const fs = require('fs')
const path = require('path')
const fullPath = path.join(__dirname, '/.env')
require('dotenv').config({ path: fullPath })
const yargs = require('yargs')
const options = yargs
  .usage('Usage: -k <key>')
  .option('k', { alias: 'key', describe: 'Object key', type: 'string', demandOption: true })
  .usage('Usage: -d <destination>')
  .option('d', { alias: 'destination', describe: 'Destination folder', type: 'string', demandOption: true })
  .argv

const AWS = require('aws-sdk')

const s3Config = {
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  apiVersion: '2006-03-01',
  region: process.env.S3_REGION
}

const s3 = new AWS.S3(s3Config)

const params = {
  Bucket: process.env.S3_BUCKET,
  Key: options.key
}

console.log('params', params)
console.info('retrieving data... this may take some time depending on object size')

const filePath = options.key.split('/')
const fileName = filePath[filePath.length - 1]

try {
  const readStream = s3
    .getObject(params)
    .createReadStream()
  const writeStream = fs.createWriteStream(`${options.destination}/${fileName}`)
  readStream.pipe(writeStream)
  console.log(`File downloading at ${options.destination}`)
} catch (error) {
  console.log(error)
}
