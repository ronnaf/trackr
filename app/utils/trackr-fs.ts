import fs from 'fs';
import { remote } from 'electron';
import result, { ResultData } from './result';

const initialSettings: ResultData = {
  settings: {
    workdayStartTime: '22:00',
    workdayEndTime: '',
    workHours: 0,
    projects: [],
  },
  user: {
    records: [],
  },
};

const trackrFs = {
  /** get default save path */
  getSavePath: () => `${remote.app.getPath('appData')}/trackr.json`,

  /** saves file on the host system */
  save: <T>(value: T) => {
    try {
      const path = trackrFs.getSavePath();
      fs.writeFileSync(path, JSON.stringify(value));
      return result.success(undefined);
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
        trackrFs.save(initialSettings);
        return result.failed('Save file non-existent, so we created one!');
      }
      return result.failed(e.message);
    }
  },
};

export default trackrFs;
