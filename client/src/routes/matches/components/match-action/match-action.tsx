import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { API } from '../../../../utils';
import { Refresh } from '../../../login/components/refresh';
import { MatchPassword } from '../match-password';
import './match-action.css';

const MatchAction: React.FC<any> = ({ id, name, rows, columns }) => {

  useEffect(() => {
    refetch();
  }, [id]);

  const fetchMatchDetails = () => {
    return API.get(`match/${id}`);
  };

  const { isLoading, isError, data, error, refetch } = useQuery('matchDetails', fetchMatchDetails, { enabled: false });

  if (isLoading) {
    return (
      <Refresh />
    );
  }
  return (
    <div className="match-action" >
      <div>
        players: {` ${data?.data.aliases.length}/20`}
      </div>
      <div>
        progress: {` ${(data?.data.moves.length / (rows * columns) * 100).toFixed(1)}%`}
      </div>
      <div className="match-password" >
        <MatchPassword id={id} name={name}/>
      </div>
    </div>
  );
}

export default MatchAction;