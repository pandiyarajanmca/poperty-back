/*eslint-disable */
/**
 * Created by cl-macmini-05 on 07/09/16.
 */

const AWS = require('aws-sdk');
const randomString = require('randomstring');

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKeyId = process.env.S3_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const service = process.env.S3_SERVICE;


module.exports.uploadToS3 = async function (folder,filename,buffer,mime, isPublicFile,cb) {
    try{
        const ext = filename && filename.length > 0 && filename.substr(filename.lastIndexOf('.') || 0,filename.length);
        let timeStamp = Date.now();
        randomString.generate({length: 8})
        filename = randomString.generate({length: 8})+timeStamp+ext;
        AWS.config.update({
            accessKeyId: accessKeyId, 
            secretAccessKey: secretAccessKeyId,
            region: region,
            service: service
        });
        const s3bucket = new AWS.S3();
    
        let params = {
            Bucket: bucketName,
            Key: folder + '/' + filename,
            Body: buffer,
            ContentType: mime
        };
    
        if (isPublicFile) {
            params['ACL'] = 'public-read';
        }
         s3bucket.upload(params, function (err, data) {
            if (err) {
                return cb(err);
            }
            else {
                return cb(null,data.Location);
            }
        });
    } catch(err){
        return cb(err);
    }
};