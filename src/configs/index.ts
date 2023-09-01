import { homedir } from 'os';
import path from 'path';
// export const PATH_ROOT = path.resolve(homedir(), '.gendocker');
export const PATH_ROOT = process.cwd();
export const WORKER = 'http://worker.goprofile.net';
export const GOLOGIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmIwZDA1ZmVhNWRlYWViYTcyYzUwYmEiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NDIzMzQwZmY5MGQyYjU0NjM2YzhhY2IifQ.DlPfALDX5usUrXdFANyebEuM9mVL0RW2MuLx4UDXPC0';
export const CHROME_VERSION = '112.0.5615.49';
export const R2 = {
  endpoint: 'https://4cdea141f001c2c195e4b3c2cf43a74b.r2.cloudflarestorage.com',
  accessKeyId: '69ad83af11ab54d7cfcc2116a15ab1a1',
  secretAccessKey: 'b908426d09b6bdf73399c78c76ba334770196719ff939ab8529b8b93651450e0',
  bucket: 'chrome'
}
