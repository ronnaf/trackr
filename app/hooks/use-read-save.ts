import React from 'react';
import fs from '../utils/trackr-fs';
import { ResultData } from '../utils/result';

const useReadSaveFile = (onSuccessExtraAction?: (data: ResultData) => void): ResultData => {
  const [file, setFile] = React.useState();

  /** storing and reading save files if none exists */
  React.useEffect(() => {
    const result = fs.read();
    if (result.success) {
      setFile(result.data);

      if (onSuccessExtraAction) {
        onSuccessExtraAction(result.data as ResultData);
      }
    }
  }, []);

  return file;
};

export default useReadSaveFile;
