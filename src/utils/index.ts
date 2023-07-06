import ip from 'ip';
import os from 'os';
import path from 'path';
import { PATH_ROOT } from '../configs';
import fs from 'fs';
import * as rimraf from 'rimraf';

export const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const sleepRandom = (min: number = 500, max: number = 3000): Promise<void> => sleep(random(min, max));

export const delayRandom = (min: number = 100, max: number = 500): number => random(min, max);

export const getPlatform = (): "win" | "linux" | "mac" => {
  const platform = process.platform;
  if (platform === "darwin") return "mac";
  else if (platform === "win32") return "win";
  else return "linux";
}

/**
 * @example 192.168.1.1
 * @returns {string} - Returns the private IP address of the machine
 */
export const getPrivateIp = (): string => ip.address();

/**
 * @returns {string} - Returns the hostname of the machine
 */
export const getContainerId = (): string => os.hostname();

/**
 * @example
 * getExecutablePath() => 'C:\Users\user\Orbita\browser\orbita-browser\chrome.exe'
 */
export const getExecutablePath = (): string => {
  const platform = getPlatform();
  if (platform == 'mac') return path.resolve(PATH_ROOT, 'browser', 'Orbita-Browser.app', 'Contents', 'MacOS', 'Orbita');
  else if (platform == 'win') return path.resolve(PATH_ROOT, 'browser', 'orbita-browser', 'chrome.exe');
  else return path.resolve(PATH_ROOT, 'browser', 'orbita-browser', 'chrome');
}

export const sanitizeProfile = async(profilePath: string) => {
  try {
    const list = fs.readdirSync(profilePath);
    for (let file of list) {
      if (file != 'Default' && file != 'Local State') {
        rimraf.sync(path.resolve(profilePath, file), {
          maxRetries: 100
        })
      }
    }
    const allow = [
      'Preferences',
      'Local Storage',
      'Network',
      'Session Storage',
      'Favicons',
      'History',
      'Login Data',
      'Login Data For Account',
      // 'Sessions',
      'Cookies',
      'Visited Links',
      'Web Data'
    ];
    for (let file of fs.readdirSync(path.resolve(profilePath, 'Default'))) {
      if (!allow.includes(file)) {
        rimraf.sync(path.resolve(profilePath, 'Default', file), {
          maxRetries: 100
        })
      }
    }
  } catch(ex) {
    throw ex;
  }
}

export const generateStr = (length: number, type: 'hex' | 'number' | 'string') => {
  let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (type) {
    if (type === 'hex') charSet = 'abcdef0123456789';
    if (type === 'number') charSet = '0123456789';
  }
  let randomString = '';
  for (let i = 0; i < length; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const randomDouble = (min: number, max: number, length: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(length));
}