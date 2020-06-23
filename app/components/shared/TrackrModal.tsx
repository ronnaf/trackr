import React from 'react';
import TrackrButton from './TrackrButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** component(s) on the lower left corner of the modal */
  leftComponent?: React.ComponentType;
};

const TrackrModal: React.FC<Props> = ({ visible, children, onClose, leftComponent: LeftComponent }) => {
  if (!visible) {
    return null;
  }
  return (
    <div style={styles.modalContainer}>
      <div style={styles.modalContent}>
        {children}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          <div>{LeftComponent && <LeftComponent />}</div>
          <TrackrButton onClick={onClose}>close</TrackrButton>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalContainer: {
    background: 'rgb(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  modalContent: {
    width: '100%',
    background: '#F5D472',
    color: '#333333',
    margin: '-42px 24px 24px',
    padding: 16,
    borderRadius: 2,
  } as React.CSSProperties,
};

export default TrackrModal;
