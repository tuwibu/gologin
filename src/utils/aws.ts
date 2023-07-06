import fs from 'fs';
import AWS from 'aws-sdk';
import Logger from '../helpers/logger';
import { R2 } from '../configs';

export const downloadFileS3 = async ({ fileKey, localPath }: { fileKey: string, localPath: string }): Promise<string> => {
  const { accessKeyId, secretAccessKey, endpoint, bucket } = R2;
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    endpoint: endpoint
  });
  const metadata = await s3.headObject({ Bucket: bucket, Key: fileKey }).promise();
  const totalLength = metadata.ContentLength;
  const readStream = s3.getObject({ Bucket: bucket, Key: fileKey }).createReadStream();
  const writeStream = fs.createWriteStream(localPath);
  let downloaded = 0;
  const progressBarLength = 50;
  const progressBar = Array(progressBarLength).fill(' ');
  readStream.on('data', (chunk) => {
    downloaded += chunk.length;
    if (process.platform == 'win32') {
      const percentage = Math.round((downloaded / totalLength) * 100);
      const progress = Math.round((downloaded / totalLength) * progressBarLength);
      for (let i = 0; i < progress; i++) {
        progressBar[i] = '=';
      }
      const message = `\r[${progressBar.join('')}] ${percentage}%`;
      process.stdout.write(message);
    }
  });
  readStream.pipe(writeStream);
  return new Promise<string>((resolve, reject) => {
    writeStream.on('finish', () => {
      process.stdout.write('\n');
      resolve(localPath);
    });
    writeStream.on('error', (err: Error) => {
      Logger.error(err);
      reject(err);
    });
  });
}