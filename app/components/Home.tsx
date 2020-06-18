/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-one-expression-per-line */
import React from 'react';
import TrackrButton from './TrackrButton';
import TrackrSelect from './TrackrSelect';
import TrackrInput from './TrackrInput';
import css from './Home.css';

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
    project: projects[0].key,
    startDate: null,
    endDate: null,
    duration: '',
  };

  const [loading, setLoading] = React.useState<boolean>(false);
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
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div style={{ margin: 8 }}>
      <div style={styles.titleContainer}>
        <h1>trackr</h1>

        {/* duration timer */}
        {duration && <div style={styles.durationTimer}>⏱{duration}</div>}
      </div>

      {/* horizontal break */}
      <div style={styles.hr} />

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
          disabled={loading}
          onClick={handleButton}
          style={{ padding: '6px 12px', marginLeft: 12 }}>
          {!duration ? 'start' : 'stop'}
        </TrackrButton>
      </div>

      {/* list of entries */}
      <div className={css.listContainerParent}>
        <div className={css.listContainerChild}>
          {entries.reverse().map(entry => {
            // move to utils
            const formatTime = (date: Date | null): string => {
              const parsed = {
                hours: date?.getHours() ?? 0,
                mins: date?.getMinutes() ?? 0,
              };

              const meridiem = parsed.hours > 11 ? 'PM' : 'PM';
              const formattedHours = // hours in 12-hour format
                parsed.hours > 12 ? parsed.hours - 12 : parsed.hours;

              const hours = `${formattedHours < 10 ? 0 : ''}${formattedHours}`;
              const mins = `${parsed.mins < 10 ? 0 : ''}${parsed.mins}`;

              return `${hours}:${mins}${meridiem}`;
            };

            const currentProject = projects.find(project => {
              return project.key === entry.project;
            });

            return (
              <div key={`${entry.id}`} className={css.listItemContainer}>
                <div style={{ marginRight: 12 }}>
                  <span role="img" aria-label="emoji">
                    👉
                  </span>
                </div>

                {/* description and start-end dates */}
                <div style={{ color: '#F9F9F9' }}>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>
                    {`${entry.description.substr(0, 24)}...`}
                  </div>
                  <div style={styles.durationInTime}>
                    {formatTime(entry.startDate)} -{formatTime(entry.endDate)}
                  </div>
                </div>

                {/* duration, project title */}
                <div style={{ flexGrow: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 15 }}>{entry.duration}</div>
                  <div style={{ fontSize: 12, marginTop: 2, color: '#272727' }}>
                    <span style={{ background: '#F5D472', padding: '0px 4px' }}>
                      {currentProject?.title}
                    </span>
                  </div>
                </div>

                {/* vertical ellipsis (options) */}
                <div style={{ marginLeft: 6 }}>
                  <button type="button" style={styles.vEllipsisButton}>
                    ⋮
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  hr: {
    marginBottom: 24,
    width: 50,
    height: 5,
    borderRadius: 99,
    background: '#FAD45E',
  } as React.CSSProperties,
  durationTimer: {
    margin: '12px 0 8px',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  } as React.CSSProperties,
  durationInTime: {
    fontSize: 13,
    color: '#D5D5D5',
    fontWeight: 'lighter',
  } as React.CSSProperties,
  vEllipsisButton: {
    height: '100%',
    border: 0,
    outline: 'none',
    padding: '0 1px',
    fontSize: 20,
  } as React.CSSProperties,
};

export default Home;
