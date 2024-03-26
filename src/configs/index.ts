import { homedir } from 'os'
import path from 'path'
// export const PATH_ROOT = path.resolve(homedir(), '.gendocker');
export const PATH_ROOT = process.cwd()
export const WORKER = 'http://worker.goprofile.net'
export const GOLOGIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmIwZDA1ZmVhNWRlYWViYTcyYzUwYmEiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NDIzMzQwZmY5MGQyYjU0NjM2YzhhY2IifQ.DlPfALDX5usUrXdFANyebEuM9mVL0RW2MuLx4UDXPC0'
export const CHROME_VERSION = '120'
