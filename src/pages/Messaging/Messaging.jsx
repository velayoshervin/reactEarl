import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { queryClient } from "../../AxiosTanstack";
import "@mantine/notifications/styles.css";
import "./Messaging.css";
// import { users, chats } from "./messageDesignData";
import {
  IconFilePencil,
  IconSearch,
  IconDotsVertical,
  IconFile,
  IconSend2,
  IconArrowLeft,
  IconCircleFilled,
  IconMessage,
} from "@tabler/icons-react";

import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  Autocomplete,
  Avatar,
  Indicator,
  Button,
  Paper,
  Select,
} from "@mantine/core";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";

import Highlight from "@tiptap/extension-highlight";

import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import axios from "axios";

const MessageBoxHeader = ({ contact }) => {
  console.log("contactIn MessageHeader", contact);

  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <div className="p-4 flex justify-between border border-gray-200  ">
      <div className="flex items-center gap-2">
        <Avatar src={contact?.avatarUrl} name={fullName} size={48}></Avatar>
        <div className="contactInfo">
          <Group>
            <Text>{fullName}</Text>
          </Group>
        </div>
      </div>
      <Group>
        <Button variant="default">View Profile</Button>
        <ActionIcon variant="subtle" color="gray">
          <IconDotsVertical size={16}></IconDotsVertical>
        </ActionIcon>
      </Group>
    </div>
  );
};

const UserProfileBox = ({ user, onStartChat, onBack }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header with Back Button */}
      <div className="p-4 flex items-center border-b border-gray-200">
        <ActionIcon variant="subtle" onClick={onBack} className="mr-3">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Text size="lg" fw={600}>
          User Profile
        </Text>
      </div>

      {/* Centered Profile Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Stack align="center" gap="lg" className="max-w-md w-full">
          {/* Avatar */}
          <Avatar
            src={user.avatarUrl}
            size={120}
            radius="50%"
            className="border-4 border-blue-100"
          >
            {!user.avatarUrl && `${user.firstName[0]}${user.lastName[0]}`}
          </Avatar>

          {/* Name and Online Status */}
          <Stack gap="xs" align="center">
            <Text size="xl" fw={700} className="text-center">
              {user.firstName} {user.lastName}
            </Text>

            <Group gap="xs">
              <IconCircleFilled size={12} color="#00D100" />
              <Text size="sm" c="dimmed">
                Online
              </Text>
            </Group>
          </Stack>

          {/* Role Badge */}
          <Badge variant="light" color="blue" size="lg" radius="sm">
            {user.role}
          </Badge>

          {/* Member Since */}

          {/* Message Button */}
          <Button
            size="md"
            className="w-full max-w-xs"
            onClick={() => onStartChat(user)}
            leftSection={<IconSend2 size={20} />}
            radius="md"
          >
            Start Chat
          </Button>
        </Stack>
      </div>
    </div>
  );
};

const TextEditor = ({ onSendMessage }) => {
  const isEditorEmpty = () => {
    if (!editor) return true;
    return editor.getText().trim() === "";
  };

  const handleSend = () => {
    if (isEditorEmpty()) return;

    const content = editor.getHTML();
    console.log("htmlContent", content);
    onSendMessage(content);
    editor.commands.clearContent();
  };

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });
  return (
    <RichTextEditor
      editor={editor}
      style={{
        width: "100%",
        wordBreak: "break-word",
        overflowX: "hidden",
      }}
    >
      <RichTextEditor.Content className="h-[60px] overflow-y-auto break-words " />
      <RichTextEditor.Toolbar
        sticky
        stickyOffset="var(--docs-header-height)"
        className="!flex"
      >
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <Button
          size="xs"
          className="!rounded-3xl !ml-auto"
          rightSection={<IconSend2 size={16}></IconSend2>}
          onClick={handleSend}
          disabled={isEditorEmpty()}
          variant={isEditorEmpty() ? "light" : "filled"}
        >
          Send
        </Button>
      </RichTextEditor.Toolbar>
    </RichTextEditor>
  );
};

const Messaging = () => {
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [messageBoxmessage, setMessageBoxMessage] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [contacts, setContacts] = useState();
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [message, setMessage] = useState();
  const [chatRooms, setChatRooms] = useState([]);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    console.log(selectedChat);
  }, [selectedChat]);

  useEffect(() => {
    const user = queryClient.getQueryData(["currentUser"]);
    if (user) {
      setCurrentUser(user);
      setUserId(user.userId);
      console.log(user);
    }
  }, []);

  useEffect(() => {
    const getContacts = async () => {
      try {
        setIsLoadingContacts(true);
        const res = await axios.get(
          "http://localhost:8080/public/user/user-contacts"
        );
        if (res) {
          setContacts(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    getContacts();
  }, []);

  useEffect(() => {
    const testEndpoint = async () => {
      if (!currentUser?.userId) {
        console.log("No user ID yet, skipping endpoint test");
        return;
      }

      try {
        console.log("Testing endpoint with user ID:", currentUser.userId);

        const response = await axios.get(
          `http://localhost:8080/chats/chatRooms/${currentUser.userId}`,
          {
            withCredentials: true,
          }
        );

        console.log("✅ Endpoint successful! Response:", response);
        console.log("✅ Response data:", response.data);
        console.log("✅ Number of chats:", response.data.length);

        if (response.data.length > 0) {
          console.log("✅ First chat details:", response.data[0]);
          console.log(
            "✅ First chat participants:",
            response.data[0].participants
          );
          console.log("✅ First chat messages:", response.data[0].messages);
        }

        setChatRooms(response.data);
      } catch (error) {
        console.error("❌ Endpoint failed:", error);
        console.error("❌ Error response:", error.response);
        console.error("❌ Error message:", error.message);
      }
    };

    testEndpoint();
  }, [currentUser?.userId, newMessage]);

  const MessageListHeader = () => {
    return (
      <Stack gap="sm">
        <div className="flex justify-between items-center px-4 pt-4">
          <Group gap="xs" className="">
            <Text size="lg" fw={600}>
              Messages
            </Text>
            <Badge color="dimmed">4</Badge>
          </Group>
          <ActionIcon variant="subtle" color="gray">
            <IconFilePencil size={20} />
          </ActionIcon>
        </div>

        <Autocomplete
          className="px-4 mb-2"
          placeholder="Search"
          leftSection={<IconSearch size={16} />}
          leftSectionPointerEvents="none"
          data={
            contacts?.map(
              (contact) =>
                `${contact.firstName} ${contact.lastName} (${contact.email})`
            ) || []
          }
          onOptionSubmit={(selected) => {
            const email = selected.split(" (")[1].replace(")", "");
            const selectedUser = contacts?.find((u) => u.email === email);
            if (selectedUser) {
              handleUserSelect(selectedUser);
            }
          }}
        />
      </Stack>
    );
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user); // Show user profile
    setSelectedChat(null); // Clear any active chat
    setSelectedChatId(null);
  };

  const ChatBubble = ({ message }) => {
    const currentUserId = currentUser?.userId;

    // Debug: Check the message structure
    console.log("Message in ChatBubble:", message);
    console.log("Message sender:", message.sender);

    // Check if message is from current user - handle different ID fields
    const isYou =
      message.sender?.userId === currentUserId ||
      message.sender?.id === currentUserId;

    // Get sender name - handle different field name variations
    const getSenderName = () => {
      if (isYou) return "You";

      if (!message.sender) return "Unknown";

      // Try different field name combinations
      const firstName =
        message.sender.firstName ||
        message.sender.firstname ||
        message.sender.name ||
        "";
      const lastName = message.sender.lastName || message.sender.lastname || "";

      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }

      return "Unknown User";
    };

    const senderName = getSenderName();
    const avatarUrl = message.sender?.avatarUrl;

    return (
      <div
        className={`flex w-full gap-2 mb-2 !min-w-[300px] ${
          isYou ? "justify-end" : "justify-start"
        }`}
      >
        <Avatar src={avatarUrl} name={senderName} size={32} color="initials">
          {!avatarUrl && senderName.charAt(0)}
        </Avatar>
        <div>
          <div className="flex justify-between max-w-[520px]">
            <Text size="xs" c="dimmed">
              {senderName}
            </Text>
            <Text size="xs" c="dimmed">
              {message.timeSent
                ? new Date(
                    message.timeSent.replace(
                      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
                      "$3-$2-$1T$4:$5:$6"
                    )
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </div>

          <div
            className={`border border-gray-200 rounded-2xl p-3 mt-1 min-w-[100px] ${
              isYou
                ? "rounded-tr-none bg-blue-600 text-white"
                : "rounded-tl-none bg-white"
            }`}
          >
            {/* Render HTML content safely */}
            <div
              dangerouslySetInnerHTML={{ __html: message.content }}
              className="rich-text-content"
            />
          </div>
        </div>
      </div>
    );
  };

  const ChatListMessage = ({ chat, onClick, isSelected }) => {
    const currentUserId = currentUser?.userId;

    // Find the other participant (not current user)
    const otherParticipant = chat.participants.find((p) => {
      const participantId = p.userId || p.id;
      return participantId !== currentUserId;
    });

    console.log("Other participant for avatar:", otherParticipant); // Debug

    // Handle different field names
    const getParticipantName = (participant) => {
      if (!participant) return "Unknown User";
      const firstName = participant.firstName || participant.firstname;
      const lastName = participant.lastName || participant.lastname;
      return `${firstName} ${lastName}`;
    };

    const lastMessage =
      chat.lastMessage ||
      (chat.messages?.length > 0
        ? chat.messages[chat.messages.length - 1]
        : null);

    return (
      <div
        className={`flex justify-between items-center py-3 px-4 hover:bg-gray-50 cursor-pointer ${
          isSelected ? "bg-blue-200" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex gap-2 items-start">
          <Indicator color="green" size={10} offset={6}>
            <Avatar
              src={otherParticipant?.avatarUrl}
              name={getParticipantName(otherParticipant)}
              size={40}
            >
              {!otherParticipant?.avatarUrl &&
                getParticipantName(otherParticipant).charAt(0)}
            </Avatar>
          </Indicator>

          <div className="flex flex-col leading-tight">
            <Text fw={500}>{getParticipantName(otherParticipant)}</Text>
            <Text size="xs" c="dimmed" className="truncate max-w-[200px]">
              {lastMessage
                ? lastMessage.content.replace(/<[^>]*>/g, "").substring(0, 30) +
                  "..."
                : "Start a conversation"}
            </Text>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <Text size="xs" c="dimmed">
            {lastMessage?.timeSent
              ? new Date(
                  lastMessage.timeSent.replace(
                    /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
                    "$3-$2-$1T$4:$5:$6"
                  )
                ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : ""}
          </Text>
        </div>
      </div>
    );
  };

  const onSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    try {
      if (selectedChat.id?.toString().startsWith("new-chat-")) {
        // New chat: create chat room and send first message
        const response = await axios.post(
          "http://localhost:8080/chats/direct-message",
          {
            senderId: currentUser.userId,
            receiverId: selectedChat.target.id, // New chat target
            htmlContent: content,
            attachmentList: [],
          },
          { withCredentials: true }
        );

        const chatRoom = response.data;

        // Replace temporary chat with actual chat room
        setSelectedChat({
          id: chatRoom.chatRoomId,
          target: selectedChat.target,
          messages: chatRoom.messages || [],
        });

        // Update chatRooms list
        setChatRooms((prev) => [chatRoom, ...prev]);

        notifications.show({
          title: "Message sent!",
          message: "Your message has been delivered 🌟",
        });
      } else {
        // Existing chat: just send message to existing chat room

        console.log("userID", userId);

        const response = await axios.post(
          `http://localhost:8080/chats/${selectedChat.id}/send-messages`,
          {
            content: content,
            senderId: currentUser?.userId,
          },
          { withCredentials: true }
        );

        const newMessage = response.data;
        setNewMessage(newMessage);

        // Append message to chat UI
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));

        // Optionally update chatRooms lastMessage
        setChatRooms((prev) =>
          prev.map((chat) =>
            chat.chatRoomId === selectedChat.id
              ? { ...chat, lastMessage: newMessage }
              : chat
          )
        );

        notifications.show({
          title: "Message sent!",
          message: "Your message has been delivered 🌟",
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      notifications.show({
        title: "Error",
        message: "Failed to send message. Please try again.",
        color: "red",
      });
    }
  };

  const handleStartChat = (user) => {
    // Create the selectedChat object immediately

    console.log("handleStartUser", user);

    const newChat = {
      id: `new-chat-${user.id}`, // Temporary ID
      target: user,
      messages: [],
    };

    // This will make the chat interface render
    setSelectedChat(newChat);
    setSelectedUser(null); // Hide the profile
  };

  return (
    <div className="flex w-full h-[90vh] border border-gray-200">
      {/* Sidebar */}
      <div className="message-list border-r border-gray-300 flex flex-col">
        <MessageListHeader />

        <div className="flex flex-col overflow-y-auto  divide-gray-200 divide-y-[0.5px] ">
          {chatRooms.map((chatRoom) => (
            <ChatListMessage
              key={chatRoom.chatRoomId}
              chat={chatRoom}
              isSelected={selectedChat?.id === chatRoom.chatRoomId}
              onClick={() => {
                const currentUserId = currentUser?.userId;

                console.log("=== CHAT SELECTION DEBUG ===");
                console.log("Current user ID:", currentUserId);
                console.log("All participants:", chatRoom.participants);

                // Find the other participant (not current user)
                const otherParticipant = chatRoom.participants.find((p) => {
                  const participantId = p.userId || p.id;
                  console.log(
                    "Checking participant:",
                    participantId,
                    "vs current:",
                    currentUserId
                  );
                  return participantId !== currentUserId;
                });

                console.log("Other participant found:", otherParticipant);
                console.log("=== END DEBUG ===");

                if (!otherParticipant) {
                  console.error("Could not find other participant!");
                  return;
                }

                setSelectedChat({
                  id: chatRoom.chatRoomId,
                  target: otherParticipant, // This should be the person you're chatting with
                  messages: chatRoom.messages || [],
                });
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col ">
        {selectedChat ? (
          /* Show Chat Interface */
          <>
            <MessageBoxHeader contact={selectedChat.target} />
            <div className="p-4 overflow-y-scroll h-[60vh] flex flex-col gap-4 bg-[#f0f4f8]">
              {selectedChat.messages.map((m, idx) => (
                <ChatBubble key={idx} message={m} />
              ))}
            </div>
            <div className="px-4">
              <TextEditor onSendMessage={onSendMessage} />
            </div>
          </>
        ) : selectedUser ? (
          /* Show User Profile */
          <UserProfileBox
            user={selectedUser}
            onStartChat={handleStartChat}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          /* Show Empty State */
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IconMessage size={64} className="mx-auto mb-4" />
              <Text size="xl" fw={500}>
                Select a chat to start messaging
              </Text>
              <Text size="sm" mt="xs">
                Or search for a user to start a new conversation
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
