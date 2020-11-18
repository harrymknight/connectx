import React from 'react'
import './style.css'

export default function NavItem(props) {
    return (
        <li className="nav-item">
            {props.icon}
        </li>
    );
}