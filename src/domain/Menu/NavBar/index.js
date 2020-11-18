import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group';
import FadeContainer from '../../../components/FadeContainer';

import './style.css'

const NavBar = React.forwardRef((props, ref) => {
    return (
        <FadeContainer
            state={true}
            inDelay={0}
            easing="linear"
            outDelay={0}
            onFinish={() => { }}
        >
            <nav ref={ref} className="navbar" >
                <ul className="navbar-nav">
                    {props.children}
                </ul>
            </nav>
        </FadeContainer>
    );
})

export default NavBar;