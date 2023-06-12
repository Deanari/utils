require('dotenv').config({ path: __dirname + '/.env' });
const chalk = require("chalk");

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
let sqsConfig = { apiVersion: '2012-11-05' };


const credentials = {
  accessKeyId: process.env.SQS_ACCESSKEY,
  secretAccessKey: process.env.SQS_SECRETACCESSKEY
};
sqsConfig = {
  credentials,
  region: 'us-east-1',
};

const sqs = new AWS.SQS(sqsConfig);

const params = {
    QueueUrl: process.env.SQS_URL,
  };

console.log('Purging Queue...');
sqs.purgeQueue(params, function (err, data) {
  if (err) console.log(chalk.red(err));
  else console.log(chalk.green('All messages were successfully deleted'));
});


