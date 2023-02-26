import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const defaultState: Socket | undefined = undefined;

const SocketsContext = createContext<Socket | undefined>(defaultState);

export const SocketProvider = ({ children, apiUrl }: { children: React.ReactNode; apiUrl?: string }) => {
  const [socket, setSocket] = useState<Socket | undefined>(defaultState);

  useEffect(() => {
    if (!apiUrl) {
      console.warn('apiUrl not defined');

      return;
    }

    const s = io(apiUrl, {
      transports: ['websocket'],
    });

    setSocket(s);

    s.on('connect_error', (error) => {
      console.log(error.message);
    });

    return () => {
      s.disconnect();
    };
  }, [apiUrl]);

  return <SocketsContext.Provider value={socket}>{children}</SocketsContext.Provider>;
};

export const useSockets = () => {
  const socket = useContext(SocketsContext);

  return socket;
};

export default SocketsContext;
