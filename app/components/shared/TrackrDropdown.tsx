import React from 'react';
import css from './TrackrDropdown.css';

type Props = {};

const TrackrDropdown: React.FC<Props> = () => {
  return (
    <div className={css.container}>
      <button className={css.ellipsisButton} type="button">
        &#8942;
      </button>
    </div>
  );
};

export default TrackrDropdown;
