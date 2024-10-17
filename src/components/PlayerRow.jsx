import React, { useEffect } from 'react'
import './PlayerRow.css'

function PlayerRow({player, joined}) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(player.name, 'text/html');
    const playerName = doc.body.textContent;
    
    return (
    <tr className=
        { joined ? "joined" :
          player.status == 2 ? "searching" :
          player.status == 3 ? "playing" : 
          player.status == 4 ? "searching friends" : 
          player.status == 5 ? "friends" : ""}>

        <td>{playerName}</td>
        <td>{player.fc}</td>

        { player.status == 0 ? <td>Connecting</td> : null }
        { player.status == 1 ? <td>In lobby</td> : null }
        { player.status == 2 ? <td>Searching worldwide / regional / rivals</td> : null }
        { player.status == 3 ? <td>Playing worldwide / regional / rivals</td> : null }
        { player.status == 4 ? <td>Searching in friends</td> : null }
        { player.status == 5 ? <td>Playing in friends</td> : null }
    </tr>
    )
}

export default PlayerRow
