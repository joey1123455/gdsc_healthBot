// Importing necessary dependencies and styles
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import ReactModal from "react-modal";
import "./index.css";
import axios from "axios";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

// Setting the app element to be the root element of your app for accessibility purposes
ReactModal.setAppElement("#root");

function App() {
  // Define state variables
  const [messages, setMessages] = useState([]); // store chat messages
  const [typing, setTyping] = useState(false); // show typing indicator
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [responseData, setResponseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBeforeUnload = useCallback((event) => {
    event.preventDefault();
    Swal.fire({
      title:
        "We respect your privacy, if you refresh this page all chat history will be cleared. Refresh?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearChats();
        window.removeEventListener("beforeunload", handleBeforeUnload);
        Swal.fire("Deleted!", "Your Chats has been deleted.", "success");
      }
    });
  });

  // Add an event listener for the beforeunload event and remove it when the component unmounts
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // Prompt user to confirm if they want to clear chat history when the page is being refreshed or closed
  const clearChats = () => {
    setMessages([]);
  };

  // Send message to backend and add response to chat history
  const apiUrl = "http://34.136.104.12/api/";
  const handleSubmit = async (messageText) => {
    axios
      .post(apiUrl, { msg: messageText }, { mode: "no-cors" })
      .then((response) => {
        if (response.status === 200) {
          // Format the response message
          let message = response.data.res;
          let time = response.data.time;
          let newMessage = `${message} <br>${time}</br>`;
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          let date = new Date().toLocaleString(options).replace(/[/]/g, "-");
          let userMessage = `${messageText} <br>${date}</br>`;
          // Add the message to chat history
          setMessages([
            ...messages,
            {
              message: userMessage,
              direction: "outgoing",
            },
            {
              message: newMessage,
            },
          ]);
          // Hide typing indicator
          setTyping(false);
          console.log(response.data);
        } else {
          console.error("Server returned an error:", response.status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setTyping(true);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  //send location to the backend

  const submitLocation = (event) => {
    event.preventDefault();
    axios
      .post(`${apiUrl}location`, {
        lat: userLocation.lat,
        lon: userLocation.lon,
      })
      .then((response) => {
        setResponseData(response.data);
        setIsModalOpen(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const customModalStyles = {
    content: {
      color: "black",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="">
      <div className="header">
        <p style={{ textAlign: "center" }}>The Cheer Bot😃</p>
      </div>
      <div>
        <p style={{ textAlign: "center" }}>
          Boost Your Spirit with the Cheer Bot Chatbot: Your Personal
          Cheerleader
        </p>
      </div>
      <div>
        <div className="wrapper">
          <div>
            <form onSubmit={submitLocation}>
              <button style={{ alignItems: "center"}} type="submit">Psychologists Around You</button>
            </form>
            <ReactModal isOpen={isModalOpen}>
              <button
                style={{ color: "black" }}
                onClick={() => setIsModalOpen(false)}
              >
                Close Modal
              </button>
              {isModalOpen && responseData && (
                <div>
                  <p style={{ color: "black", textAlign: "center" }}>Here are Psychologists around you:</p>
                  <div style={{ color: "black" }}>
                    {Object.keys(responseData.list).map((key) => {
                      return (
                        <div key={key}>
                          <p>Hospital Name: {responseData.list[key].name}</p>
                          <p>Address: {responseData.list[key].vicinity}</p>
                          <p>Google Map Link: {responseData.list[key].googleMap_link}</p>
                          <p>Availability: {responseData.list[key].open}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </ReactModal>
          </div>
          <div className="box">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    typing ? <TypingIndicator content="Cheer Bot😃" /> : null
                  }
                >
                  {messages.map((message, index) => (
                    <Message key={index} model={message} />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="Enter message"
                  onSend={handleSubmit}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
