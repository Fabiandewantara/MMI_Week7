import './App.css';
import io from "socket.io-client";
import{ useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function App() {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({currentRoom: "", lastRoom:""});
  const [isTyping, setIsTyping] = useState(false);
  const [countOnlineRoom, setcountOnlineRoom] = useState(0);
  const [countOnlineApp, setcountOnlineApp] = useState(0);
  
  useEffect (()=>{
    const newSocket = io.connect('http://localhost:8080/chat')
    newSocket.on("connect", ()=>{
      console.log("socket connected")
    });
    setSocket(newSocket);
  }, []);

  const handleSendMessage = () =>{
    const payload = {...message, room: room.currentRoom};
    console.log(payload)
    socket.emit("SEND_MESSAGE", payload)
    setMessage((prev)=>({
      ...prev, message: ""
    }))
  }

  const handleJoinRoom = () =>{
    socket.emit("JOIN_ROOM", room)

    setRoom((prev)=>({...prev, lastRoom: room.currentRoom}));
  };

  useEffect(() =>{
    if(socket){
      socket.on("RECIEVE_MESSAGE", dataMessage =>{
      console.log("RECIEVE_MESSAGE", dataMessage);
      setMessages((prev)=>[...prev, dataMessage]);
      });
      socket.on("RECIEVE_TYPING", (isTyping)=>{
        setIsTyping(isTyping);
      });
      socket.on("RECIEVE_USERS_ONLINE_IN_ROOM", (userOnlineinRoom)=>{
        setcountOnlineRoom(userOnlineinRoom);
      });
      socket.on("USERS_LEFT_IN_ROOM", (userOnlineinRoom)=>{
        setcountOnlineRoom(userOnlineinRoom);
      })
    }
  },[socket]);

  useEffect(()=>{
    if(message.message){
      socket.emit("IS_TYPING", {isTyping: true, room: room.currentRoom});
    }
    else if(socket){
      socket.emit("IS_TYPING", {isTyping: false, room: room});
    }
  },[message])

  return <div className="App">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>
    {/* <div>User online on App: {countOnlineApp}</div> */}
    <div>User online on Room: {countOnlineRoom}</div>
    {isTyping && <span>Someone is Typing...</span>}
    <div>
      <input class="form-control" placeholder="Room" onChange={(e) => setRoom((prev)=>({
        ...prev, currentRoom: e.target.value
      }))} />
      <button class="btn btn-outline-success" onClick={handleJoinRoom}>Join Room</button>
    </div>
    
    <input placeholder="Username" onChange={(e) => {
      setMessage((prev) => ({...prev, username: e.target.value}));
      }} 
    />
    
    <input placeholder="Type message..." onChange={(e) => {
      setMessage((prev) => ({...prev, message: e.target.value}));
      }} 
    />
    <button onClick={handleSendMessage}>Send Message</button>
    <div>
      <ul>
        {messages.map((message, index) => {
          return <li key={index}>{message.message}</li>
        })}
      </ul>
    </div>
  </div>
}

export default App;
