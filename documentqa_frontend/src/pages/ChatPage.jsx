import React from "react";
import { useParams } from "react-router-dom";
import ChatInterface from "../components/ChatPageComponents/ChatInterface";

const ChatPage = () => {
  const { document_id } = useParams();
  return (
    <div className="chat-container">
      <ChatInterface document_id={document_id} />
    </div>
  );
};

export default ChatPage;
