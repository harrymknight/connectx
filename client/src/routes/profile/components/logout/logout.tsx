import { AxiosResponse } from 'axios';
import React from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useAuth, useUser } from '../../../../contexts/auth';
import { Refresh } from '../../../login/components/refresh';

const Logout: React.FC<any> = () => {
  const history = useHistory();
  const auth = useAuth();
  const user = useUser();
  const closePlayer = useMutation<AxiosResponse<any>, Error, void>(auth.logout, {
    onSuccess: () => history.push('/')
  });

  return (
    user ? <div>
      {closePlayer.isLoading ? (
        <Refresh/>
      ) : (
          <>
            {closePlayer.isError ? (
              <div>An error occurred </div>
            ) : null}
            {closePlayer.isSuccess ? <div>Player logged out!</div> : null}
            <button
              onClick={() => {
                closePlayer.mutate()
              }}
            >
              Logout
              </button>
          </>
        )}
    </div> : <div> Not logged in </div>
  )
}

export default Logout;