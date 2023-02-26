import { useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { SocketProvider, useSockets } from './context/useSocket';
import { InitService } from './generated';
import HomePage from './pages/HomePage/HomePage';
import { initApp, socketChanged } from './redux/global-slice';
import { useAppDispatch } from './redux/hooks';

const SocketInit = () => {
  const socket = useSockets();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on('connect', () => {
      dispatch(socketChanged(true));
    });

    socket?.on('disconnect', () => {
      dispatch(socketChanged(false));
    });

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
    };
  }, [socket, dispatch]);

  return null;
};

function App() {
  const dispatch = useAppDispatch();
  const [apiUrl, setApiUrl] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const initialSettings = await InitService.init();
      let availableWebLNMethods: string[] = [];

      if (window.webln) {
        await window.webln.enable();
        const info = await window.webln.getInfo();

        availableWebLNMethods = info.methods;
      }

      setApiUrl(initialSettings.apiUrl);
      dispatch(initApp({ ...initialSettings, availableWebLNMethods }));
    };

    init();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (document.documentElement) {
        document.documentElement.style.setProperty('--document-height', `${window.innerHeight}px`);
      }
    };

    const throttledHandleResize = throttle(200, handleResize);

    window.addEventListener('resize', throttledHandleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', throttledHandleResize);
    };
  }, []);

  return (
    <SocketProvider apiUrl={apiUrl}>
      <SocketInit />
      <HomePage />
    </SocketProvider>
  );
}

export default App;
