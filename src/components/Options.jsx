import React from 'react'
import './Options.css'

function Options({interval, setInterval, setCountdown, countdown, setSoundOn}) {
  return (
    <div className='options'>
      <div>
        <div className='countdown'>
          <p>Time until next update : {countdown} second{countdown > 1 ? 's' : null}</p>
          <div className="flex">
          <label htmlFor="interval">Update interval : </label>
            <select name="interval" defaultValue={interval} id="interval" onChange={(ev) => {setInterval(ev.target.value); setCountdown(ev.target.value)}}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select> <span> seconds</span>
          </div>
        </div>
        <div className='sound flex'>
          <label htmlFor="sound">Enable sound when players join/disconnect? </label>
          <input type="checkbox" name="sound" id="sound" onChange={(ev) => { setSoundOn(ev.target.checked); console.log(ev.target.checked); }}/>
        </div>
      </div>
    </div>
  )
}

export default Options