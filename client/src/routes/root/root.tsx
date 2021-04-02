import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RenderRoutes, RouteConfig } from '../utils';
import './root.css'

const Root: React.FC<RouteConfig> = ({ routes }) => {
  const history = useHistory();
  const location = history.location.pathname.split('/')[1];
  const notInMatch = location === 'profile' || location === 'host' || location === 'matches';
  return (
    <div className='root-container' >
      {notInMatch ? (
          <>
            <div className='root-banner' >
              <Link to={'/profile'}>
                profile
              </Link>
              <Link to={'/host'}>
                host match
              </Link>
              <Link to={'/matches'}>
                matches
              </Link>
            </div>
          </>
        ) : (
          null
        )}
      <div className={'root-main' + !notInMatch ? 'expanded': ''}>
        <RenderRoutes routes={routes} />
      </div>
    </div>
  )
}

export default Root;