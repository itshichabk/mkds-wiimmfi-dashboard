import React from 'react'
import './Countdown.css'

function Countdown({setInterval, setCountdown, countdown}) {
  return (
    <div className='countdown'>
      <div>
        <p>Time until next update : {countdown} seconds</p>
        <label htmlFor="interval">Update interval : </label>
        <select name="interval" defaultValue={10} id="interval" onChange={(ev) => {setInterval(ev.target.value); setCountdown(ev.target.value)}}>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
        </select> <span>seconds</span>
      </div>
    </div>
  )
}

export default Countdown