import { BASE_URL } from '@/api/client';
import { io } from 'socket.io-client';

export const socket = io(BASE_URL, {
  transports: ['websocket'],
});
