### What are this utils for? ###

* SQS testing utilities
  - SQS GET: Reads message in the selected Queue.
  - SQS SEND: Send a new message in the selected Queue
  - SQS DELETE: Delete a selected message in the selected Queue
  - SQS PURGE: Delete all messages in the selected Queue

### How do I get set up? ###

* Npm install
* Create a .env with the following vars
  - SQS_URL : url of the testing queue
  - SQS_ACCESSKEY : from the testing user (you can get them with IAM -> users -> select user -> security credentials -> create access key)
  - SQS_SECRETACCESSKEY : from the testing user (you get this creating the access key described above)

### How do I use this? ###

* Option 1: go to the bin folder and run the selected script with it's params
  - SEND: node SQS-send -p "123"
  - GET: node SQS-get || node SQS-get -n 2 (n = number of messages to get, default 1)
  - PURGE: node SQS-purge
  - DELETE: node SQS-delete -r "string" (r = ReceiptHandle of the SQS message)
* Option 2: install the script globally to be accesible across all proyects 
  - npm install -g . (installs all .bin)

## How do I add more utils ##

* Follow this https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs

### Contribution guidelines ###

* Add whatever you think is usefull, just remember to update this readme

### Who do I talk to? ###

* Karen