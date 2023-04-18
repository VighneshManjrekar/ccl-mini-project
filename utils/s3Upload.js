const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;
const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

exports.upload = async (file, user) => {
  const buffer = await sharp(file.buffer)
    .resize({ height: 200, width: 200, fit: "cover" })
    .toFormat("jpeg")
    .toBuffer();
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: user._id.toString(),
    Body: buffer,
    ContentType: "image/jpeg",
  });
  const res = await s3.send(command);
  console.log(res.Location);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: user._id.toString(),
  };
  const getCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 2147483647 });
  user.profile = url;
};
