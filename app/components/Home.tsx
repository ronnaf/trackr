import React from 'react';

type Project = {
  key: string;
  title: string;
};
type Timeout = ReturnType<typeof setTimeout>;

const projects: Project[] = [
  { key: 'ehrlich', title: 'Ehrlich' },
  { key: 'golive', title: 'GoLive' }
];

export default function Home() {
  const [duration, setDuration] = React.useState<string>('');
  const [localInterval, setLocalInterval] = React.useState<Timeout | null>(
    null
  );

  const start = () => {
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

  const stop = () => {
    if (localInterval) {
      clearInterval(localInterval);
    }
  };

  return (
    <div>
      <h1>timetrackr</h1>
      <div>
        <input placeholder="description" />
        <select>
          {projects.map(project => (
            <option key={project.key} value={project.key}>
              {project.title}
            </option>
          ))}
        </select>
        <button type="button" onClick={start}>
          start
        </button>
        <button type="button" onClick={stop}>
          stop
        </button>
      </div>
      {duration && <div>{duration}</div>}
    </div>
  );
}
