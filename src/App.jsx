import { MusicContextProvider } from './context/MusicContext';
import PlayerV2 from './components/PlayerV2';
import HelmetHead from './HelmetHead';

const App = () => {
  return (
    <div className='text-primary'>
      <HelmetHead />
      <MusicContextProvider>
        <PlayerV2 />
      </MusicContextProvider>
    </div>
  );
};

export default App;
