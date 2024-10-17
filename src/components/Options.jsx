import React from 'react'
import './Options.css'

function Options({interval, setInterval, setCountdown, countdown, soundOn, notificationsOn, setSoundOn, setNotificationsOn}) {
  return (
    <div className='options'>
      <div>
        <div className='countdown'>
          <p>Time until next update : {countdown} second{countdown > 1 ? 's' : null}</p>
          <div className="flex">
          <label htmlFor="interval">Update interval : </label>
            <select name="interval" defaultValue={interval} id="interval" onChange={(ev) => {setInterval(parseInt(ev.target.value)); setCountdown(parseInt(ev.target.value))}}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select> <span> seconds</span>
          </div>
        </div>
        <div className='sound flex'>
          <label htmlFor="sound">Enable sound when players join/disconnect? </label>
          <input type="checkbox" name="sound" id="sound" checked={soundOn} onChange={(ev) => { setSoundOn(ev.target.checked); }}/>
        </div>
        <div className='notifications flex'>
          <label htmlFor="notifications">Enable notifications when players join/disconnect? </label>
          <input type="checkbox" name="notifications" id="notifications" checked={notificationsOn} onChange={(ev) => { setNotificationsOn(ev.target.checked); }}/>
        </div>
      </div>
    </div>
  )
}

export default Options