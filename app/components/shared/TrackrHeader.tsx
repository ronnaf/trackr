import React, { ComponentType } from 'react';

type Props = {
  title: string;
  rightElement?: ComponentType;
};

const TrackrHeader: React.FC<Props> = ({ title, rightElement: RightElement }) => {
  return (
    <>
      <div style={styles.titleContainer}>
        <h1>{title}</h1>
      </div>

      {/* horizontal break */}
      {RightElement && <RightElement />}
      <div style={styles.hr} />
    </>
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
};

export default TrackrHeader;
