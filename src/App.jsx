import { useEffect, useState } from 'react'
import './App.css'
import Table from './components/Table'
import Options from './components/Options';
import Footer from './components/Footer';

function App() {
  const defaultInterval = 10;

  // Load values from localStorage or fall back to defaults
  const storedInterval = parseInt(localStorage.getItem('updateInterval')) || defaultInterval;
  const storedSoundOn = localStorage.getItem('soundOn') === 'true';
  const storedNotificationsOn = localStorage.getItem('notificationsOn') === 'true';

  const [updateInterval, setUpdateInterval] = useState(storedInterval);
  const [countdown, setCountdown] = useState(storedInterval);
  const [soundOn, setSoundOn] = useState(storedSoundOn);
  const [notificationsOn, setNotificationsOn] = useState(storedNotificationsOn);

  // Request notification permission when the app mounts
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Save the interval and options in localStorage
  useEffect(() => {
    localStorage.setItem('updateInterval', updateInterval);
  }, [updateInterval]);
  
  useEffect(() => {
    localStorage.setItem('soundOn', soundOn);
  }, [soundOn]);
  
  useEffect(() => {
    localStorage.setItem('notificationsOn', notificationsOn);
  }, [notificationsOn]);

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
      <Options interval={updateInterval} setInterval={setUpdateInterval} setCountdown={setCountdown} countdown={countdown} soundOn={soundOn} notificationsOn={notificationsOn} setSoundOn={setSoundOn} setNotificationsOn={setNotificationsOn}/>
      <Table updateInterval={updateInterval} countdown={countdown} soundOn={soundOn} notificationsOn={notificationsOn}/>
      <Footer/>
    </main>
  )
}

export default App
