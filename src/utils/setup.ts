import fs from 'fs';
import path from 'path';
import { PATH_ROOT } from '../configs';
import { getExecutablePath, getPlatform, sleep } from './';
import admZip from 'adm-zip';
import { exec } from 'child_process';
import logger from '../helpers/logger';
import axios from 'axios';
import { decompress } from './admZip';
import os from 'os';

const MAC_BROWSER_LINK = 'https://orbita-browser-mac.gologin.com/orbita-browser-latest.tar.gz';
const DEB_BROWSER_LINK = 'https://orbita-browser-linux.gologin.com/orbita-browser-latest.tar.gz';
const WIN_BROWSER_LINK = 'https://orbita-browser-windows.gologin.com/orbita-browser-latest.zip';
const MAC_ARM_BROWSER_LINK = 'https://orbita-browser-mac-arm.gologin.com/orbita-browser-latest.tar.gz';

const download = async(url: string, localPath: string) => {
  const writer = fs.createWriteStream(localPath);
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

const setup = async() => {
  const pathInfo = {
    browser: path.resolve(PATH_ROOT, 'browser'),
    executablePath: getExecutablePath()
  }
  if (!fs.existsSync(pathInfo.executablePath)) {
    fs.mkdirSync(pathInfo.browser, { recursive: true });
    const platform = getPlatform();
    const fileName = platform === 'win' ? `orbita-${platform}.zip` : `orbita-${platform}.tar.gz`;
    logger.info(`Downloading ${fileName}...`);
    const localPath = path.resolve(pathInfo.browser, fileName);
    let downloadLink = platform === 'win' ? WIN_BROWSER_LINK : platform === 'linux' ? DEB_BROWSER_LINK : MAC_BROWSER_LINK;
    if (platform === 'mac' && os.arch() === 'arm64') {
      downloadLink = MAC_ARM_BROWSER_LINK;
    }
    await download(downloadLink, localPath);
    logger.info(`Extracting ${fileName}...`);
    await decompress({ inputFile: localPath, outputDir: pathInfo.browser });
    await sleep(3 * 1000);
    fs.unlinkSync(localPath);
    fs.chmodSync(pathInfo.executablePath, 0o755);
  }
}

export default setup;