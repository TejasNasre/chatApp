import React, { Children } from "react";
import Header from "../Components/Header";
import { useState, useEffect } from "react";
import { databases } from "../appWriteConfig";
import { ID, Permission, Role } from "appwrite";
import { AiFillDelete } from "react-icons/ai";
import client from "../appWriteConfig";
import { useAuth } from "../Context/AuthContext";

export default function Room() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    let permission = [
      Permission.write(Role.user(user.$id)), // User can write this document
    ];

    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
      ID.unique(),
      payload,
      permission
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
          // console.log(`New message created: ${response.payload.$id}`);
          setMessages((prev) => [...prev, response.payload]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // console.log(`Message deleted: ${response.payload.$id}`);
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
          <div className="overflow-chat">
            {messages.map((message) => (
              <div key={message.$id} className="message--wrapper">
                <div className="message--header">
                  <p>
                    {message?.username ? (
                      <span>{message.username}</span>
                    ) : (
                      <span>Anonymous User</span>
                    )}
                    <small className="message-timestamp">
                      {new Date(message.$createdAt).toLocaleString()}
                    </small>
                  </p>
                  {message.$permissions.includes(
                    `delete(\"user:${user.$id}"\)`
                  ) && (
                    <AiFillDelete
                      onClick={() => deleteMessage(message.$id)}
                      className="delete--btn"
                    />
                  )}
                </div>
                <div className="message--body">
                  <p>{message.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="message--container">
          <form id="message--form" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                required
                maxLength="1000"
                placeholder="Type your message here..."
                onChange={(e) => setMessageBody(e.target.value)}
                name="message"
                value={messageBody}
              ></input>
            </div>
            <div className="send-btn--wrapper">
              <input
                type="submit"
                value="Talk!"
                className="btn btn--secondary"
              />
            </div>
          </form>
          </div>
        </div>
      </main>
    </>
  );
}
