import { homedir } from 'os'
import path from 'path'
// export const PATH_ROOT = path.resolve(homedir(), '.gendocker');
export const PATH_ROOT = process.cwd()
export const WORKER = 'http://worker.goprofilev2.net'
export const GOLOGIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjY4ODdhYWM4MTY4ZjEzMGE1ZDkxY2I1MCIsInR5cGUiOiJ1c2VyIiwic3ViIjoiNjg4N2FhYzgxNjhmMTMwYTVkOTFjYjRjIn0.haMF-nz2hmVW43rrBlHieAJQXroKWRVInvosXh3uxtg'
export const CHROME_VERSION = '120'
