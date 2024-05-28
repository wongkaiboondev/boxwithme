import { useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [prevMessage, setPrevMessage] = useState("");
  const [log] = useState<string[]>([]);
  socket.on("receivedMessage", (body) => {
    log.push(body);
  });

  const handleEmit = (event: any) => {
    event.preventDefault(); // Prevent the default form submission behavior
    socket.emit("sendMessage", message);
    log.push(message);
    setPrevMessage(message);
    setMessage("");
  };

  const renderLeftMessage = (item: any) => {
    return <div className="text-left">{item}</div>;
  };

  const renderRightMessage = (item: any) => {
    return <div className="text-right">{item}</div>;
  };

  console.log(log);

  return (
    <div className="flex items-center flex-col h-full bg-indigo-50 justify-between w-full">
      <div className="outline outline-offset-2 outline-pink-500 flex items-center flex-col h-full justify-between w-4/5">
        <div className="text-left w-full">
          <h2 className="pt-4 bg-indigo-100">Box With Me</h2>
          <div id="chats" className="mt-4 text-left">
            {log.length > 0 &&
              log.map((item, index) => {
                if (index % 2) {
                  return renderLeftMessage(item);
                } else {
                  return renderRightMessage(item);
                }
              })}
          </div>
        </div>
        <div className="w-full">
          <form
            onSubmit={handleEmit}
            className="mb-4 w-full flex justify-between"
          >
            <input
              className="p-2 rounded-full w-full"
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-500/75 focus:bg-indigo-500 ml-4 p-2 rounded-md"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
