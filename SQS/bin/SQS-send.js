require('dotenv').config({ path: __dirname + '/.env' });
const yargs = require("yargs");
const options = yargs
 .usage("Usage: -p <idPrintJob>")
 .option("p", { alias: "idPrintJob", describe: "id PrintJob", type: "string", demandOption: true })
 .argv;

const chalk = require("chalk");

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
let sqsConfig = { apiVersion: '2012-11-05' };


const credentials = {
  accessKeyId: process.env.SQS_ACCESSKEY,
  secretAccessKey: process.env.SQS_SECRETACCESSKEY,
};
sqsConfig = {
  credentials,
  region: 'us-east-1',
};

const sqs = new AWS.SQS(sqsConfig);

const params = {
    MessageBody: `{"obj": { "idPrintJob": "${options.idPrintJob}", "type": "printjob"}}`,
    QueueUrl: process.env.SQS_URL,
    MessageDeduplicationId: "test", 
    MessageGroupId: "Group1",
  };

console.log("Sending message...");
sqs.sendMessage(params, function (err, data) {
  if (err) console.log(chalk.red.bold(err));
  else console.log(data);
});


