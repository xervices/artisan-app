import { io } from 'socket.io-client';

export const socket = io('https://staging-api.getxervices.com/', {
  transports: ['websocket'],
});
