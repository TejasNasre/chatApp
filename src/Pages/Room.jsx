import React, { Children } from "react";
import Header from "../Components/Header";
import { useState, useEffect } from "react";
import { databases } from "../appWriteConfig";
import { ID, Query } from "appwrite";
import { AiFillDelete } from "react-icons/ai";
import client from "../appWriteConfig";

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      body: messageBody,
    };

    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
      ID.unique(),
      payload
    );
    setMessageBody("");
  };

  const getMessagge = async () => {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
      [],
      20,
      0,
      "$createdAt",
      "ASC"
    );
    setMessages(response.documents);
  };

  const deleteMessage = async (id) => {
    databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
      id
    );
  };

  useEffect(() => {
    getMessagge();
    const unsubscribe = client.subscribe(
      `databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.${
        import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID
      }.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log(`New message created: ${response.payload.$id}`);
          setMessages((prev) => [...prev, response.payload]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log(`Message deleted: ${response.payload.$id}`);
          setMessages((prev) =>
            prev.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <main className="container">
      <Header />
        <div className="room--container">
          
          <form id="message--form" onSubmit={handleSubmit}>
            <div>
              <textarea
                required
                maxLength="1000"
                placeholder="Type your message here..."
                onChange={(e) => setMessageBody(e.target.value)}
                name="message"
                value={messageBody}
              ></textarea>
            </div>
            <div className="send-btn--wrapper">
              <input
                type="submit"
                value="send"
                className="btn btn--secondary"
              />
            </div>
          </form>

          <div>
            {messages.map((message) => (
              <div key={message.$id} className="message--wrapper">
                <div className="message--header">
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                  <AiFillDelete
                    onClick={() => deleteMessage(message.$id)}
                    className="delete--btn"
                  />
                </div>
                <div className="message--body">
                  <p>{message.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
