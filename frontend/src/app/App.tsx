import { useState, useEffect } from "react";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Check, CheckCheck, Pin, Mic, Moon, Sun, X, Bell, BellOff, Archive, Trash2, Image, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sent: boolean;
  read?: boolean;
  type?: 'text' | 'voice' | 'date';
  duration?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
  typing?: boolean;
  muted?: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", avatarColor: "#e57373", lastMessage: "See you tomorrow!", time: "14:32", online: true, pinned: true },
  { id: 2, name: "Design Team", avatar: "DT", avatarColor: "#64b5f6", lastMessage: "Mike: Updated the mockups", time: "13:15", unread: 3 },
  { id: 3, name: "Alex Rivera", avatar: "AR", avatarColor: "#81c784", lastMessage: "Thanks for the help", time: "11:48", online: true },
  { id: 4, name: "Mom", avatar: "M", avatarColor: "#ffb74d", lastMessage: "Call me when you can", time: "Yesterday" },
  { id: 5, name: "Project Alpha", avatar: "PA", avatarColor: "#ba68c8", lastMessage: "Sarah: Meeting at 3pm", time: "Yesterday", unread: 1, muted: true },
  { id: 6, name: "David Park", avatar: "DP", avatarColor: "#4db6ac", lastMessage: "Sounds good!", time: "Tuesday" },
  { id: 7, name: "Coffee Enthusiasts", avatar: "CE", avatarColor: "#a1887f", lastMessage: "Jake: Anyone up for coffee?", time: "Monday" },
  { id: 8, name: "Emma Wilson", avatar: "EW", avatarColor: "#f06292", lastMessage: "Let me check", time: "Monday" },
];

const mockMessages: Message[] = [
  { id: 1, text: "Yesterday", timestamp: "", sent: false, type: 'date' },
  { id: 2, text: "hey did you finish reviewing those designs i sent over?", timestamp: "10:30", sent: false },
  { id: 3, text: "yeah just wrapped up", timestamp: "10:32", sent: true, read: true },
  { id: 4, text: "looks really solid overall", timestamp: "10:32", sent: true, read: true },
  { id: 5, text: "oh awesome! any feedback?", timestamp: "10:33", sent: false },
  { id: 6, text: "Voice message", timestamp: "10:35", sent: true, read: true, type: 'voice', duration: '0:24' },
  { id: 7, text: "ok got it, i'll make those changes", timestamp: "10:36", sent: false },
  { id: 8, text: "also can you send me the final specs when you get a chance", timestamp: "10:36", sent: false },
  { id: 9, text: "sure thing, give me like 10 min", timestamp: "10:38", sent: true, read: true },
  { id: 10, text: "Today", timestamp: "", sent: false, type: 'date' },
  { id: 11, text: "morning! just sent over the specs", timestamp: "09:15", sent: true, read: true },
  { id: 12, text: "perfect timing, thanks", timestamp: "09:42", sent: false },
  { id: 13, text: "btw we should probably sync up before the client call", timestamp: "14:28", sent: false },
  { id: 14, text: "yeah good idea", timestamp: "14:30", sent: true, read: false },
  { id: 15, text: "tomorrow afternoon work for you?", timestamp: "14:30", sent: true, read: false },
  { id: 16, text: "See you tomorrow!", timestamp: "14:32", sent: false },
];

export default function App() {
  const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="size-full flex bg-background relative">
      {/* Sidebar */}
      <div className="w-[340px] flex flex-col border-r border-border/50">
        {/* Header with gradient */}
        <div className="p-4 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Chats
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-background/60 rounded-xl transition-all shrink-0"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </button>
              <button className="p-2 hover:bg-background/60 rounded-xl transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2.5 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2">
          <AnimatePresence>
            {mockChats.map((chat, index) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-3 flex items-start gap-3 rounded-2xl transition-all relative mb-1 ${
                  activeChat.id === chat.id
                    ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 shadow-sm"
                    : "hover:bg-muted/50"
                }`}
              >
                {chat.pinned && (
                  <Pin className="absolute right-3 top-3 w-3 h-3 text-violet-500" fill="currentColor" />
                )}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: chat.avatarColor }}
                  >
                    {chat.avatar}
                  </motion.div>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium truncate">{chat.name}</span>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {chat.muted && <span className="text-xs">🔕</span>}
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.typing ? (
                        <span className="text-violet-600 dark:text-violet-400 italic">typing...</span>
                      ) : (
                        chat.lastMessage
                      )}
                    </p>
                    {chat.unread && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs rounded-full shrink-0 min-w-[20px] text-center shadow-sm">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col backdrop-blur-sm">
        {/* Chat header */}
        <div className="h-18 border-b border-border/50 px-6 flex items-center justify-between shrink-0 bg-gradient-to-r from-background via-background to-violet-500/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 hover:bg-muted/30 -ml-2 pl-2 pr-4 py-2 rounded-2xl transition-all"
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg"
                style={{ backgroundColor: activeChat.avatarColor }}
              >
                {activeChat.avatar}
              </div>
              {activeChat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="text-left">
              <div className="font-semibold">{activeChat.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {activeChat.online && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                {activeChat.online ? "online" : "last seen recently"}
              </div>
            </div>
          </motion.button>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-muted/50 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-muted/50 rounded-xl transition-colors"
            >
              <Video className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-muted/50 rounded-xl transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-gradient-to-br from-background via-background to-violet-500/5">
          {mockMessages.map((msg, index) => {
            if (msg.type === 'date') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center my-6"
                >
                  <span className="text-xs px-4 py-1.5 bg-muted/60 backdrop-blur-sm rounded-full text-muted-foreground shadow-sm">
                    {msg.text}
                  </span>
                </motion.div>
              );
            }

            if (msg.type === 'voice') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sent ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[65%] px-4 py-3 rounded-3xl flex items-center gap-3 shadow-md ${
                      msg.sent
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full ${msg.sent ? "bg-white/20" : "bg-violet-500/20"}`}
                    >
                      <Mic className="w-4 h-4" />
                    </motion.button>
                    <div className="flex-1">
                      <div className={`h-6 flex items-center gap-0.5`}>
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0.5 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={`w-0.5 rounded-full ${msg.sent ? "bg-white/50" : "bg-violet-500/40"}`}
                            style={{ height: `${Math.random() * 16 + 8}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs opacity-70">{msg.duration}</span>
                    <div className={`flex items-center gap-1 text-xs ${msg.sent ? "text-white/70" : "text-muted-foreground"}`}>
                      {msg.timestamp}
                      {msg.sent && (
                        msg.read ? (
                          <CheckCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sent ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[65%] px-4 py-2.5 rounded-3xl shadow-md ${
                    msg.sent
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <div
                    className={`text-xs mt-1 flex items-center gap-1 justify-end ${
                      msg.sent ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sent && (
                      msg.read ? (
                        <CheckCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Message input */}
        <div className="border-t border-border/50 p-4 shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 hover:bg-violet-500/10 rounded-2xl transition-colors shrink-0 text-muted-foreground hover:text-violet-500"
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 hover:bg-violet-500/10 rounded-2xl transition-colors shrink-0 text-muted-foreground hover:text-violet-500"
              >
                <Image className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="flex-1 bg-muted/50 border border-border/50 rounded-3xl px-5 py-3 flex items-center gap-3 shadow-sm backdrop-blur-sm hover:border-violet-500/30 transition-colors">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    setMessage("");
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:opacity-70 transition-opacity text-muted-foreground hover:text-foreground"
              >
                <Smile className="w-5 h-5" />
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              {message.trim() ? (
                <motion.button
                  key="send"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 rounded-2xl transition-all shrink-0 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/50"
                  onClick={() => setMessage("")}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  key="mic"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 hover:bg-violet-500/10 rounded-2xl transition-colors shrink-0 text-muted-foreground hover:text-violet-500"
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[380px] bg-background border-l border-border/50 shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Profile Header */}
              <div className="p-5 border-b border-border/50 flex items-center justify-between bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                <h3 className="font-semibold">Contact Info</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-background/60 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Profile Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Avatar and Name */}
                <div className="flex flex-col items-center py-10 border-b border-border/50">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative mb-4"
                  >
                    <div
                      className="w-28 h-28 rounded-3xl text-white flex items-center justify-center text-3xl shadow-xl"
                      style={{ backgroundColor: activeChat.avatarColor }}
                    >
                      {activeChat.avatar}
                    </div>
                    {activeChat.online && (
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                    )}
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-2">{activeChat.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {activeChat.online && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    {activeChat.online ? "online" : "last seen recently"}
                  </p>
                </div>

                {/* Bio */}
                <div className="p-5 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Bio</div>
                  <p className="text-sm leading-relaxed">living life one day at a time ✨</p>
                </div>

                {/* Phone */}
                <div className="p-5 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Phone</div>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>

                {/* Username */}
                <div className="p-5 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Username</div>
                  <p className="text-sm">@{activeChat.name.toLowerCase().replace(/\s+/g, '')}</p>
                </div>

                {/* Actions */}
                <div className="p-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 rounded-2xl transition-colors text-left"
                  >
                    {activeChat.muted ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    <span>{activeChat.muted ? "Unmute" : "Mute"}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 rounded-2xl transition-colors text-left"
                  >
                    <Archive className="w-5 h-5" />
                    <span>Archive Chat</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-500/10 rounded-2xl transition-colors text-left text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Chat</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setShowProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}