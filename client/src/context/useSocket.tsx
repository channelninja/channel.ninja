import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const defaultState: Socket | undefined = undefined;

const SocketsContext = createContext<Socket | undefined>(defaultState);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | undefined>(defaultState);

  useEffect(() => {
    if (!process.env.REACT_APP_WS_URL) {
      throw new Error("Api url not defined");
    }
    const s = io(process.env.REACT_APP_WS_URL, {
      transports: ["websocket"],
    });

    setSocket(s);

    s.on("connect_error", (error) => {
      console.log(error.message);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketsContext.Provider value={socket}>{children}</SocketsContext.Provider>
  );
};

export const useSockets = () => {
  const socket = useContext(SocketsContext);

  return socket;
};

export default SocketsContext;
