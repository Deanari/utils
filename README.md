# README #

Hello there.
This is a personal collection of some scripts I use to make my life easier when working with AWS in node.

### What can I find here? ###

* S3 testing utilities
  - S3 GET OBJECT: Downloads the specified object to a specified folder.
  - S3 GET OBJECT ATTRIBUTES: Retrieves all the metadata from an object without returning the object itself. 
  - S3 LIST MULTIPART UPLOADS: Returns the list of in-progress multipart uploads.
  - S3 MULTIPART UPLOAD: Uploads a larger file to s3 (min recommended 10MB).
  - S3 ABORT MULTIPART UPLOAD: Abort current multipart upload.
  - S3 CLEAR MULTIPART UPLOADS: Clear all current multipart uploads.
  - S3 PUT OBJECT: Uploads a new object to s3 (max 100 MB, no min).

* SQS testing utilities
  - SQS GET: Reads message in the selected Queue.
  - SQS SEND: Send a new message in the selected Queue
  - SQS DELETE: Delete a selected message in the selected Queue
  - SQS PURGE: Delete all messages in the selected Queue

### How do I use this? ###

Please reffer to the specific folder for the specific README with instructions.
