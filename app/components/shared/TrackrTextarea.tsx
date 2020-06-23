import React from 'react';
import css from './TrackrTextarea.css';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerStyle?: React.CSSProperties;
}

const TrackrTextarea: React.FC<Props> = props => {
  const { title, value, containerStyle, ...rest } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: title ? 14 : 0, ...containerStyle }}>
      {title && <div style={{ fontSize: 15, fontWeight: 'lighter', color: '#fff', width: '60%' }}>{title}</div>}
      <textarea className={css.trackrTextarea} {...rest} />
    </div>
  );
};

export default TrackrTextarea;
