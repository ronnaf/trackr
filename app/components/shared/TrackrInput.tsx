import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: React.CSSProperties;
}

const TrackrInput: React.FC<Props> = props => {
  const { title, style, containerStyle, ...rest } = props;

  let inputStyle = { ...styles.trackrInput, ...style };
  if (title) {
    inputStyle = { ...inputStyle, ...styles.fixedInput };
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: title ? 14 : 0, ...containerStyle }}>
      {title && <div style={{ fontSize: 15, fontWeight: 'lighter', color: '#fff', width: '60%' }}>{title}</div>}
      <input style={inputStyle} {...rest} />
    </div>
  );
};

const styles = {
  trackrInput: {
    padding: '8px 6px',
    border: 0,
    borderRadius: 2,
    outline: 'none',
    color: '#272727',
  },
  fixedInput: {
    width: '40%',
  },
};

export default TrackrInput;
