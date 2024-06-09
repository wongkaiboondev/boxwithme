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
    // console.log("connected");
    socket.on("connect", () => {
      // console.log("socket id", socket.id);
      // socket.emit("joinRoom", socket.id);
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
      // console.log("disconnect");
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

  const ChatBubble = ({ item, index }: any) => {
    const isOther = item.sender === "other";
    return (
      <div
        className={`first:pt-4 pt-2 flex ${isOther ? "flex-row" : "flex-row-reverse"}`}
        key={index}
      >
        {isOther ? (
          <div className="items-center gap-x-2 flex">
            <img
              className="w-10 h-10 rounded-full"
              src="src/assets/me-sloth.png"
              alt="Rounded avatar"
            ></img>
            <div className="bg-indigo-100 p-2 rounded-r-lg rounded-b-lg">
              {item.msg}
            </div>
          </div>
        ) : (
          <div className="items-center gap-x-2 flex">
            <div className="bg-indigo-100 p-2 rounded-l-lg rounded-b-lg">
              {item.msg}
            </div>
            <img
              className="w-10 h-10 rounded-full"
              src="src/assets/sender-snowman.png"
              alt="Rounded avatar"
            ></img>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center flex-col h-full justify-between w-ful bg-indigo-200">
      <div className="w-3/5 h-full my-8">
        <div className="text-left w-full h-full">
          <div
            id="header"
            className="pt-4 bg-indigo-300 rounded-t-lg px-4 drop-shadow-lg"
          >
            <div className="pb-1 flex items-end">
              <h2>Box With Me</h2>
              <p className="ml-2">{total} online</p>
            </div>
            <div>{joinRoom}</div>
          </div>
          <div id="body" className="bg-indigo-50 h-[80vh] drop-shadow-lg">
            <div id="chats" className="h-full px-4">
              {chats.length > 0 &&
                chats.map((item, index) => {
                  return <ChatBubble item={item} index={index} />;
                })}
            </div>
            <div className="w-full bg-indigo-50 pb-4 rounded-b-lg drop-shadow-lg px-4">
              <form
                onSubmit={handleEmit}
                className="w-full flex justify-between"
              >
                <input
                  className="p-2 rounded-full w-full"
                  type="text"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="bg-indigo-500 hover:bg-indigo-500/75 focus:bg-indigo-500 ml-4 p-2 rounded-md text-indigo-50"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
