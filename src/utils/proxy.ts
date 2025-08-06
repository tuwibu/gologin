import axios, { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { WORKER } from '../configs';
import { InfoIpState } from '../typings/api';

const parseProxy = (proxyString: string) => {
  if (!proxyString) return null
  const [host, port, username, password] = proxyString.split(':')
  return {
    host,
    port: Number(port),
    username,
    password
  }
}

export const checkProxy = async (protocol: 'http' | 'https' | 'socks5', proxyString: string): Promise<InfoIpState> => {
  try {
    const proxy = parseProxy(proxyString)
    if (!proxy) throw new Error('Invalid proxy string')
    const { host, port, username, password } = proxy
    let config: AxiosRequestConfig = {};
    if (username && password) {
      let agent = new HttpsProxyAgent(`${protocol}://${username}:${password}@${host}:${port}`);
      config = {
        httpAgent: agent,
        httpsAgent: agent
      }
    } else {
      let agent = new HttpsProxyAgent(`${protocol}://${host}:${port}`);
      config = {
        httpAgent: agent,
        httpsAgent: agent
      }
    }
    const response = await axios({
      url: `${WORKER}/ip`,
      method: 'GET',
      ...config,
      timeout: 10000
    })
    return {
      ...response.data,
      protocol,
      address: `${host}:${port}`,
      username,
      password
    };
  } catch (ex) {
    throw new Error('An error proxy: ' + ex.message)
  }
}