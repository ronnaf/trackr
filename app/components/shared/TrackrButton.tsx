/* eslint-disable react/prop-types */
import React from 'react';
import styles from './TrackrButton.css';

const TrackrButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => {
  return (
    <button {...rest} type="button" className={styles.trackrButton}>
      {children}
    </button>
  );
};

export default TrackrButton;
