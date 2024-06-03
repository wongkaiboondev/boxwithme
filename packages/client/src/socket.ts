import { io } from "socket.io-client";

const url = "http://localhost:3001";
export const socket = io(`${url}`);

// export const useSocket = () => {
//   const [msg, setMsg] = useState("");
//   const [total, setTotal] = useState(0);
//   useEffect(() => {
//     socket.connect();
//     console.log("client connected");

//     return () => {
//       socket.disconnect();
//       console.log("client disconnect");
//     };
//   }, []);

//   useEffect(() => {
//     console.log("i running");
//     socket.emit("sendMessage", "hello socket");

//     socket.on("totalUser", (body: any) => {
//       console.log("totalUser", body);
//       setTotal(body);
//     });

//     socket.on("receivedMessage", (body: any) => {
//       console.log("receivedMessage", body);
//       setMsg(body);
//     });

//     return () => {
//       socket.off("receivedMessage");
//       socket.off("totalUser");
//     };
//   }, [msg, total]);

//   return { message: msg, total: total };
// };
