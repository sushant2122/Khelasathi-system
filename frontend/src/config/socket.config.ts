import { io } from "socket.io-client";
const url = import.meta.env.VITE_API_URL
const client = io(url)

export default client;