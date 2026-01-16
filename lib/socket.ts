import { io } from 'socket.io-client';

export const socket = io('https://server-api-bibv.onrender.com/', {
  transports: ['websocket'],
});
