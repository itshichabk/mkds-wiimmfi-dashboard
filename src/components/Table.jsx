import React, { useEffect, useState } from 'react'
import useSound from 'use-sound';
import PlayerRow from './PlayerRow'
import './Table.css'

import joinSound from '../assets/join.wav'
import leaveSound from '../assets/leave.wav'
import joinIcon from '../assets/join.png'
import leaveIcon from '../assets/leave.png'

export default function Table({updateInterval, countdown, soundOn, notificationsOn}) {

    const [players, setPlayers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);
    const [fetchSuccess, setFetchSuccess] = useState(false);
    
    const [joined, setJoined] = useState([]);
    const [left, setLeft] = useState([]);

    const [playJoin] = useSound(joinSound);
    const [playLeave] = useSound(leaveSound);

    const [userInteracted, setUserInteracted] = useState(false);  // New state to track user interaction, necessary for audio to play again after a page refresh (see console warning)

    async function fetchPlayers()
    {
        setFetching(true);
        try
        {
            let res = null;
            // API is now fully running on a personal home server, removed Google Cloud Run server fallback.
            res = await fetch('https://mkdsapi.itshichabk.io');

            const playersJSON = await res.json();

            if(!firstFetch)
            {
                const leftArr = players.filter((p1) => { return !playersJSON.some((p2) => { return p1.fc == p2.fc }) });
                const joinedArr = playersJSON.filter((p1) => { return !players.some((p2) => { return p1.fc == p2.fc }) });

                setLeft(leftArr);
                setJoined(joinedArr);
            }

            /*
                This issue appeared since I recently hosted the API on a personal server instead of Google Cloud Run.

                After not receiving requests for a long time, the server takes longer to fetch players and responds with "{}" and error 500,
                which would cause the entire site to crash because it expects an array rather than an object.
                Below is a temporary solution to try to mitigate that issue.
            */
            if(Array.isArray(playersJSON))
            {
                setPlayers(playersJSON);
                if(firstFetch) { setFirstFetch(false); }
                setFetchSuccess(true);
            }
            else
            {
                setFetchSuccess(false);
            }

        }
        catch(e)
        {
            console.log(e);
            setFetchSuccess(false);
        }

        setFetching(false);
    }

    // Detect user interaction to allow sound
    const handleUserInteraction = () => {
        setUserInteracted(true);
    };

    useEffect(() => {
        // If sound is on but no user interaction yet, wait for a user click
        if (soundOn && !userInteracted) {
            window.addEventListener('click', handleUserInteraction, { once: true });
        }
    }, [soundOn, userInteracted]);

    useEffect(() => {
        setLeft(left);
        setJoined(joined);

        if (soundOn && userInteracted) {
            if (joined.length !== 0) playJoin();
            if (left.length !== 0) playLeave();
        }

        // Send a notification when a player joins
        if (joined.length !== 0 && Notification.permission === "granted" && notificationsOn) {
            joined.forEach(player => {
                const notification = new Notification(`${player.name} Joined`, {
                    body: 'Someone joined the game!',
                    icon: joinIcon
                });
                notification.onclick = function() {
                    window.focus();  // Brings the tab back into focus
                };
            });
        }
        else if(left.length !== 0 && Notification.permission === "granted" && notificationsOn) {
            left.forEach(player => {
                const notification = new Notification(`${player.name} Left`, {
                    body: 'Someone has left the game!',
                    icon: leaveIcon
                });
                notification.onclick = function() {
                    window.focus();  // Brings the tab back into focus
                };
            });
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
            {fetching && !firstFetch ? <p>Updating...</p> : null}
            {/* Overlay that darkens the page */}
            {!userInteracted && soundOn && (
                <div className="overlay" onClick={handleUserInteraction}>
                    <div className="overlay-message">
                        <p>Please click anywhere to keep sound enabled.</p>
                    </div>
                </div>
            )} 
        </div>
    )
}
