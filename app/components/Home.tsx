/* eslint-disable prettier/prettier,react/jsx-one-expression-per-line,@typescript-eslint/no-use-before-define */
import React from 'react';
import TrackrButton from './TrackrButton';
import TrackrSelect from './TrackrSelect';
import TrackrInput from './TrackrInput';

type Timeout = ReturnType<typeof setTimeout>;
type TimeEntry = {
  id: string;
  description: string;
  project: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: string;
};
type Project = {
  key: string;
  title: string;
};

const projects: Project[] = [
  { key: 'ehrlich', title: 'Ehrlich' },
  { key: 'golive', title: 'GoLive' },
];

const Home: React.FC = () => {
  const initialEntry: TimeEntry = {
    id: '',
    description: '',
    project: '',
    startDate: null,
    endDate: null,
    duration: '',
  };

  const [formValues, setFormValues] = React.useState<TimeEntry>(initialEntry);
  const [entries, setEntries] = React.useState<TimeEntry[]>([]);
  const [duration, setDuration] = React.useState<string>('');
  const [localInterval, setLocalInterval] = React.useState<Timeout | null>(
    null
  );

  const updateFormValues = <T,>(field: string, value: T): void => {
    setFormValues({ ...formValues, [field]: value });
  };

  const start = (): void => {
    updateFormValues('startDate', new Date());

    const startDateMillis = Date.now();
    const interval = setInterval(() => {
      const durationInSecs = (Date.now() - startDateMillis) / 1000;

      const hours = Math.floor(durationInSecs / 3600);
      const mins = Math.floor((durationInSecs - hours * 3600) / 60);
      const secs = Math.floor(durationInSecs - hours * 3600 - mins * 60);

      const hoursStr = `${hours < 10 ? 0 : ''}${hours}`;
      const minsStr = `${mins < 10 ? 0 : ''}${mins}`;
      const secsStr = `${secs < 10 ? 0 : ''}${secs}`;

      setDuration(`${hoursStr}:${minsStr}:${secsStr}`);
    }, 1000);

    setLocalInterval(interval);
  };

  const stop = (): void => {
    if (localInterval) {
      clearInterval(localInterval);
    }
  };

  const handleButton = (): void => {
    if (!duration) {
      start();
    } else {
      // 1. stop timer
      stop();

      // 2. store form value data to entries
      setEntries([
        ...entries,
        {
          ...formValues,
          id: `${Math.random()}`,
          endDate: new Date(),
          duration,
        },
      ]);

      // 3. clear duration + form values
      setDuration('');
      setFormValues(initialEntry);
    }
  };

  return (
    <div style={{ margin: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <h1>trackr</h1>

        {/* duration timer */}
        {duration && <div style={styles.durationTimer}>{duration}</div>}
      </div>

      {/* horizontal break */}
      <div
        style={{
          marginBottom: 24,
          width: 50,
          height: 5,
          borderRadius: 99,
          background: '#FAD45E',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TrackrInput
          style={{ flexGrow: 1 }}
          disabled={!!duration}
          placeholder="Description"
          onChange={e => updateFormValues('description', e.target.value)}
          value={formValues.description}
        />
        <TrackrSelect
          style={{ marginLeft: 4 }}
          disabled={!!duration}
          value={formValues.project}
          onChange={e => updateFormValues('project', e.target.value)}>
          {projects.map(project => (
            <option key={project.key} value={project.key}>
              {project.title}
            </option>
          ))}
        </TrackrSelect>

        <TrackrButton
          onClick={handleButton}
          style={{ padding: '6px 12px', marginLeft: 12 }}>
          {!duration ? 'start' : 'stop'}
        </TrackrButton>
      </div>

      {/* list of entries */}
      <div style={{ marginTop: 24 }}>
        {entries.map(entry => {
          // move to utils
          const formatTime = (date: Date | null): string => {
            const hours = `${date?.getHours() < 10 ? 0 : ''}${date?.getHours()}`
            const mins = `${date?.getMinutes() < 10 ? 0 : ''}${date?.getMinutes()}`
            const secs = `${date?.getSeconds() < 10 ? 0 : ''}${date?.getSeconds()}`
            return `${hours}:${mins}:${secs}`;
          };

          return (
            <div key={`${entry.id}`} style={{ color: '#fff', display: 'flex', marginBottom: 16 }}>
              <div style={{ marginRight: 12 }}><span role="img" aria-label="emoji">👉</span></div>
              <div style={{ color: '#F9F9F9' }}>
                <div style={{ fontSize: 15, marginBottom: 4 }}>{entry.description}</div>
                <div style={{ fontSize: 14, color: '#D5D5D5', fontWeight: 'lighter' }}>
                  {formatTime(entry.startDate)} - {formatTime(entry.endDate)}
                </div>
              </div>
              <div style={{ flexGrow: 1, textAlign: 'right', fontSize: 15 }}>{entry.duration}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  durationTimer: {
    margin: '12px 0 8px',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  } as React.CSSProperties,
};

export default Home;
