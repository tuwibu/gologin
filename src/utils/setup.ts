import fs from 'fs';
import path from 'path';
import { downloadFileS3 } from './aws';
import { PATH_ROOT } from '../configs';
import { getExecutablePath, getPlatform } from './';
import admZip from 'adm-zip';
import { exec } from 'child_process';
import logger from '../helpers/logger';

const setup = async() => {
  const pathInfo = {
    browser: path.resolve(PATH_ROOT, 'browser'),
    fonts: path.resolve(PATH_ROOT, 'fonts'),
    executablePath: getExecutablePath()
  }
  if (!fs.existsSync(pathInfo.executablePath)) {
    fs.mkdirSync(pathInfo.browser, { recursive: true });
    const platform = getPlatform();
    const fileName = platform === 'win' ? `orbita-${platform}.zip` : `orbita-${platform}.tar.gz`;
    logger.info(`Downloading ${fileName}...`);
    const localPath = path.resolve(pathInfo.browser, fileName);
    await downloadFileS3({ fileKey: fileName, localPath });
    logger.info(`Extracting ${fileName}...`);
    if (platform === 'win') {
      const zip = new admZip(localPath);
      zip.extractAllTo(pathInfo.browser, true);
    } else {
      exec(`tar xzf ${localPath} --directory ${pathInfo.browser}`);
    }
  }
  if (!fs.existsSync(pathInfo.fonts)) {
    fs.mkdirSync(pathInfo.fonts, { recursive: true });
    const fileName = 'fonts.zip';
    logger.info(`Downloading ${fileName}...`);
    const localPath = path.resolve(pathInfo.fonts, fileName);
    await downloadFileS3({ fileKey: fileName, localPath });
    logger.info(`Extracting ${fileName}...`);
    const zip = new admZip(localPath);
    zip.extractAllTo(pathInfo.fonts, true);
  }
}

export default setup;