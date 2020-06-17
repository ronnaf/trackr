import React from 'react';
import styles from './TrackrInput.css';

const TrackrInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...rest
}) => {
  return <input className={styles.trackrInput} {...rest} />;
};

export default TrackrInput;
