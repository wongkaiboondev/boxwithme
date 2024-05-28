import { useState } from "react";
import "./App.css";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [log, setLog] = useState([]);
  console.log("🚀 ~ App ~ log:", log);

  socket.on("receivedMessage", (body) => {
    console.log("receivedMessage");
    setLog([...log, body]);
    console.log(body);
  });

  const handleEmit = (event: any) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(message);
    socket.emit("sendMessage", message);
    setLog([...log, message]);
  };

  return (
    <>
      <form onSubmit={handleEmit}>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div>
        <div>Chat Log</div>
        <div>
          {log.length > 0 &&
            log.map((item) => {
              return <div>{item}</div>;
            })}
        </div>
      </div>
    </>
  );
}

export default App;
