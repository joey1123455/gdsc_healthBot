 // Importing necessary dependencies and styles
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import Modal from "react-modal";
import './react-modal.css'
import axios from 'axios';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

// Setting the app element to be the root element of your app for accessibility purposes
Modal.setAppElement("#root");

function App() {
  // Define state variables
  const [messages, setMessages] = useState([]); // store chat messages
  const [typing, setTyping] = useState(false); // show typing indicator
  const [location, setLocation] = useState(null); // store user's location
  const [returnedData, setReturnedData] = useState(null); // store data returned from the backend
  const [modalIsOpen, setModalIsOpen] = useState(false); // show/hide modal window

  // Add an event listener for the beforeunload event and remove it when the component unmounts
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Prompt user to confirm if they want to clear chat history when the page is being refreshed or closed
  const clearChats = () => {
    setMessages([]);
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault();
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
        clearChats();
        window.removeEventListener("beforeunload", handleBeforeUnload);
        Swal.fire(
          'Deleted!',
          'Your Chats has been deleted.',
          'success'
        )
      }
    })
  }

  // Send message to backend and add response to chat history
  const apiUrl = "http://34.136.104.12:/api/"
  const handleSubmit = async (messageText) => {
    axios.post(apiUrl, { msg: messageText }, { mode: 'no-cors' })
      .then(response => {
        if (response.status === 200) {
          // Format the response message
          let message = response.data.res
          let time = response.data.time
          let newMessage = `${message} <br>${time}</br>`
          const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
          let date = new Date().toLocaleString(options).replace(/[/]/g, '-');
          let userMessage = `${messageText} <br>${date}</br>`
          // Add the message to chat history
          setMessages([...messages,{
            message: userMessage,
            direction: "outgoing"
          },
          {
            message: newMessage
          }]);
          // Hide typing indicator
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
// This function retrieves the user's location using the browser's Geolocation API
const getLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
  setLocation({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  });
  });
  };
  
  // This function sends the user's location data to a backend API using the Axios library
  const sendLocationToBackend = () => {
  if (location) {
  axios.post("http://34.136.104.12:/api/location", {
  lat: location.latitude,
  lon: location.longitude,
  })
  .then((response) => {
  // This logs the returned data and sets it in state
  console.log(response.data);
  setReturnedData(response.data);
  setModalIsOpen(true);
  })
  .catch((error) => {
  console.log(error);
  });
  }
  };
  
  // This function closes the modal
  const closeModal = () => {
  setModalIsOpen(false);
  };
  
  // This component renders the content of the modal from the locationAPi
  function ModalContent(props) {
  const { desc, list } = props;
  
  return (
  <div className="modal-content">
  <h2>{desc}</h2>
  {list && list.map((item, index) => (
  <div key={index}>
  <h3>{item.name}</h3>
  <p>{item.vicinity}</p>
  <p dangerouslySetInnerHTML={{ __html: item.googleMap_link }}></p>
  <p>{item.open}</p>
  </div>
  ))}
  </div>
  );
  }
  

  return (
    <div className="">
      <div className="header">
        <p style={{ textAlign: "center" }}>The Cheer Bot😃</p>
      </div>
      <div>
      <p style={{ textAlign: "center" }}>
      Boost Your Spirit with the Cheer Bot Chatbot: Your Personal Cheerleader
        </p>
    </div>
    <div>
      <button onClick={getLocation}>Get Location</button>
      <button onClick={sendLocationToBackend}>Send Location</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Returned Data Modal"
        className="modal"
      >
       <ModalContent desc={returnedData && returnedData.desc} />
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
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