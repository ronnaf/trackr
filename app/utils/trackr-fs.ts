import fs from 'fs';
import { remote } from 'electron';
import result from './result';

const trackrFs = {
  /** get default save path */
  getSavePath: () => `${remote.app.getPath('appData')}/trackr.json`,

  /** saves file on the host system */
  save: <T>(value: T) => {
    try {
      const path = trackrFs.getSavePath();
      fs.writeFileSync(path, JSON.stringify(value));
      return result.success({});
    } catch (e) {
      return result.failed(e.message);
    }
  },

  /** reads for save file or creates one if its non-existent */
  read: () => {
    const path = trackrFs.getSavePath();
    try {
      const file = fs.readFileSync(path, { encoding: 'utf-8' });
      return result.success(JSON.parse(file));
    } catch (e) {
      if (e?.code === 'ENOENT') {
        trackrFs.save(JSON.stringify({}));
        return result.failed('Save file non-existent, so we created one!');
      }
      return result.failed(e.message);
    }
  },
};

export default trackrFs;
