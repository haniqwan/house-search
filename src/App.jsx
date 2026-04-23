import { useState } from 'react';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import AreaSearchScreen from './screens/AreaSearchScreen';
import SwipeScreen from './screens/SwipeScreen';
import FinderScreen from './screens/FinderScreen';
import TrackerScreen from './screens/TrackerScreen';
import TogetherScreen from './screens/TogetherScreen';

export default function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem('nest_screen') || 'home');
  const [partners, setPartners] = useState([{ name: 'Sarah', areas: 8 }]);

  const nav = (s) => {
    setScreen(s);
    localStorage.setItem('nest_screen', s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const screens = {
    home:    <HomeScreen onTab={nav} searchPartners={partners} />,
    areas:   <AreaSearchScreen />,
    swipe:   <SwipeScreen />,
    finder:  <FinderScreen />,
    tracker: <TrackerScreen />,
    together:<TogetherScreen partners={partners} setPartners={setPartners} />,
  };

  return (
    <>
      <Header screen={screen} onNav={nav} />
      <main>{screens[screen] || screens.home}</main>
    </>
  );
}
