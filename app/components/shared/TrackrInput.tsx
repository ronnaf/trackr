import React from 'react';
import styles from './TrackrInput.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: React.CSSProperties;
}

const TrackrInput: React.FC<Props> = props => {
  const { title, containerStyle, ...rest } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: title ? 14 : 0, ...containerStyle }}>
      {title && <div style={{ fontSize: 15, fontWeight: 'lighter', color: '#fff', width: '60%' }}>{title}</div>}
      <input className={styles.trackrInput} {...rest} />
    </div>
  );
};

export default TrackrInput;
