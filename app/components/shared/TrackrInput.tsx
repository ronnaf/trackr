import React from 'react';
import styles from './TrackrInput.css';

const TrackrInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => {
  const { title, ...rest } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: title ? 14 : 0 }}>
      {title && <div style={{ fontSize: 15, fontWeight: 'lighter', color: '#fff', width: '60%' }}>{title}</div>}
      <input className={styles.trackrInput} {...rest} />
    </div>
  );
};

export default TrackrInput;
