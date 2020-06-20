import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

const Settings: React.FC = () => {
  return (
    <div>
      <form>
        <label htmlFor="name">
          <div>Email</div>
          <input id="name" name="name" />
        </label>
      </form>

      <Link to={routes.HOME} style={{ fontSize: 14, color: '#fff' }}>
        home
      </Link>
    </div>
  );
};

export default Settings;
