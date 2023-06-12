require('dotenv').config({ path: __dirname + '/.env' });
const yargs = require("yargs");
const options = yargs
 .usage("Usage: -n <number>")
 .option("n", { alias: "number", describe: "Number of messages", type: "number", demandOption: false })
 .argv;

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

var params = {
  QueueUrl: process.env.SQS_URL,
  AttributeNames: ['All'], //TODO limpiar
  MaxNumberOfMessages: `${options.number || 1}`,
};

console.log("Receiving messages...");
sqs.receiveMessage(params, function (err, data) {
  if (err) console.log(chalk.red(err));
  else {
    if(data && data.Messages) {
      console.log(data.Messages)
    } else {
      console.log(chalk.green('No messages to display'))
    }
  };
});
