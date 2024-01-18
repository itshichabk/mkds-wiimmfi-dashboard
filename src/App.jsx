import { useEffect, useState } from 'react'
import './App.css'
import Table from './components/Table'
import Options from './components/Options';
import Footer from './components/Footer';

function App() {
  const defaultInterval = 10;
  const [updateInterval, setUpdateInterval] = useState(defaultInterval);
  const [countdown, setCountdown] = useState(defaultInterval);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => { countdown == 0 ? setCountdown(updateInterval) : setCountdown(countdown - 1) }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <main>
      <div className='title'>
        <div>
          <h1>MARIO KART DS Wiimmfi Dashboard</h1>
          <p>Data scraped from <a href="https://wiimmfi.de/stats/game/mariokartds" target='_blank'>wiimmfi.de</a></p>
        </div>
      </div>
      <Options interval={updateInterval} setInterval={setUpdateInterval} setCountdown={setCountdown} countdown={countdown} setSoundOn={setSoundOn}/>
      <Table updateInterval={updateInterval} countdown={countdown} soundOn={soundOn}/>
      <Footer/>
    </main>
  )
}

export default App
