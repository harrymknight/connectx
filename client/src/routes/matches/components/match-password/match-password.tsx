import { AxiosResponse } from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { API } from '../../../../utils';
import { Refresh } from '../../../login/components/refresh';
import './match-password.css';

const MatchPassword: React.FC<any> = ({ id, name }: { id: string, name: string }) => {
  const [password, setPassword] = useState('');
  const history = useHistory();

  useLayoutEffect(() => {
    checkPassword.reset();
    setPassword('');
  }, [id])

  const onJoin = () => {
    const splitName = name.split(' ');
    const conjoinedName = splitName[0] + splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1);
    history.push(`/${conjoinedName}`);
  }

  const checkMatchPassword = (password: string) => {
    return API.post(`match/${id}`, { password })
  }
  const checkPassword = useMutation<AxiosResponse<string>, Error, string>(checkMatchPassword);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkPassword.mutate(password);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  return (
    <React.Fragment> {checkPassword.isLoading ? (
      <Refresh />
    ) : (
        <>
          {checkPassword.isError ? (
            <Refresh />
          ) : null}

          {checkPassword.isSuccess && checkPassword.data?.data ? (
            <React.Fragment>
              <button>
                spectate
              </button>
              <button onClick={onJoin} >
                join
              </button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <form onSubmit={handlePasswordSubmit} >
                  <label> password: </label>
                  <input type="input" name="match-password" value={password} onChange={handlePasswordChange} />
                  <input type="submit" style={{ display: "none" }} />
                </form>
              </React.Fragment>
            )}
        </>
      )
    }
    </React.Fragment>
  )
}

export default MatchPassword;