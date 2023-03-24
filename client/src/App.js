import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {  useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2'
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

  const refreshButtonRef = useRef(null);

  const handleRefresh= () => {
    setMessages([]);
  }

   useEffect(() => {
    // Add an event listener for the beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

     // Remove the event listener when the component unmounts
     return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    
  },
  []);

const  handleBeforeUnload=(event) =>{

  Swal.fire({
    title: 'We respect your privacy, if you refresh this page all chat history will be cleared. Refresh?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      handleRefresh()
      Swal.fire(
        'Deleted!',
        'Your Chats has been deleted.',
        'success'
      )
    }
  })

 
    // Call the click method on the refresh button to trigger a refresh
    refreshButtonRef.current.click();
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