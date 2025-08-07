import { fetchProfile } from './utils/api'
import setup from './utils/setup'
import Gologin from './gologin'
import path from 'path'
import { PATH_ROOT } from './configs'
import { sanitizeProfile, sleep } from './utils'
import logger from './helpers/logger'
import { compress } from './utils/admZip'
import * as rimraf from 'rimraf'
import fs from 'fs'
import { checkProxy } from './utils/proxy'

(async () => {
  try {
    await setup()
    // const profile = await fetchProfile('windows')
    // fs.writeFileSync(path.resolve(PATH_ROOT, 'profile.json'), JSON.stringify(profile, null, 2))
    const profile = JSON.parse(fs.readFileSync(path.resolve(PATH_ROOT, 'profile.json'), 'utf8'))
    // proxy
    // const proxyString = 'v2.proxyempire.io:5000:r_82fb16f049-country-ng-sid-gjj206dc:7f1cf5876f'
    // const infoIp = await checkProxy('http', proxyString)
    // const gologin = await new Gologin(profile, infoIp)

    // no proxy
    const gologin = await new Gologin(profile)
    const browser = await gologin.launch()

    const page = await browser.newPage()
    await page.goto('https://www.google.com')
    console.log('screenshot')
    await page.screenshot({ path: 'screenshot.png' })
    await sleep(50000)
    console.log('close')
    await browser.close()

    // onClose browser
    browser.process().on('close', async () => {
      const profilePath = path.resolve(PATH_ROOT, 'user-data-dir', profile.id)
      logger.info(`Browser closed, sanitizing profile...`)
      await sanitizeProfile(profilePath)
      compress({
        inputDir: profilePath,
        outputFile: path.resolve(PATH_ROOT, 'user-data-dir', `${profile.id}.zip`)
      })
      // rimraf.sync(profilePath)
    })
  } catch (ex) {
    logger.error(ex)
  }
})()
