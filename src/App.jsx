import { useEffect, useState } from 'react'
import './App.css'
import Table from './components/Table'
import Countdown from './components/Countdown';

function App() {
  const defaultInterval = 10;
  const [updateInterval, setUpdateInterval] = useState(defaultInterval);
  const [countdown, setCountdown] = useState(defaultInterval);

  useEffect(() => {
    const interval = setInterval(() => { countdown == 0 ? setCountdown(updateInterval) : setCountdown(countdown - 1) }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <main>
      <div className='title'>
        <div>
          <h1>MARIO KART DS Wiimmfi Dashboard</h1>
          <h4>by <a href="https://github.com/itshichabk" target='_blank'>itshichabk</a></h4>
          <p>Data fetched from <a href="https://wiimmfi.de/stats/game/mariokartds">wiimmfi.de</a> using Puppeteer</p>
        </div>
      </div>
      <Countdown setInterval={setUpdateInterval} setCountdown={setCountdown} countdown={countdown}/>
      <Table updateInterval={updateInterval} countdown={countdown}/>
    </main>
  )
}

export default App
