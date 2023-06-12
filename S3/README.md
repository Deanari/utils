### What are this utils for? ###

* S3 testing utilities
  - S3 GET OBJECT: Downloads the specified object to a specified folder.
  - S3 GET OBJECT ATTRIBUTES: Retrieves all the metadata from an object without returning the object itself. 
  - S3 LIST MULTIPART UPLOADS: Returns the list of in-progress multipart uploads.
  - S3 MULTIPART UPLOAD: Uploads a larger file to s3 (min recommended 10MB).
  - S3 ABORT MULTIPART UPLOAD: Abort current multipart upload.
  - S3 CLEAR MULTIPART UPLOADS: Clear all current multipart uploads.
  - S3 PUT OBJECT: Uploads a new object to s3 (max 100 MB, no min).


### How do I get set up? ###

* Npm install
* Create a .env in the bin folder with the following vars
  - S3_BUCKET : name of the testing bucket
  - S3_REGION : region of the testing bucket (can be found at bucket properties on aws console)
  - S3_ACCESSKEY : from the testing user (you can get them with IAM -> users -> select user -> security credentials -> create access key)
  - S3_SECRETACCESSKEY : from the testing user (you get this creating the access key described above)

### How do I use this? ###

* Option 1: go to the bin folder and run the selected script with it's params
  - GET OBJECT: node S3-getObject -k <object_key> -d <destination_folder>
  - GET OBJECT ATTRIBUTES: node S3-getObjectAttributes -k <object_key>
  - LIST MULTIPART UPLOADS: node S3-listMultipartUploads
  - MULTIPART UPLOAD: node S3-multipartUpload -k <object_key> -f <file_path>
  - ABORT MULTIPART UPLOAD: node S3-abortMultipartUpload -k <object_key> --uid <uploadId>
  - CLEAR MULTIPART UPLOADS: node S3-clearMultipartUploads
  - PUT OBJECT: node S3-putObject -k <object_key> -f <file_path>
 
* Option 2: install the script globally to be accesible across all projects 
  - npm install -g . (installs all .bin)

## How do I add more utils ##

* Follow this https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs

### Contribution guidelines ###

* Add whatever you think is usefull, just remember to update this readme

### Who do I talk to? ###

* Karen