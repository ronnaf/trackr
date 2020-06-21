import React from 'react';

type Props = {
  message: string;
};

const TrackrAlert: React.FC<Props> = ({ message }) => {
  return (
    <div style={{ position: 'absolute', top: 0, width: '100vw', marginLeft: -16 }}>
      <div style={{ padding: '8px 16px', background: '#FF9E9E', color: '#fff', fontWeight: 'bold' }}>
        <span role="img" aria-label="lightning">
          ⚡️
        </span>
        <span style={{ marginLeft: 4 }}>{message}</span>
      </div>
    </div>
  );
};

export default TrackrAlert;
