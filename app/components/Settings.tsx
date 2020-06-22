import React from 'react';
import TrackrHeader from './shared/TrackrHeader';
import TrackrFooter from './shared/TrackrFooter';
import TrackrInput from './shared/TrackrInput';
import TrackrButton from './shared/TrackrButton';
import TrackrAlert from './shared/TrackrAlert';
import useReadSaveFile from '../hooks/use-read-save';
import routes from '../constants/routes.json';
import trackrFs from '../utils/trackr-fs';

const Settings: React.FC = () => {
  const initialSettings = {
    workdayStartTime: '',
    workdayEndTime: '',
    workHours: 0,
  };

  const [showAlert, setShowAlert] = React.useState(false);
  const [inputValues, setInputValues] = React.useState(initialSettings);

  const saveFile = useReadSaveFile(data => {
    const settings = {};
    Object.keys(data?.settings ?? {}).forEach(key => {
      settings[key] = data.settings?.[key];
    });
    setInputValues({ ...inputValues, ...settings });
  });

  const handleInput = <T,>(field: string, value: T) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  const handleSave = () => {
    const newSave = { ...saveFile, settings: { ...inputValues } };
    const result = trackrFs.save(newSave);
    if (result.success) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div style={{ margin: 8 }}>
      <TrackrHeader title="settings" />
      {showAlert && <TrackrAlert message="Saved!" />}

      <TrackrInput
        title="workday start"
        type="time"
        id="workdayStartTime"
        style={{ fontSize: 15, padding: '2px 8px' }}
        value={inputValues.workdayStartTime}
        onChange={e => handleInput('workdayStartTime', e.target.value)}
      />
      <TrackrInput
        title="workday end"
        type="time"
        id="workdayEndTime"
        style={{ fontSize: 15, padding: '2px 8px' }}
        value={inputValues.workdayEndTime}
        onChange={e => handleInput('workdayEndTime', e.target.value)}
      />
      <TrackrInput
        title="work hours"
        type="number"
        id="workHours"
        style={{ fontSize: 15, padding: '2px 8px' }}
        value={inputValues.workHours}
        onChange={e => handleInput('workHours', e.target.value)}
      />

      <TrackrFooter
        to={routes.HOME}
        linkTitle="← home"
        rightElement={() => (
          <TrackrButton onClick={handleSave} type="button" style={{ fontSize: 14, padding: '4px 14px' }}>
            Save
          </TrackrButton>
        )}
      />
    </div>
  );
};

export default Settings;
