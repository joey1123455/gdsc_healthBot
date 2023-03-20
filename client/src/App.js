import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);

  const apiUrl="http://34.136.104.12:8000/api"
 const handleSubmit= async (messageText) => {
  axios.post(apiUrl, { msg: messageText }, { mode: 'no-cors' })
  .then(response => {
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.error('Server returned an error:', response.status);
    }
  })
  .catch(error => {
    console.error(error);
  });
  
  //  setMessages([...messages,{}])
      setTyping(true);
 }

  return (
    <div className="">
      <div className="header">
        <p style={{ textAlign: "center" }}>GDSC Health Bot😃</p>
        <div className="btn">

        </div>
      </div>
      <div className="wrapper">
        <div className="box">
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="GDSC Health Bot😃" />
                  ) : null
                }
              >
                {messages.map((message, index) => (
                  <Message key={index} model={message} />
                ))}
              </MessageList>
              <MessageInput placeholder="Enter message" onSend={handleSubmit} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}

export default App;