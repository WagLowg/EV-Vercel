import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'staff',
      text: 'Xin chào! 👋 Chúng tôi có thể giúp gì cho bạn?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const stompRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Scroll ngay lập tức và sau một delay nhỏ để đảm bảo DOM đã update
    scrollToBottom();
    const timer = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // Kết nối WebSocket khi mở chat lần đầu
  useEffect(() => {
    if (!isOpen || connected || sessionId) return;

    const initWebSocket = () => {
      try {
        const SockJS = window.SockJS;
        const Stomp = window.Stomp;

        if (!SockJS || !Stomp) {
          console.error('❌ SockJS hoặc Stomp chưa được load');
          console.log('💡 Đang chạy ở chế độ DEMO (không có WebSocket)');
          return;
        }

        console.log('🔌 Đang kết nối WebSocket...');
        const socket = new SockJS('http://localhost:8080/ws');
        const stomp = Stomp.over(socket);
        stomp.debug = () => {}; // Tắt debug logs

        stomp.connect({}, () => {
          console.log('✅ WebSocket connected');
          setConnected(true);

          // Tạo session mới
          const newSessionId = `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          setSessionId(newSessionId);

          // Subscribe để nhận tin nhắn từ staff
          stomp.subscribe(`/topic/chat/${newSessionId}`, (frame) => {
            try {
              const msg = JSON.parse(frame.body);
              if (msg.sender === 'STAFF') {
                const newMessage = {
                  id: Date.now(),
                  sender: 'staff',
                  text: msg.content,
                  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMessage]);
                setIsTyping(false);
              }
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          });

          // Notify staff về session mới
          const createPayload = {
            sessionId: newSessionId,
            customerId: currentUser.user_id || 'guest',
            customerName: currentUser.fullName || 'Khách hàng',
            timestamp: Date.now()
          };
          
          console.log('📤 Creating new chat session:', createPayload);
          stomp.send(
            '/app/chat.create',
            {},
            JSON.stringify(createPayload)
          );

          stompRef.current = stomp;
        }, (err) => {
          console.error('❌ WebSocket connection error:', err);
          console.log('💡 Đang chạy ở chế độ DEMO');
        });

      } catch (e) {
        console.error('Error initializing WebSocket:', e);
      }
    };

    initWebSocket();

    return () => {
      if (stompRef.current?.connected) {
        try {
          // Đóng session khi component unmount
          if (sessionId) {
            stompRef.current.send(
              '/app/chat.close',
              {},
              JSON.stringify({ sessionId })
            );
          }
          stompRef.current.disconnect(() => {
            console.log('🔌 WebSocket disconnected');
          });
        } catch (e) {
          console.error('Error disconnecting:', e);
        }
      }
    };
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const messageToSend = inputMessage;
    setInputMessage('');
    
    // Update messages và force scroll
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('📝 Messages updated:', updated.length, 'messages');
      // Force scroll sau khi update
      setTimeout(() => scrollToBottom(), 100);
      return updated;
    });

    // Gửi tin nhắn qua WebSocket
    if (connected && stompRef.current?.connected && sessionId) {
      try {
        const msgPayload = {
          sessionId: sessionId,
          sender: 'CUSTOMER',
          content: messageToSend,
          timestamp: Date.now()
        };
        console.log('📤 Sending message:', msgPayload);
        stompRef.current.send(
          '/app/chat.send',
          {},
          JSON.stringify(msgPayload)
        );
        console.log('✅ Message sent successfully');
      } catch (err) {
        console.error('❌ Error sending message:', err);
      }
    } else {
      console.log('⚠️ Cannot send - Not connected or no sessionId', {
        connected,
        hasStompConnection: !!stompRef.current?.connected,
        sessionId
      });
      // Demo mode - simulate staff reply
      console.log('💡 DEMO mode: Simulating staff reply');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const staffReply = {
          id: Date.now() + 1,
          sender: 'staff',
          text: 'Cảm ơn bạn đã liên hệ! Nhân viên của chúng tôi sẽ phản hồi trong giây lát. 😊',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, staffReply]);
      }, 1500);
    }
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // Scroll xuống cuối khi mở chat
    if (newIsOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  return (
    <>
      {/* Chat Popup */}
      <div className={`chat-widget-popup ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-widget-header">
          <div className="chat-widget-header-info">
            <div className="chat-widget-avatar">
              <span className="avatar-icon">👨‍💼</span>
              <span className="status-dot"></span>
            </div>
            <div className="chat-widget-title">
              <h4>Hỗ trợ khách hàng</h4>
              <p className="status-text">
                {connected ? '🟢 Đang kết nối' : '🔴 Chế độ demo'}
              </p>
            </div>
          </div>
          <button className="chat-widget-close" onClick={toggleChat}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chat-widget-messages">
          {console.log('🎨 Rendering messages:', messages.length, messages)}
          {messages.map((msg, index) => (
            <div key={`${msg.id}-${index}`} className={`chat-message ${msg.sender}`}>
              {msg.sender === 'staff' && (
                <div className="message-avatar">👨‍💼</div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message staff">
              <div className="message-avatar">👨‍💼</div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-widget-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" disabled={!inputMessage.trim()}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Button */}
      <button 
        className={`chat-widget-button ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        title="Chat với chúng tôi"
      >
        <svg className="chat-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12,3C6.5,3 2,6.58 2,11C2.05,13.15 3.06,15.17 4.75,16.5C4.75,17.1 4.33,18.67 2,21C4.37,20.89 6.64,20 8.47,18.5C9.61,18.83 10.81,19 12,19C17.5,19 22,15.42 22,11C22,6.58 17.5,3 12,3M12,17C7.58,17 4,14.31 4,11C4,7.69 7.58,5 12,5C16.42,5 20,7.69 20,11C20,14.31 16.42,17 12,17Z" />
        </svg>
        <span className="chat-badge">1</span>
      </button>
    </>
  );
}

export default ChatWidget;

