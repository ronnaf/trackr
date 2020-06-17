/* eslint-disable react/prop-types */
import React from 'react';
import styles from './TrackrButton.css';

type Props = {
  onClick: () => void;
  style?: React.CSSProperties;
};

const TrackrButton: React.FC<Props> = ({ children, style, onClick }) => {
  return (
    <button
      type="button"
      className={styles.trackrButton}
      style={style}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default TrackrButton;
