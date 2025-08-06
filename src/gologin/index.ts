import fs from 'fs'
import path from 'path'
import * as rimraf from 'rimraf'
import puppeteer from 'puppeteer-core'
import { Browser } from 'puppeteer-core'
import { PATH_ROOT, CHROME_VERSION } from '../configs'
import { InfoIpState, ProfileState } from '../typings/api'
import Logger from '../helpers/logger'
import preference from './preference'
import { getExecutablePath } from '../utils'
import { fontsCollection } from './fonts'

class Gologin {
  private profile: ProfileState
  private profilePath: string
  private resolution: string
  private deviceType: 'desktop' | 'mobile'
  private browser: Browser
  private infoIp?: InfoIpState
  constructor(profile: ProfileState, infoIp?: InfoIpState) {
    return (async () => {
      this.profile = profile
      this.resolution = this.profile.fingerprint.navigator.resolution
      const [width, height] = this.resolution.split('x')
      if (Number(width) > 1920) {
        this.resolution = '1920x1080'
        this.profile.fingerprint.navigator.resolution = this.resolution
      }
      this.profilePath = path.join(PATH_ROOT, 'user-data-dir', this.profile.id)
      this.infoIp = infoIp
      rimraf.sync(this.profilePath)
      fs.mkdirSync(this.profilePath, { recursive: true })
      await this.createProfile()
      return this
    })() as unknown as Gologin
  }
  async launch() {
    try {
      const [width, height] = this.resolution.split('x')
      const args = [
        `--no-sandbox`,
        `--user-data-dir=${this.profilePath}`,
        `--window-size=${width},${height}`,
        `--font-masking-mode=2`,
        '--disable-encryption',
        '--window-position=0,0',
        '--restore-last-session',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows'
      ]
      if (this.infoIp) {
        args.push(`--proxy-server=${this.infoIp.address}`)
      }
      this.browser = await puppeteer.launch({
        executablePath: getExecutablePath(),
        headless: false,
        devtools: false,
        args,
        ignoreDefaultArgs: true,
        defaultViewport: null
      })
      return this.browser
    } catch (ex) {
      throw ex
    }
  }

  private parseProxy(proxyString?: string) {
    if (!proxyString) return null
    const [host, port, username, password] = proxyString.split(':')
    return {
      host,
      port: Number(port),
      username,
      password
    }
  }

  private async createProfile() {
    try {
      Logger.info(`Creating profile...`)
      // skip download s3 and sync (test)
      this.generatePreferences()
    } catch (ex) {
      throw ex
    }
  }
  private async generatePreferences() {
    try {
      if (!fs.existsSync(path.join(this.profilePath, 'Default')))
        fs.mkdirSync(path.join(this.profilePath, 'Default'), { recursive: true })
      const jsonObj = {
        ...preference
      }
      jsonObj.gologin.name = this.profile.name
      jsonObj.gologin.startupUrl = ''
      const [width, height] = this.resolution.split('x')
      // fingerprint
      const fingerprint = this.profile.fingerprint
      // device_type
      jsonObj.gologin.userAgent = fingerprint.navigator.userAgent.replace(
        /Chrome\/\d+/,
        `Chrome/${CHROME_VERSION}`
      )
      jsonObj.gologin.navigator.platform = fingerprint.navigator.platform
      jsonObj.gologin.navigator.max_touch_points = fingerprint.navigator.maxTouchPoints
      jsonObj.gologin.hardwareConcurrency = fingerprint.navigator.hardwareConcurrency
      jsonObj.gologin.deviceMemory = fingerprint.navigator.deviceMemory * 1024
      jsonObj.gologin.screenWidth = parseInt(width)
      jsonObj.gologin.screenHeight = parseInt(height)
      jsonObj.gologin.webGl.vendor = fingerprint.webGLMetadata.vendor
      jsonObj.gologin.webgl.metadata.vendor = fingerprint.webGLMetadata.vendor
      jsonObj.gologin.webGl.renderer = fingerprint.webGLMetadata.renderer
      jsonObj.gologin.webgl.metadata.renderer = fingerprint.webGLMetadata.renderer
      jsonObj.gologin.webglParams = fingerprint.webglParams
      // enable value default gologin
      jsonObj.gologin.audioContext.enable = true
      jsonObj.gologin.canvasMode = 'off'
      jsonObj.gologin.client_rects_noise_enable = false
      jsonObj.gologin.mobile.enable = this.deviceType == 'mobile'
      jsonObj.gologin.webglNoiceEnable = false
      jsonObj.gologin.webgl_noice_enable = false
      jsonObj.gologin.webgl_noise_enable = false
      jsonObj.gologin.doNotTrack = false
      // jsonObj.gologin.proxy = this.infoIp
      if (this.infoIp) {
        jsonObj.gologin.proxy = {
          username: this.infoIp.username,
          password: this.infoIp.password
        }
        jsonObj.gologin.webRtc.publicIP = this.infoIp.query
        jsonObj.gologin.webRtc.public_ip = this.infoIp.query
      }
      // webRtc
      jsonObj.gologin.webRtc.local_ip_masking = true
      jsonObj.gologin.webRtc.fill_based_on_ip = true
      // fingerprint value
      jsonObj.gologin.audioContext.noiseValue = this.profile.value.audioContext
      jsonObj.gologin.canvasNoise = this.profile.value.canvas
      jsonObj.gologin.getClientRectsNoice = this.profile.value.clientRects
      jsonObj.gologin.get_client_rects_noise = this.profile.value.clientRects
      jsonObj.gologin.webglNoiseValue = this.profile.value.webgl
      jsonObj.gologin.webgl_noise_value = this.profile.value.webgl
      jsonObj.gologin.mediaDevices.uid = this.profile.value.mediaDevices.uid
      fs.writeFileSync(
        path.resolve(this.profilePath, 'Default', 'Preferences'),
        JSON.stringify(jsonObj, null, 2)
      )
    } catch (ex) {
      throw ex
    }
  }
}

export default Gologin
