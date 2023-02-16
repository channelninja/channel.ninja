import { useEffect } from "react";
import { throttle } from "throttle-debounce";
import { useSockets } from "./context/useSocket";
import { InitService } from "./generated";
import HomePage from "./pages/HomePage/HomePage";
import { initApp, socketChanged } from "./redux/global-slice";
import { useAppDispatch } from "./redux/hooks";

function App() {
  const socket = useSockets();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const initialSettings = await InitService.init();
      let availableWebLNMethods: string[] = [];

      if (window.webln) {
        await window.webln.enable();
        const info = await window.webln.getInfo();

        availableWebLNMethods = info.methods;
      }
      dispatch(initApp({ ...initialSettings, availableWebLNMethods }));
    };

    init();
  }, [dispatch]);

  useEffect(() => {
    socket?.on("connect", () => {
      dispatch(socketChanged(true));
    });

    socket?.on("disconnect", () => {
      dispatch(socketChanged(false));
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (document.documentElement) {
        document.documentElement.style.setProperty(
          "--document-height",
          `${window.innerHeight}px`
        );
      }
    };

    const throttledHandleResize = throttle(200, handleResize);

    window.addEventListener("resize", throttledHandleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  return <HomePage />;
}

export default App;
