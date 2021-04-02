import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { Refresh } from '../refresh';
import './login-status.css';
import { Credentials, useAuth } from '../../../../contexts/auth';

const LoginStatus: React.FC<any> = ({ isSignIn, isSubmit, username, password, setIsSubmit }) => {
  const auth = useAuth();

  const registerThenLogin = async () => {
    await auth.register({username, password});
    return await auth.login({username, password});
  }

  const oldPlayer = useMutation<AxiosResponse<Credentials>, Error, Credentials>(auth.login);
  const newPlayer = useMutation<AxiosResponse<Credentials>, Error, Credentials>(registerThenLogin);

  useEffect(() => {
    if (isSubmit) {
      if (isSignIn) {
        newPlayer.reset();
        oldPlayer.mutate({ username, password });
        setIsSubmit(false);
      } else {
        oldPlayer.reset();
        newPlayer.mutate({ username, password });
        setIsSubmit(false);
      }
    }
  }, [isSignIn, isSubmit, username, password, setIsSubmit, newPlayer, oldPlayer])

  return (
    <div className='login-status'>
      {(oldPlayer.isLoading || newPlayer.isLoading) ? (
        <div className='rotate'>
          <Refresh />
        </div>
      ) : (
          <>
            {oldPlayer.isError ? (
              <div> {oldPlayer.error!.message} </div>
            ) : null}
            {newPlayer.isError ? (
              <div> {newPlayer.error!.message} </div>
            ) : null}
          </>
        )}
    </div>
  )
}

export default LoginStatus;