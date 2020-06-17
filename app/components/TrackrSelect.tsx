import React from 'react';
import styles from './TrackrSelect.css';

const TrackrSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  ...rest
}) => {
  return (
    <select className={styles.trackrSelect} {...rest}>
      {children}
    </select>
  );
};

export default TrackrSelect;
