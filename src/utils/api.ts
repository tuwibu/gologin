import { GOLOGIN_TOKEN, WORKER } from '../configs';
import axios, { AxiosResponse } from 'axios';
import { FingerprintState, ProfileState } from '../typings/api';
import { faker } from '@faker-js/faker';
import { generateStr, randomDouble } from '.';

export const fetchProfile = async(kernel: 'android' | 'windows' | 'linux' | 'mac' | 'macm1' = 'windows'): Promise<ProfileState> => {
  try {
    const response: AxiosResponse<FingerprintState> = await axios({
      method: 'GET',
      url: `${WORKER}/gologin`,
      params: {
        token: GOLOGIN_TOKEN,
        kernel,
      }
    })
    return {
      id: generateStr(5, 'hex'),
      name: faker.name.fullName(),
      value: {
        mediaDevices: {
          uid: generateStr(58, 'hex')
        },
        canvas: randomDouble(0.00000001, 0.99999999, 8),
        webgl: randomDouble(1.00001, 9.99999, 4),
        audioContext: parseFloat(`${randomDouble(1.000000000001, 9.999999999999, 12)}e-8`),
        clientRects: randomDouble(1.00001, 9.99999, 4)
      },
      fingerprint: response.data
    }
  } catch(ex) {
    throw ex;
  }
}