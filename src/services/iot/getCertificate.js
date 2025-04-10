import config from '../../config';
import fs from 'fs/promises';
import { existsSync, createWriteStream } from 'fs';
import https from 'https';
import os from 'os';

const { awsMasterUrl, awsMasterName } = config;

export async function checkMasterCertificate() {
  try {
    const certPath = `${os.tmpdir()}/${awsMasterName}.certificate.pem.crt`;
    const keyPath = `${os.tmpdir()}/${awsMasterName}.private.pem.key`;
    const rootCAPath = `${os.tmpdir()}/AmazonRootCA1.pem`;

    if (existsSync(certPath) && existsSync(keyPath) && existsSync(rootCAPath)) {
      return { certPath, keyPath, rootCAPath };
    }

    const downloadPromises = [
      downloadFile(`${awsMasterUrl}/${awsMasterName}.certificate.pem.crt`, certPath),
      downloadFile(`${awsMasterUrl}/${awsMasterName}.private.pem.key`, keyPath),
      downloadFile(`${awsMasterUrl}/AmazonRootCA1.pem`, rootCAPath),
    ];

    await Promise.all(downloadPromises);
    return { certPath, keyPath, rootCAPath };
  } catch (error) {
    throw new Error(error);
  }
}

function downloadFile(url, destination) {
  try {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(destination);

      https
        .get(url, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve(destination);
          });
        })
        .on('error', err => {
          fs.unlink(destination).catch(() => {});
          reject(err);
        });

      file.on('error', err => {
        fs.unlink(destination).catch(() => {});
        reject(err);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}
