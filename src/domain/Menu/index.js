import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group';
import NavBar from './NavBar'
import NavItem from './NavItem'
import Gear from '../../components/Gear'
import Counter from '../../components/Counter'
import Slot from '../../components/Slot'
import './style.css'

export default function Menu(props) {
    const nodeRef = useRef(null);
    return (
        <CSSTransition
            in={props.isMenu}
            nodeRef={nodeRef}
            unmountOnExit
            timeout={500}
            classNames="menu-primary"
        >
            <div ref={nodeRef} className='menu' >
                <NavBar>
                    <NavItem icon={<Gear />} />
                    <NavItem icon={<Counter />} />
                    <NavItem icon={<Slot />} />
                </NavBar>
            </div>
        </CSSTransition>
    );
}