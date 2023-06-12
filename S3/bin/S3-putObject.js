const fs = require('fs')
const path = require('path')
const fullPath = path.join(__dirname, '/.env')
require('dotenv').config({ path: fullPath })

const yargs = require('yargs')
const options = yargs
  .usage('Usage: -k <key>')
  .option('k', { alias: 'key', describe: 'Object key', type: 'string', demandOption: true })
  .usage('Usage: -f <file>')
  .option('f', { alias: 'file', describe: 'File path', type: 'string', demandOption: true })
  .argv

const AWS = require('aws-sdk')

console.log('Reading file...')
const fileData = fs.readFileSync(options.file)
console.log('Creating binary')
// eslint-disable-next-line new-cap
const binaryString = new Buffer.from(fileData, 'binary')
console.log(`File size: ${binaryString.length} bytes`)

if (binaryString.length > 104857600) {
  console.error('The maximun file accepted for this util is 104857600 bytes (100 MB), please use multipart upload instead')
} else {
  const s3Config = {
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
    apiVersion: '2006-03-01',
    region: process.env.S3_REGION
  }

  const s3 = new AWS.S3(s3Config)

  const params = {
    Body: binaryString,
    Bucket: process.env.S3_BUCKET,
    Key: options.key
  }

  console.log('params', params)
  console.info('Uploading data... this may take some time depending on object size')

  s3.putObject(params, function (err, data) {
    if (err) console.log(err)
    else console.log(`File oploaded at ${options.key}`, data)
  })
}
