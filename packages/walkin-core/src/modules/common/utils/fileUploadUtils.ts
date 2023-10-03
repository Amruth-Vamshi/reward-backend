import AWS, { S3 } from "aws-sdk";
import { ACCESS_TYPES } from "../constants";
import {
  WalkinError,
  WalkinPlatformError
} from "../exceptions/walkin-platform-error";
import { v2 as cloudinary } from "cloudinary";

const AWS_REGION = "";
const EXPIRES_AFTER_VALUE = 3600;

export const validateS3Configuration = (configuration: any) => {
  if (!configuration.region) {
    throw new WalkinPlatformError(
      "INVALID_S3_CONFIGURATION_REGION",
      "Inavlid S3 Configuration value region"
    );
  }
  if (!configuration.accessKeyId) {
    throw new WalkinPlatformError(
      "INVALID_S3_CONFIGURATION_ACCESS_KEY_ID",
      "Inavlid S3 Configuration value accessKeyId"
    );
  }
  if (!configuration.secretAccessKey) {
    throw new WalkinPlatformError(
      "INVALID_S3_CONFIGURATION_SECRET_ACCESS_KEY_ID",
      "Inavlid S3 Configuration value secretAccessKeyId"
    );
  }
  if (!configuration.Bucket) {
    throw new WalkinPlatformError(
      "INVALID_S3_CONFIGURATION_BUCKET",
      "Inavlid S3 Configuration value Bucket"
    );
  }
};

export const uploadToS3 = async (
  fileName: string,
  file: any,
  accessType: string,
  configuration: any
) => {
  //validates s3 configuration
  validateS3Configuration(configuration);

  let awsConfig = {
    region: configuration.region || AWS_REGION,
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey
  };
  AWS.config.update(awsConfig);
  const { createReadStream, filename, mimetype, encoding } = await file;
  const fileStream = createReadStream();
  const s3 = new S3({ apiVersion: configuration.apiVersion || "2006-03-01" });
  const uploadParams = {
    Bucket: configuration.Bucket,
    Key: fileName,
    Body: fileStream
  };
  let uploadPromise = s3.upload(uploadParams).promise();

  return uploadPromise
    .then(async data => {
      let result: any = {};
      console.log(data);

      result = { ...data };
      console.log("AccessType", accessType);
      // if public then return signed url of configured expiry time
      if (accessType === ACCESS_TYPES.PUBLIC) {
        const getSignedUrlParams = {
          Bucket: uploadParams.Bucket,
          Key: uploadParams.Key,
          Expires: configuration.Expires || EXPIRES_AFTER_VALUE
        };
        await new Promise((resolve, reject) => {
          s3.getSignedUrl("getObject", getSignedUrlParams, (err, url) => {
            if (err) {
              console.log("Signed url generation error", err);
              // FIXME: throw walkin error
              reject(err);
            }
            // setting url to signedUrl.
            result.signedUrl = url;
            resolve(url);
          });
        }).then(res => {
          console.log("Signed Url", res);
        });
      }
      return result;
    })
    .catch(err => {
      console.log("Error", err);
      throw new WalkinError("Failed to update S3");
    });
};

export const presignedUrlS3 = async (filename: string, configuration: any) => {
  console.log("bucket", configuration, "filename", filename);
  //validates s3 configuration
  validateS3Configuration(configuration);

  AWS.config.update({
    region: configuration.region || AWS_REGION,
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey
  });
  const s3 = new S3({ apiVersion: configuration.apiVersion || "2006-03-01" });
  let result: any = {};
  const getSignedUrlParams = {
    Bucket: configuration.Bucket,
    Key: filename,
    Expires: configuration.Expires || EXPIRES_AFTER_VALUE
  };
  return s3
    .getSignedUrlPromise("putObject", getSignedUrlParams)
    .then(url => {
      result.url = url;
      return result;
    })
    .catch(err => {
      throw new WalkinError("Failed to generate signed url");
    });
};

export const validateCloudinaryConfiguration = (configuration: any) => {
  if (!configuration.cloud_name) {
    throw new WalkinPlatformError(
      "INVALID_CLOUDINARY_CONFIGURATION_CLOUD_NAME",
      "Inavlid Cloudinary Configuration cloud_name value"
    );
  }
  if (!configuration.api_key) {
    throw new WalkinPlatformError(
      "INVALID_CLOUDINARY_CONFIGURATION_API_KEY",
      "Inavlid Cloudinary Configuration value api_key"
    );
  }
  if (!configuration.api_secret) {
    throw new WalkinPlatformError(
      "INVALID_CLOUDINARY_CONFIGURATION_API_SECRET",
      "Inavlid Cloudinary Configuration value api_secret"
    );
  }
};

export const uploadToCloudinary = async (
  fileName: string,
  file: any,
  configuration: any
) => {
  // validation of cloudinary configuration
  validateCloudinaryConfiguration(configuration);
  // setting configuration
  cloudinary.config(configuration);
  let response = await new Promise(async (resolve, reject) => {
    // TODO: Fix this
    let stream = cloudinary.uploader.upload_stream(
      "basic_upload_preset_1",
      (error: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    const { createReadStream } = await file;
    createReadStream().pipe(stream);
  }).catch(error => {
    console.log("Error uploading to cloudinary", error);
    throw new WalkinError("Failed to upload image");
  });
  return response;
};

export const preSignedUrlToCloudinary = async (
  file: string,
  configuration: any,
  requestOptions: any
) => {
  // validation of cloudinary configuration
  validateCloudinaryConfiguration(configuration);
  cloudinary.config(configuration);
  return cloudinary.uploader.upload(file, requestOptions);
};
