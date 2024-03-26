import { fetchProfile } from './utils/api';
import setup from './utils/setup';
import Gologin from './gologin';
import path from 'path';
import { PATH_ROOT } from './configs';
import { sanitizeProfile } from './utils';
import logger from './helpers/logger';
import { compress } from './utils/admZip';
import * as rimraf from 'rimraf';

(async() => {
  try {
    await setup();
    const profile = await fetchProfile('windows');
    const gologin = await new Gologin(profile);
    const browser = await gologin.launch();
    
    // onClose browser
    browser.process().on('close', async() => {
      const profilePath = path.resolve(PATH_ROOT, 'user-data-dir', profile.id);
      logger.info(`Browser closed, sanitizing profile...`);
      await sanitizeProfile(profilePath);
      compress({
        inputDir: profilePath,
        outputFile: path.resolve(PATH_ROOT, 'user-data-dir', `${profile.id}.zip`)
      });
      rimraf.sync(profilePath);
    });
  } catch(ex) {
    logger.error(ex);
  }
})();