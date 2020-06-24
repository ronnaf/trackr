import React from 'react';
import TrackrHeader from './shared/TrackrHeader';
import TrackrFooter from './shared/TrackrFooter';
import TrackrInput from './shared/TrackrInput';
import TrackrButton from './shared/TrackrButton';
import TrackrAlert from './shared/TrackrAlert';
import useReadSaveFile from '../hooks/use-read-save';
import routes from '../constants/routes.json';
import trackrFs from '../utils/trackr-fs';

/**
 * another giant mess-- refactor
 * @constructor
 */
const Settings: React.FC = () => {
  const initialSettings = {
    projects: [] as { key: string; title: string }[],
    workdayStartTime: '',
    workdayEndTime: '',
    workHours: 0,
  };

  const [showAlert, setShowAlert] = React.useState(false);
  const [inputValues, setInputValues] = React.useState(initialSettings);
  const [timeoutInstance, setTimeoutInstance] = React.useState<>(undefined);

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

  const handleArrayInput = (index: number, value: string): void => {
    const newProjects = [...inputValues.projects];
    newProjects[index].title = value;
    setInputValues({ ...inputValues, projects: newProjects });
  };

  const removeArrayInput = (index: number): void => {
    if (inputValues.projects.length > 1) {
      const newProjects = [...inputValues.projects];
      newProjects.splice(index, 1);
      setInputValues({ ...inputValues, projects: newProjects });
    }
  };

  const handleAddProject = () => {
    const key = Math.random()
      .toString(36)
      .substring(2);

    const newProjects = [...inputValues.projects, { key, title: '' }];
    setInputValues({ ...inputValues, projects: newProjects });
  };

  const handleSave = () => {
    const newSave = { ...saveFile, settings: { ...inputValues } };
    const result = trackrFs.save(newSave);
    if (result.success) {
      setShowAlert(true);
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setTimeoutInstance(timeout);
    }
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutInstance);
    };
  });

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

      <div style={{ display: 'flex' }}>
        <div style={{ width: '56%' }}>
          <div style={styles.label}>projects</div>
          <TrackrButton onClick={handleAddProject}>Add Project</TrackrButton>
        </div>
        <div style={{ width: '44%' }}>
          {!inputValues.projects.length && <span style={{ color: '#fff' }}>none</span>}
          {inputValues.projects.map((project, i) => {
            return (
              <div key={project.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <TrackrInput
                  style={{ fontSize: 14, padding: '3px 8px', width: '100%' }}
                  onChange={e => handleArrayInput(i, e.target.value)}
                  value={inputValues.projects[i].title}
                  type="text"
                />
                <TrackrButton style={{ height: 20, marginLeft: 4 }} onClick={() => removeArrayInput(i)}>
                  <span>x</span>
                </TrackrButton>
              </div>
            );
          })}
        </div>
      </div>

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

const styles = {
  label: {
    fontSize: 15,
    fontWeight: 'lighter',
    color: '#fff',
    marginBottom: 14,
  } as React.CSSProperties,
};

export default Settings;
