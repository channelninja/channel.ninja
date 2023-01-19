import { useEffect } from "react";
import { throttle } from "throttle-debounce";
import { useSockets } from "./context/useSocket";
import HomePage from "./pages/HomePage/HomePage";
import { socketChanged } from "./redux/global-slice";
import { useAppDispatch } from "./redux/hooks";

function App() {
  const socket = useSockets();
  const dispatch = useAppDispatch();

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
