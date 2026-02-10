import { X, Send, Headset, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCustomerChat } from "@/features/customer/chat/hooks/useCustomerChat";
import { formatChatTime } from "@/utils/chat-utils";

const ChatBubble = () => {
  const {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    handleSend,
    unreadCount,
    messagesEndRef,
    isLoggedIn,
    user,
    mode,
    setMode,
    isAiThinking,
  } = useCustomerChat();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      {/* Chat Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-background border rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center flex-none shadow-md">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                        <Headset className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-wide">Hỗ trợ trực tuyến</h3>
                    <p className="text-xs text-blue-100 font-medium">Luôn sẵn sàng hỗ trợ bạn</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/20 rounded-full h-8 w-8 transition-colors">
                <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          {isLoggedIn ? (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-4">
                  {/* Welcome Message + chế độ */}
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {mode === "ai" ? "AI" : "SP"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-sm shadow-sm space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-blue-600 text-xs">
                          {mode === "ai" ? "Trợ lý AI gợi ý sản phẩm" : "Support Team"}
                        </p>
                        <div className="inline-flex items-center rounded-full bg-slate-100 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => setMode("human")}
                            className={`px-2 py-[2px] text-[10px] rounded-full ${
                              mode === "human"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600"
                            }`}
                          >
                            Nhân viên
                          </button>
                          <button
                            type="button"
                            onClick={() => setMode("ai")}
                            className={`px-2 py-[2px] text-[10px] rounded-full flex items-center gap-1 ${
                              mode === "ai"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600"
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            AI
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700">
                        Xin chào{" "}
                        <span className="font-semibold">
                          {user?.full_name || "bạn"}
                        </span>
                        ! 👋
                      </p>
                      {mode === "ai" ? (
                        <p className="text-slate-700 text-xs leading-relaxed">
                          Hãy mô tả sản phẩm bạn muốn tìm, ví dụ:
                          <br />
                          “áo đá bóng màu xanh size M”, “giày chạy bộ nữ đi làm”.
                          Mình sẽ gợi ý danh sách sản phẩm phù hợp cho bạn.
                        </p>
                      ) : (
                        <p className="text-slate-700 text-xs">
                          Bạn có thể nhắn tin để trao đổi trực tiếp với nhân viên
                          hỗ trợ.
                        </p>
                      )}
                      <span className="text-[10px] text-slate-400 mt-1 block text-right">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {messages.map((msg) => {
                    const isCustomer = msg.sender === "CUSTOMER";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isCustomer ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isCustomer && (
                             <Avatar className="h-8 w-8 mr-2 mt-1">
                                <AvatarFallback className="bg-blue-100 text-blue-600">SP</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            isCustomer
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                          }`}
                        >
                          {msg.type === "TEXT" && (
                            <p className="whitespace-pre-line">{msg.content}</p>
                          )}
                          {msg.type === "IMAGE" && (
                              <img src={msg.fileUrl} alt="sent image" className="rounded-lg max-w-full" />
                          )}
                          {msg.type === "FILE" && (
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="underline">
                                  {msg.content}
                              </a>
                          )}
                          <span className={`text-[10px] mt-1 block text-right ${isCustomer ? "text-blue-100" : "text-slate-400"}`}>
                            {formatChatTime(msg.sentAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {isAiThinking && (
                    <div className="flex justify-start">
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-3 py-2 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-xs text-slate-500 shadow-sm">
                        Đang tìm sản phẩm phù hợp cho bạn...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 border-t bg-background flex gap-2 flex-none">
                <Input
                  type="text"
                  placeholder={
                    mode === "ai"
                      ? "Mô tả sản phẩm bạn muốn tìm..."
                      : "Nhập tin nhắn..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
                <Button
                  size="icon"
                  className="rounded-full shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-95"
                  onClick={handleSend}
                  disabled={!input.trim() || isAiThinking}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Vui lòng đăng nhập</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-[200px]">
                    Bạn cần đăng nhập để bắt đầu cuộc trò chuyện với nhân viên hỗ trợ.
                </p>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative group">
        <Button
          size="icon"
          className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={toggleChat}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Headset className="w-7 h-7 text-white" />
          )}
        </Button>

        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white shadow-sm animate-bounce">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};
export default ChatBubble;
