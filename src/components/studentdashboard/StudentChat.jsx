// src/components/studentdashboard/StudentChat.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  XMarkIcon,
  ArrowLeftIcon,
  DocumentIcon,
  PhotoIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
} from "@heroicons/react/24/solid";

const initialConversations = [
  {
    id: 1,
    name: "TechCorp HR",
    role: "Senior Recruiter",
    company: "TechCorp Inc.",
    avatar: "T",
    lastActive: "2m ago",
    online: true,
    unread: 2,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hi! Thanks for applying to our Software Developer Intern position. Your profile caught our attention!",
        time: "9:30 AM",
        status: "read",
      },
      {
        id: 2,
        from: "me",
        text: "Hello! Thank you so much for reaching out. I'm very excited about this opportunity and would love to learn more about the role.",
        time: "9:32 AM",
        status: "read",
      },
      {
        id: 3,
        from: "them",
        text: "Great! We'd like to schedule a technical interview with you. Are you available this Thursday at 2 PM?",
        time: "10:15 AM",
        status: "delivered",
      },
      {
        id: 4,
        from: "them",
        text: "Please let me know your availability and we can set it up.",
        time: "10:16 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Talent Acquisition",
    company: "FinEdge Solutions",
    avatar: "S",
    lastActive: "1h ago",
    online: true,
    unread: 0,
    messages: [
      {
        id: 1,
        from: "them",
        text: "We received your application for the Data Analyst position. We'll review and get back to you within a week.",
        time: "3:15 PM",
        status: "read",
      },
      {
        id: 2,
        from: "me",
        text: "Thank you for the update! Looking forward to hearing from you.",
        time: "3:20 PM",
        status: "read",
      },
    ],
  },
  {
    id: 3,
    name: "Alex Johnson",
    role: "Engineering Manager",
    company: "StartupXYZ",
    avatar: "A",
    lastActive: "3d ago",
    online: false,
    unread: 0,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Your portfolio is impressive! Would you be interested in a frontend role?",
        time: "Yesterday",
        status: "read",
      },
    ],
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "HR Director",
    company: "InnovateTech",
    avatar: "M",
    lastActive: "1w ago",
    online: false,
    unread: 0,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Thank you for your interest in InnovateTech!",
        time: "Last week",
        status: "read",
      },
    ],
  },
];

const avatarColors = [
  "from-slate-400 to-slate-500",
  "from-gray-400 to-gray-500",
  "from-slate-500 to-slate-600",
  "from-gray-500 to-gray-600",
];

export default function StudentChat() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    if (!selectedId && conversations.length > 0 && window.innerWidth >= 768) {
      setSelectedId(conversations[0].id);
    }
  }, [selectedId, conversations.length]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setShowMobileChat(true);
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, unread: 0 } : conv))
    );
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      });
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) {
      return <PhotoIcon className="w-5 h-5" />;
    }
    return <DocumentIcon className="w-5 h-5" />;
  };

  const handleSend = () => {
    if ((!input.trim() && !attachedFile) || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      file: attachedFile
        ? {
            name: attachedFile.name,
            size: attachedFile.size,
            type: attachedFile.type,
          }
        : null,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastActive: "Just now",
            }
          : conv
      )
    );

    setInput("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // simulate status update (sent -> delivered)
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === newMessage.id
                    ? { ...msg, status: "delivered" }
                    : msg
                ),
              }
            : conv
        )
      );
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const MessageStatus = ({ status }) => {
    if (status === "sent") {
      return <CheckIcon className="w-3 h-3" />;
    }
    if (status === "delivered") {
      return (
        <div className="flex -space-x-1.5">
          <CheckIcon className="w-3 h-3" />
          <CheckIcon className="w-3 h-3" />
        </div>
      );
    }
    if (status === "read") {
      return <CheckCircleSolid className="w-3.5 h-3.5 text-blue-400" />;
    }
    return null;
  };

  const getAvatarColor = (id) => {
    return avatarColors[id % avatarColors.length];
  };

  return (
    <section className="mt-4 sm:mt-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
              <ChatSolid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Messages
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Chat with recruiters about your applications
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {conversations.filter((c) => c.online).length} Online
            </div>
            <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {conversations.length} Chats
            </div>
          </div>
        </div>

        {/* Main content */}
        {/* On mobile: take almost full viewport height so input sticks to phone bottom */}
        <div className="flex h-[calc(100vh-140px)] min-h-[460px] md:h-[580px] bg-slate-50">
          {/* Conversations list */}
          <div
            className={`${
              showMobileChat ? "hidden" : "flex"
            } md:flex flex-col w-full md:w-[340px] lg:w-[360px] border-r border-gray-200 bg-white`}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left px-3 py-2.5 mb-1 flex gap-3 items-center rounded-xl border transition-all duration-200 ${
                      selectedId === conv.id
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm ${
                          selectedId === conv.id
                            ? "bg-blue-600"
                            : `bg-gradient-to-br ${getAvatarColor(conv.id)}`
                        }`}
                      >
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${
                            selectedId === conv.id
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {conv.name}
                        </p>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {conv.lastActive}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium truncate">
                        {conv.company}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.messages[conv.messages.length - 1]?.text}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unread > 0 && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                          {conv.unread}
                        </span>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    No results found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div
            className={`${
              showMobileChat ? "flex" : "hidden"
            } md:flex flex-col flex-1 bg-slate-50`}
          >
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    {/* Back button (mobile) */}
                    <button
                      onClick={handleBack}
                      className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {selectedConversation.avatar}
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {selectedConversation.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 truncate">
                          {selectedConversation.role}
                        </span>
                        {selectedConversation.online && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-green-600 font-medium">
                              Active now
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Only more-options button */}
                  <button className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-all">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${
                          msg.from === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Avatar for received messages */}
                        {msg.from !== "me" && (
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                              selectedConversation.id
                            )} flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0`}
                          >
                            {selectedConversation.avatar}
                          </div>
                        )}

                        <div
                          className={`max-w-[75%] sm:max-w-[65%] ${
                            msg.from === "me" ? "order-1" : ""
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                              msg.from === "me"
                                ? "bg-blue-600 text-white rounded-br-lg"
                                : "bg-white text-gray-800 rounded-bl-lg border border-gray-200"
                            }`}
                          >
                            {/* File attachment */}
                            {msg.file && (
                              <div
                                className={`flex items-center gap-3 p-2 rounded-xl mb-2 ${
                                  msg.from === "me"
                                    ? "bg-blue-500/40"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div
                                  className={`p-2 rounded-lg ${
                                    msg.from === "me"
                                      ? "bg-blue-600"
                                      : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {getFileIcon(msg.file.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-medium truncate ${
                                      msg.from === "me"
                                        ? "text-white"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {msg.file.name}
                                  </p>
                                  <p
                                    className={`text-[11px] ${
                                      msg.from === "me"
                                        ? "text-blue-100"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {formatFileSize(msg.file.size)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {msg.text && (
                              <p className="text-sm leading-relaxed break-words">
                                {msg.text}
                              </p>
                            )}

                            {/* Time and status */}
                            <div
                              className={`flex items-center justify-end gap-1.5 mt-1 ${
                                msg.from === "me"
                                  ? "text-blue-100"
                                  : "text-gray-400"
                              }`}
                            >
                              <span className="text-[10px] font-medium">
                                {msg.time}
                              </span>
                              {msg.from === "me" && (
                                <MessageStatus status={msg.status} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div ref={messagesEndRef} />
                </div>

                {/* File preview */}
                {attachedFile && (
                  <div className="mx-4 mb-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="p-2.5 rounded-lg bg-white text-blue-600 shadow-sm">
                        {getFileIcon(attachedFile.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {attachedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachedFile.size)}
                        </p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-all"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Input area – flex item at bottom, so on mobile it sits at phone bottom */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    {/* File attachment */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all flex-shrink-0"
                      title="Attach file (PDF, DOC, Images)"
                    >
                      <PaperClipIcon className="w-5 h-5" />
                    </button>

                    {/* Text input */}
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
                        style={{ minHeight: "44px", maxHeight: "120px" }}
                      />
                    </div>

                    {/* Send button */}
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() && !attachedFile}
                      className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                        input.trim() || attachedFile
                          ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center mt-2">
                    <span className="text-[10px] text-gray-400">
                      Press Enter to send • Shift + Enter for new line
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-8">
                <div className="mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Select a conversation
                </h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  Choose a conversation from the list on the left to start
                  messaging recruiters about your applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}