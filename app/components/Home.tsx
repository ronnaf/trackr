/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-one-expression-per-line */
import React from 'react';
import TrackrButton from './shared/TrackrButton';
import TrackrSelect from './shared/TrackrSelect';
import TrackrInput from './shared/TrackrInput';
import TrackrHeader from './shared/TrackrHeader';
import TrackrFooter from './shared/TrackrFooter';
import TrackrModal from './shared/TrackrModal';
import useReadSaveFile from '../hooks/use-read-save';
import { TimeEntry } from '../utils/result';
import formatter from '../utils/formatter';
import trackrFs from '../utils/trackr-fs';
import routes from '../constants/routes.json';
import css from './Home.css';
import TrackrTextarea from './shared/TrackrTextarea';

const projects: { key: string; title: string }[] = [
  { key: 'ehrlich', title: 'Ehrlich' },
  { key: 'golive', title: 'GoLive' },
];

const Home: React.FC = () => {
  const initialEntry: TimeEntry = {
    id: '',
    description: '',
    project: projects[1].key,
    startDate: null,
    endDate: null,
    duration: '',
  };

  const [workDateString, setWorkDateString] = React.useState<string | null>(null);
  const [workDate, setWorkDate] = React.useState<Date>(new Date());
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<TimeEntry>(initialEntry);
  const [entries, setEntries] = React.useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = React.useState<TimeEntry>(initialEntry);
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [duration, setDuration] = React.useState<string>('');
  const [localInterval, setLocalInterval] = React.useState<ReturnType<typeof setTimeout> | null>(null);
  const [totalDuration, setTotalDuration] = React.useState<{
    decimal: number;
    time: string;
  }>({ decimal: 0, time: '00:00:00' });

  const saveFile = useReadSaveFile(data => {
    setEntries(data.user.records[0]?.entries ?? []);
  });

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

  const calculateTotalDuration = (): void => {
    // calculate duration in decimal
    let totalHours = 0.0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < entries.length; i++) {
      const element = entries[i].duration;
      const splits = element.split(':');

      const hours = parseFloat(splits[0]);
      const minsToHours = parseFloat(splits[1]) / 60;
      const secsToHours = parseFloat(splits[2]) / 3600 || 0;

      totalHours += hours + minsToHours + secsToHours;
    }

    // calculate duration in 00:00 format based on totalHours
    const decSplits = `${totalHours}`.split('.');
    const hours = parseInt(decSplits[0], 10);
    const mins = (totalHours - hours) * 60;

    const minSplits = `${mins}`.split('.');
    const hourStr = decSplits[0].length < 2 ? `0${decSplits[0]}` : decSplits[0];
    const minStr = minSplits[0].length < 2 ? `0${minSplits[0]}` : minSplits[0];

    const durationTime = `${hourStr}:${minStr}`;

    setTotalDuration({ decimal: totalHours, time: durationTime });
  };

  const getCurrentRecordIndex = (): number => {
    const recordIndex = saveFile?.user?.records?.findIndex(rec => {
      const recordedDate = new Date(rec.workDate);
      return recordedDate.getDate() === workDate?.getDate();
    });
    return recordIndex;
  };

  const handleRecordButton = (): void => {
    setLoading(true);
    if (!duration) {
      start();
    } else {
      // 1. stop timer
      stop();

      // 2. store form value data to entries
      const entry = { ...formValues, id: `${Math.random()}`, endDate: new Date(), duration };
      const newEntries = [...entries, entry];
      setEntries(newEntries);

      // 3. save to trackr.json file
      const newSave = { ...saveFile };
      const recordIndex = getCurrentRecordIndex();

      if (recordIndex !== -1) {
        // if a record is found
        newSave.user.records[recordIndex].entries.push(entry);
        trackrFs.save(newSave);
      } else {
        newSave.user.records.push({ workDate, entries: newEntries });
        trackrFs.save(newSave);
      }

      // 4. clear duration + form values
      setDuration('');
      setFormValues(initialEntry);
    }
    setLoading(false);
  };

  const handleDelete = (id: string): void => {
    if (entries.length) {
      const entryIndex = entries.findIndex(entry => entry.id === id);

      // local state changes
      const newEntries = [...entries];
      newEntries.splice(entryIndex, 1);
      setEntries(newEntries);

      // save to trackr.json file
      const newSave = { ...saveFile };
      const recordIndex = getCurrentRecordIndex();
      if (recordIndex !== -1) {
        newSave.user.records[recordIndex].entries.splice(entryIndex, 1);
        trackrFs.save(newSave);
      }
    }
  };

  /** calculate total duration if the entries change  */
  React.useEffect(() => {
    calculateTotalDuration();
  }, [entries.length]);

  /** get current workday e.g. June 21st */
  React.useEffect(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const now = new Date();
    const workdayStartTime = saveFile?.settings?.workdayStartTime;
    const month = months[now.getMonth()];

    if (Date.parse(`01/01/2001 ${now.toTimeString()}`) < Date.parse(`01/01/2001 ${workdayStartTime}:00`)) {
      // if the current time is before 10pm, set work date the day before
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      setWorkDateString(`${month} ${yesterday.getDate()}${formatter.getNumberSuffix(yesterday.getDate())}`);
      setWorkDate(yesterday);
    } else {
      // if the current time is after 10pm, set date as is
      setWorkDateString(`${month} ${now.getDate()}${formatter.getNumberSuffix(now.getDate())}`);
      setWorkDate(now);
    }
  }, [saveFile]);

  return (
    <div style={{ margin: 8 }}>
      <TrackrHeader
        title="trackr"
        rightElement={() => (duration ? <div style={styles.durationTimer}>⏱{duration}</div> : null)}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TrackrInput
          containerStyle={{ flexGrow: 1 }}
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

        {/* record button */}
        <TrackrButton disabled={loading} onClick={handleRecordButton} style={{ padding: '6px 12px', marginLeft: 12 }}>
          {!duration ? 'start' : 'stop'}
        </TrackrButton>
      </div>

      {/* list header */}
      <div style={styles.listHeaderContainer}>
        <div style={{ color: '#fff' }}>{workDateString}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TrackrButton type="button">&larr;</TrackrButton>
          <TrackrButton type="button" style={{ marginLeft: 4 }}>
            &rarr;
          </TrackrButton>
        </div>
      </div>

      {/* list of entries */}
      <div className={css.listContainerParent}>
        <div className={css.listContainerChild}>
          {entries.map(entry => {
            const currentProject = projects.find(project => {
              return project.key === entry.project;
            });

            return (
              <div key={`${entry.id}`} className={css.listItemContainer}>
                <div style={styles.pointerEmoji}>&#128073;</div>

                {/* description and start-end dates */}
                <div style={{ color: '#F9F9F9', margin: '4px 0' }}>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>
                    {entry.description
                      ? `${entry.description.substr(0, 20)}${entry.description.length > 16 ? '...' : ''}`
                      : 'no description'}
                  </div>
                  <div style={styles.durationInTime}>
                    {formatter.formatTime(entry.startDate)} - {formatter.formatTime(entry.endDate)}
                  </div>
                </div>

                {/* duration, project title */}
                <div style={styles.rightListItemContainer}>
                  <div style={{ fontSize: 15 }}>{entry.duration}</div>
                  <div style={{ fontSize: 12, marginTop: 2, color: '#272727' }}>
                    <span style={{ background: '#F5D472', padding: '0px 3px' }}>{currentProject?.title}</span>
                  </div>
                </div>

                {/* vertical ellipsis (options) */}
                <div style={{ marginLeft: 6 }}>
                  <button
                    className={css.ellipsisButton}
                    type="button"
                    onClick={() => {
                      setCurrentEntry(entry);
                      setModalOpen(true);
                    }}>
                    &#8942;
                  </button>
                </div>
              </div> // list item
            );
          })}
        </div>
      </div>

      {/* modal */}
      <TrackrModal
        visible={isModalOpen}
        onClose={() => {
          setCurrentEntry(initialEntry);
          setModalOpen(false);
        }}
        leftComponent={() => (
          <React.Fragment>
            <TrackrButton style={{ marginRight: 4 }}>edit</TrackrButton>
            <TrackrButton
              style={{ marginRight: 4 }}
              onClick={() => {
                handleDelete(currentEntry.id);
                setModalOpen(false);
              }}>
              delete
            </TrackrButton>
          </React.Fragment>
        )}>
        <TrackrTextarea rows={1} style={styles.textArea} defaultValue={'make it with you get out of my head pleasez'} />
        <div style={{ fontWeight: 'lighter', fontSize: 14, marginTop: 8 }}>
          {/* subtext: 07:50PM - 07:50PM | 00:00:09 */}
          {formatter.formatTime(currentEntry.startDate)} - {formatter.formatTime(currentEntry.endDate)} |{' '}
          {currentEntry.duration}
        </div>
      </TrackrModal>

      {/* footer */}
      <TrackrFooter
        to={routes.SETTINGS}
        linkTitle="settings"
        rightElement={() => (
          <React.Fragment>
            <span style={styles.lighterText}>this day</span>
            <span style={{ fontWeight: 'bold', color: '#fff' }}>
              {totalDuration.time} | {totalDuration.decimal.toFixed(2)}
            </span>
          </React.Fragment>
        )}
      />
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
  durationInTime: {
    fontSize: 13,
    color: '#D5D5D5',
    fontWeight: 'lighter',
  } as React.CSSProperties,
  listHeaderContainer: {
    margin: '24px 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  pointerEmoji: {
    marginRight: 6,
    lineHeight: '28px',
  } as React.CSSProperties,
  rightListItemContainer: {
    flexGrow: 1,
    margin: '3px 0 6px',
    textAlign: 'right',
  } as React.CSSProperties,
  lighterText: {
    fontWeight: 'lighter',
    color: '#d5d5d5',
    marginRight: 8,
  } as React.CSSProperties,
  textArea: {
    padding: 0,
    fontSize: 16,
    color: '#333333',
    background: '#F5D472',
    width: '100%',
    overflow: 'hidden',
    resize: 'vertical',
    minHeight: 18,
  } as React.CSSProperties,
};

export default Home;
