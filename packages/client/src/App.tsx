import { useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [prevMessage, setPrevMessage] = useState("");
  const [log, setLog] = useState([]);
  console.log("🚀 ~ App ~ log:", log);

  socket.on("receivedMessage", (body) => {
    if (prevMessage !== body) {
      setLog([...log, `${body}`]);
    }
    console.log(body);
  });

  const handleEmit = (event: any) => {
    event.preventDefault(); // Prevent the default form submission behavior
    socket.emit("sendMessage", message);
    setLog([...log, `${message}`]);
    setPrevMessage(message);
    setMessage("");
  };

  return (
    <>
      <div>
        <div>Chat Log</div>
        <div>
          {log.length > 0 &&
            log.map((item) => {
              return <div>{item}</div>;
            })}
        </div>
      </div>
      <form onSubmit={handleEmit}>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default App;
