import { useEffect } from "react";
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

  return <HomePage />;
}

export default App;
