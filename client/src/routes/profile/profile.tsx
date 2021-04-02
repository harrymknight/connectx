import React, { useEffect } from 'react';
import { RouteConfig } from '../';
import { Logout } from './components/logout';
import './profile.css';

const Profile: React.FC<RouteConfig> = () => {

    return (
        <div className='profile-page' >
            <div>
                profile
            </div>
            <Logout />
        </div>
    )
}

export default Profile