import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ColourSelector } from './components/colour-selector';
import { useLobby } from './hooks';
import './lobby.css';

const Lobby: React.FC<RouteComponentProps> = ({ location }) => {
  const { state }: any = location;
  const { user, colours, players, isReady, selectedColourIndex, setSelectedColourIndex, enabledColours, messages, handleReady, handleStart } = useLobby(state);
  return (
    <div className="match-lobby" >
      <div className="match-lobby-colours" >
        {colours.map((colour: any) => (
          <ColourSelector colour={colour} enabledColours={enabledColours} selectedColourIndex={selectedColourIndex} setSelectedColourIndex={setSelectedColourIndex} isReady={isReady} />
        ))}
      </div>
      <div className="match-lobby-info" >
        <div className="match-lobby-status" >
          <div className="match-lobby-display" >
            {messages?.map(message => message)}
          </div>
          <div className="match-lobby-players" >
            {Object.values<any>(players).map(player =>
              <div key={player.id} >
                <span style={{ color: player.status === 'ready' ? '#00CC00' : '#ddd' }}>
                  {player.alias}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="match-lobby-action" >
          <button className={isReady ? "ready" : ""} onClick={handleReady} >
            Ready
          </button>
          {user.data.username === state.match.username && <button disabled={Object.values<any>(players).filter(player => player.status !== 'ready').length > 0} onClick={handleStart} >
            Submit
          </button>}
        </div>
      </div>
    </div>
  );
}

export default Lobby;