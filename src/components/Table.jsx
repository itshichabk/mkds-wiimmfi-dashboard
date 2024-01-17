import React, { useEffect, useState } from 'react'
import useSound from 'use-sound';
import PlayerRow from './PlayerRow'
import './Table.css'

import joinSound from '../assets/join.wav'
import leaveSound from '../assets/leave.wav'

export default function Table({updateInterval, countdown, soundOn}) {

    const [players, setPlayers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);
    const [fetchSuccess, setFetchSuccess] = useState(false);
    
    const [joined, setJoined] = useState([]);
    const [left, setLeft] = useState([]);

    const [playJoin] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);

    async function fetchPlayers()
    {
        setFetching(true);
        try
        {
            const res = await fetch('https://mkds-wiimmfi-stats-api.onrender.com');
            const playersJSON = await res.json();

            if(!firstFetch)
            {
                const leftArr = players.filter((p1) => { return !playersJSON.some((p2) => { return p1.fc == p2.fc }) });
                const joinedArr = playersJSON.filter((p1) => { return !players.some((p2) => { return p1.fc == p2.fc }) });

                setLeft(leftArr);
                setJoined(joinedArr);
            }

            setPlayers(playersJSON);
            if(firstFetch) { setFirstFetch(false); }
            setFetchSuccess(true);
        }
        catch(e)
        {
            console.log(e);
            setFetchSuccess(false);
        }

        setFetching(false);
    }

    useEffect(() => {
        setLeft(left);
        setJoined(joined);

        if(soundOn) {
            if(joined.length != 0) { playJoin(); }
            else if(left.length != 0) { playLeave(); }    
        }

    }, [joined, left])

    useEffect(() => {
        if((firstFetch || countdown == updateInterval) && !fetching) {
            fetchPlayers();
        }
    }, [countdown]);
    
    return (
        <div className='table-container'>
            { firstFetch ? <h3>Fetching players...</h3> :
                !firstFetch && !fetchSuccess ? <h3>Error when trying to connect to API.</h3> :
                (players.length == 0 && !firstFetch) ? <h3>No players online...</h3> : 
                !firstFetch ?
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Friend code</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => 
                                <PlayerRow player={player} key={player.fc} 
                                    joined={ joined.find(p => p.fc == player.fc) ? true : false }
                                />)
                            }
                        </tbody>
                    </table> 
                </>
                : null
            }
            <p>Updating...</p>
            { fetching && !firstFetch ? <p>Updating...</p> : null }
        </div>
    )
}
