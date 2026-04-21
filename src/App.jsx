import { useState } from 'react';
import IOSDevice from './components/IOSDevice';
import TabBar from './components/TabBar';
import HomeScreen from './screens/HomeScreen';
import AreaSearchScreen from './screens/AreaSearchScreen';
import SwipeScreen from './screens/SwipeScreen';
import FinderScreen from './screens/FinderScreen';
import TrackerScreen from './screens/TrackerScreen';
import TogetherScreen from './screens/TogetherScreen';
import { C } from './tokens';

export default function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem('nest_screen') || 'home');
  const [partners, setPartners] = useState([{ name: 'Sarah', areas: 8 }]);

  const nav = (s) => {
    setScreen(s);
    localStorage.setItem('nest_screen', s);
  };

  const screens = {
    home: <HomeScreen onTab={nav} searchPartners={partners} />,
    areas: <AreaSearchScreen />,
    swipe: <SwipeScreen />,
    finder: <FinderScreen />,
    tracker: <TrackerScreen />,
    together: <TogetherScreen partners={partners} setPartners={setPartners} />,
  };

  return (
    <IOSDevice width={393} height={852}>
      <div style={{ position: 'relative', height: '100%', background: C.bg }}>
        <div style={{ height: '100%', overflow: 'hidden' }}>
          {screens[screen] || screens.home}
        </div>
        <TabBar active={screen} onTab={nav} />
      </div>
    </IOSDevice>
  );
}
