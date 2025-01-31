import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatSkeletonLoader from "./ChatSkeletonLoader";
import TypingEffect from "./TypingEffect";

// Helper function to format the timestamp as a date string (e.g., "January 21, 2025")
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ChatInterface = ({ document_id }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);

  // Load chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/chats/chat_history/${document_id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.data.success) {
          // Group messages by date
          const groupedMessages = response.data.chat_history_data.reduce(
            (acc, item) => {
              const messageDate = formatDate(item.timestamp);

              // If this date is already in the accumulator, append the messages
              if (!acc[messageDate]) {
                acc[messageDate] = [];
              }

              acc[messageDate].push({
                type: "user",
                text: item.query,
                timestamp: item.timestamp,
              });
              acc[messageDate].push({
                type: "app",
                text: item.response,
                timestamp: item.timestamp,
              });

              return acc;
            },
            {}
          );

          // Flatten the grouped messages into an array, maintaining the order of dates
          const loadedMessages = Object.keys(groupedMessages)
            .sort((a, b) => new Date(a) - new Date(b)) // Sort by date descending
            .flatMap((date) => [
              { type: "date", text: date }, // Add date separator
              ...groupedMessages[date],
            ]);

          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [document_id]);

  const handleSendMessage = async (ev) => {
    ev.preventDefault();
    if (userInput.trim() === "") {
      return;
    }

    const userMessage = {
      type: "user",
      text: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/chats/query/${document_id}/`,
        {
          query: userInput,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.success === true) {
        setTypingMessage(response.data.data.response);
      } else {
        const errorResponse = {
          type: "app",
          text: "Sorry, I couldn't process your request. Please try again",
        };
        setMessages((prevMessages) => [...prevMessages, errorResponse]);
      }
    } catch (error) {
      const errorResponse = {
        type: "app",
        text: "An error occurred while communicating with the server. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
    setUserInput("");
  };

  const handleTypingComplete = () => {
    if (typingMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "app", text: typingMessage },
      ]);
      setTypingMessage(null);
    }
  };

  return (
    <div className="d-flex flex-column h-100 justify-content-between chat-container">
      {/* Chat Messages */}
      <div
        className="chats px-4 py-4"
        style={{ overflowY: "auto", flexGrow: 1 }}
      >
        {messages.map((message, index) => (
          <div key={index} className="mb-3">
            {message.type === "date" && (
              <div className="text-center text-muted my-3">
                <strong>{message.text}</strong>
              </div>
            )}
            {message.type !== "date" && (
              <div
                className={`${
                  message.type === "user" ? "float-end" : "float-start"
                }`}
              >
                <p
                  className={`${
                    message.type === "user"
                      ? "bg-light text-dark"
                      : "bg-dark text-white"
                  } py-2 px-4 rounded shadow-sm`}
                  style={{ maxWidth: "75%" }}
                >
                  {message.text}
                </p>
              </div>
            )}
            <div className="clearfix"></div>
          </div>
        ))}
        {isLoading && <ChatSkeletonLoader />}
        {typingMessage && (
          <TypingEffect
            text={typingMessage}
            onComplete={handleTypingComplete}
          />
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-box px-4 md-pt-2 d-flex border-top align-items-center justify-content-center">
        <form className="py-2 w-100" onSubmit={handleSendMessage}>
          <div className="input-group d-flex gap-2 ">
            <input
              type="text"
              className="form-control"
              placeholder="Message DocuGenius and explore your document"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              style={{ borderRadius: "20px" }}
            />
            <button
              className="btn btn-dark"
              type="submit"
              disabled={isLoading}
              style={{ borderRadius: "20px" }}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
