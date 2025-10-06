import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Badge, Indicator } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";

const ChatMessageBox = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMessages = async () => {
    if (!hasMore) return;

    const res = await axios.get(`/api/chats/rooms/${roomId}/messages`, {
      params: { page: currentPage, size: 50 },
    });

    const newMessages = res.data;

    if (newMessages.length === 0) {
      setHasMore(false); // no more messages to load
      return;
    }

    // Prepend older messages to existing list
    setMessages((prev) => [...newMessages, ...prev]);

    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 p-4">
        {messages.map((msg) =>
          msg.sender.id === userId ? (
            <MyMessage key={msg.messageId} message={msg} />
          ) : (
            <OtherPeopleMessage key={msg.messageId} message={msg} />
          )
        )}
      </div>
    </div>
  );
};

const MyMessage = ({ user, message }) => (
  <div>
    <div className="flex justify-between">
      <p>You</p>
      <p>{message.timeSent}</p>
    </div>
    <div className="border rounded-2xl rounded-tr-none">
      <Text>{message.content}</Text>
      <div className="flex">
        <Badge>
          <IconFile></IconFile>
        </Badge>
        <div>{message.filename}</div>
        <div>{message.fileSize}</div>
      </div>
    </div>
  </div>
);

const OtherPeopleMessage = ({ user, message }) => (
  <div className="flex">
    <Indicator>
      <Avatar src={user.avatarUrl || ""}></Avatar>
    </Indicator>
    <div>
      <div className="flex justify-between">
        <p>
          {user.firstname} {user.lastname}
        </p>
        <p>{message.timeSent}</p>
      </div>
      <div className="border rounded-2xl rounded-tl-none">
        <Text>{message.content}</Text>
        <div className="flex">
          <Badge>
            <IconFile></IconFile>
          </Badge>
          <div>{message.filename}</div>
          <div>{message.fileSize}</div>
        </div>
      </div>
    </div>
  </div>
);

export default ChatMessageBox;
