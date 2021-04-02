import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CSSTransition, Transition } from 'react-transition-group';
import { EyeOpen } from './components/eye-open';
import { EyeClosed } from './components/eye-closed';
import { LoginStatus } from './components/login-status';
import { useUser } from '../../contexts/auth';
import { useHistory } from 'react-router-dom';
import './login.css';

const Login: React.FC<any> = () => {
    const user = useUser();
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const signInRef = useRef<HTMLButtonElement>(null);
    const signUpRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        if (user) {
            history.push('/profile');
        }
    })

    useEffect(() => {
        if (usernameRef.current !== null) {
            usernameRef.current.focus();
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        switch (name) {
            case "username":
                setUsername(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
        }
    }

    const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = e.currentTarget;
        switch (name) {
            case "signIn":
                setIsSignIn(true);
                break;
            case "signUp":
                setIsSignIn(false);
                break;
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username === "") {
            usernameRef.current!.focus();
            return;
        } else if (password === "") {
            passwordRef.current!.focus();
            return;
        }
        setIsSubmit(true);
    }

    const onHeadingSubmit = (state: boolean) => {
        if (state) {
            headingRef.current!.style.marginBottom = '0px';
        } else {
            headingRef.current!.style.marginBottom = headingRef.current!.style.marginTop;
        }
    }

    const onInputSubmit = (nodeRef: React.RefObject<HTMLInputElement>, state: boolean) => {
        if (state) {
            nodeRef.current!.readOnly = true;
        } else {
            nodeRef.current!.readOnly = false;
        }    
    }

    return (
        <div className="login-page" >
            <Transition nodeRef={headingRef} in={isSubmit} timeout={0} onEnter={() => onHeadingSubmit(true)} onExit={() => onHeadingSubmit(false)}>
                <h1 ref={headingRef}>
                    connect𝑥
            </h1>
            </Transition>
            <Transition nodeRef={formRef} in={isSubmit} timeout={0}>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <LoginStatus isSignIn={isSignIn} isSubmit={isSubmit} username={username} password={password} setIsSubmit={setIsSubmit} />
                    <Transition nodeRef={usernameRef} in={isSubmit} timeout={0} onEnter={() => onInputSubmit(usernameRef, true)} onExit={() => onInputSubmit(usernameRef, false)}>
                        <input ref={usernameRef} className="user" type="text" placeholder="Username" name="username" value={username} onChange={handleInputChange} />
                    </Transition>
                    <div className="password-group">
                        <button className="password-eye" type="button" onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? <EyeClosed /> : <EyeOpen />}
                        </button>
                        <Transition nodeRef={passwordRef} in={isSubmit} timeout={0} onEnter={() => onInputSubmit(passwordRef, true)} onExit={() => onInputSubmit(passwordRef, false)}>
                            <input ref={passwordRef} className="user" type={isShowPassword ? "text" : "password"} size={3} placeholder="Password" name="password" onChange={handleInputChange} />
                        </Transition>
                    </div>
                    <div className="options-group" >
                        <CSSTransition nodeRef={signInRef} in={isSignIn} timeout={0} classNames="highlight">
                            <button className="option left" ref={signInRef} type="button" name="signIn" onClick={handleOptionClick} >Sign In</button>
                        </CSSTransition>
                        <CSSTransition nodeRef={signUpRef} in={!isSignIn} timeout={0} classNames="highlight">
                            <button className="option right" ref={signUpRef} type="button" name="signUp" onClick={handleOptionClick} >Sign Up</button>
                        </CSSTransition>
                    </div>
                    <input type="submit" style={{ display: "none" }} />
                </form>
            </Transition>
        </div >
    );
}

export default Login;