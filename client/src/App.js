import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {  useState } from "react";
import { useEffect } from "react";
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

  const handleRefresh= () => {
    setMessages([]);
  }

  const apiUrl="http://34.136.104.12:8000/api"
 const handleSubmit= async (messageText) => {
  axios.post(apiUrl, { msg: messageText }, { mode: 'no-cors' })
 
  .then(response => {
    if (response.status === 200) {
     let message = response.data.res
     let time = response.data.time
     let newMessage = `${message} <br>${time}</br>`
     const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
     let date = new Date().toLocaleString(options).replace(/[/]/g, '-');
     let userMessage = `${messageText} <br>${date}</br>`
        setMessages([...messages,{
          message:userMessage,
          direction:"outgoing"
        },
        {
          message:newMessage
        }
      ])
        setTyping(false);
      console.log(response.data);
    } else {
      console.error('Server returned an error:', response.status);
    }
  })
  .catch(error => {
    console.error(error);
  });
      setTyping(true);

      
     
 }
 

  return (
    <div className="">
      <div className="header">
        <p style={{ textAlign: "center" }}>Cheer Bot😃</p>
      </div>
      <div>
      <div>
      {/* Code to render messages */}
      <button onClick={handleRefresh}>
        <i className="fa fa-refresh" aria-hidden="true"></i>
      </button>
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
                    <TypingIndicator content="Cheer Bot😃" />
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