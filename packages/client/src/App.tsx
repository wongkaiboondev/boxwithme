import { useEffect, useState } from "react";
import { socket } from "./socket";

type ChatMessage = { msg: string; sender: string };

const App = () => {
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [joinRoom, setJoinRoom] = useState("");
  const [chats, setChats] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.connect();
    console.log("connected");
    socket.on("connect", () => {
      console.log("socket id", socket.id);
      socket.emit("joinRoom", socket.id);
    });

    socket.on("whoJoined", (msg: string) => setJoinRoom(msg));
    socket.on("totalUser", (msg: number) => setTotal(msg));
    socket.on("receivedMessage", (msg: string) => {
      const receiver = {
        msg: msg,
        sender: "other",
      };
      setChats([...chats, receiver]);
    });

    return () => {
      socket.off("totalUser");
      socket.off("joinRoom");
      socket.off("whoJoined");
      socket.off("receivedMessage");
      socket.disconnect();
      console.log("disconnect");
    };
  }, [chats]);

  const handleEmit = (event: any) => {
    event.preventDefault();
    const sender = {
      msg: message,
      sender: "me",
    };
    socket.emit("sendMessage", message);
    setChats([...chats, sender]);
    setMessage("");
  };

  const renderLeftMessage = (item: any, index: number) => {
    return (
      <div className="text-left" key={index}>
        Sender: {item.msg}
      </div>
    );
  };

  const renderRightMessage = (item: any, index: number) => {
    return (
      <div className="text-right" key={index}>
        {item.msg} :Me
      </div>
    );
  };

  console.log("joinRoom", joinRoom);

  return (
    <div className="flex items-center flex-col h-full bg-indigo-50 justify-between w-full">
      <div className="outline outline-offset-2 outline-pink-500 flex items-center flex-col  justify-between w-4/5">
        <div className="text-left w-full">
          <h2 className="pt-4 bg-indigo-100">Box With Me</h2>
          <div>{total} user online</div>
          <div id="chats" className="mt-4 text-left">
            <div>{joinRoom}</div>
            <div>Chats: </div>
            {chats.length > 0 &&
              chats.map((item, index) => {
                if (item.sender === "other") {
                  return renderLeftMessage(item, index);
                } else {
                  return renderRightMessage(item, index);
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
};

export default App;
