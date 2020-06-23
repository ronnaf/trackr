import React, { ComponentType } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  linkTitle: string;
  rightElement?: ComponentType;
};

const TrackrFooter: React.FC<Props> = ({ to, linkTitle, rightElement: RightElement }) => {
  return (
    <div style={styles.footerContainerParent}>
      <div style={styles.footerContainerChild}>
        <Link to={to} style={{ fontSize: 14, color: '#fff' }}>
          {linkTitle}
        </Link>
        <div>{RightElement && <RightElement />}</div>
      </div>
    </div>
  );
};

const styles = {
  footerContainerParent: {
    width: '100vw',
    position: 'absolute',
    bottom: 0,
    marginLeft: '-16px',
    backgroundColor: 'rgba(255, 255, 255, .15)',
    backdropFilter: 'blur(5px)',
  } as React.CSSProperties,
  footerContainerChild: {
    margin: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
};

export default TrackrFooter;
