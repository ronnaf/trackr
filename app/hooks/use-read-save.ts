import React from 'react';
import fs from '../utils/trackr-fs';

const useReadSaveFile = (onSuccessExtraAction?: <T>(data: T) => void) => {
  const [file, setFile] = React.useState();

  /** storing and reading save files if none exists */
  React.useEffect(() => {
    const result = fs.read();
    if (result.success) {
      setFile(result.data);

      if (onSuccessExtraAction) {
        onSuccessExtraAction(result.data);
      }
    }
  }, []);

  return file;
};

export default useReadSaveFile;
