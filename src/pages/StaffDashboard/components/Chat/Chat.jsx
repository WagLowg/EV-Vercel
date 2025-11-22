import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';

function Chat() {
  const [rooms, setRooms] = useState({}); // sessionId -> {input, sub}
  const stompRef = useRef(null);
  const roomsRef = useRef({});

  useEffect(() => {
    // ✅ Khởi tạo WebSocket connection
    const initWebSocket = () => {
      try {
        const SockJS = window.SockJS;
        const Stomp = window.Stomp;

        if (!SockJS || !Stomp) {
          console.error('❌ SockJS hoặc Stomp chưa được load');
          return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const stomp = Stomp.over(socket);
        stomp.debug = () => {}; // Tắt debug logs
        stompRef.current = stomp;

        stomp.connect({}, () => {
          console.log('✅ WebSocket connected');

          // 📌 Subscribe event CREATED/CLOSED từ server
          stomp.subscribe('/topic/staff/sessions', (frame) => {
            try {
              console.log('📨 Raw staff event frame:', frame.body);
              const evt = JSON.parse(frame.body);
              console.log('📨 Parsed staff event:', evt);
              console.log('📨 Event type:', evt.type);

              if (evt.type === 'CREATED') {
                console.log('✅ Creating room for session:', evt.sessionId);
                createRoom(evt.sessionId, evt.initialMessage);
              } else if (evt.type === 'CLOSED') {
                console.log('✅ Closing room for session:', evt.sessionId);
                closeRoom(evt.sessionId);
              } else {
                console.warn('⚠️ Unknown event type:', evt.type);
              }
            } catch (e) {
              console.error('❌ Error parsing staff event:', e);
            }
          });
          console.log('✅ Staff subscribed to /topic/staff/sessions');
        }, (err) => {
          console.error('❌ WebSocket connection error:', err);
          showError('Không thể kết nối chat. Vui lòng kiểm tra backend.');
        });

        return () => {
          if (stomp?.connected) {
            try {
              stomp.disconnect(() => {});
            } catch (e) {
              console.error('Error disconnecting:', e);
            }
          }
        };
      } catch (e) {
        console.error('Error initializing WebSocket:', e);
      }
    };

    const cleanup = initWebSocket();
    return cleanup;
  }, []);

  const createRoom = (sessionId, initialMessage) => {
    if (roomsRef.current[sessionId]) return;

    const msgContainer = document.createElement('div');
    msgContainer.id = `msgs-${sessionId}`;
    msgContainer.className = 'chat-messages';

    const inputEl = document.createElement('input');
    inputEl.id = `inp-${sessionId}`;
    inputEl.placeholder = 'Nhập tin nhắn...';
    inputEl.className = 'chat-input';

    const sendBtn = document.createElement('button');
    sendBtn.id = `btn-${sessionId}`;
    sendBtn.textContent = 'Gửi';
    sendBtn.className = 'chat-send-btn';

    // Append initial message nếu có
    if (initialMessage?.content) {
      const who = initialMessage.sender === 'CUSTOMER' ? 'Khách hàng' : 'Staff';
      appendMsg(sessionId, `${who}: ${initialMessage.content}`);
    }

    // Subscribe vào topic để nhận tin nhắn
    if (stompRef.current?.connected) {
      console.log(`📡 Staff subscribing to /topic/chat/${sessionId}`);
      const sub = stompRef.current.subscribe(`/topic/chat/${sessionId}`, (frame) => {
        try {
          console.log(`📨 Received message in session ${sessionId}:`, frame.body);
          const m = JSON.parse(frame.body);
          console.log('📨 Parsed message:', m);
          const who = m.sender === 'CUSTOMER' ? 'Khách hàng' : 'Staff';
          appendMsg(sessionId, `${who}: ${m.content}`);
        } catch (e) {
          console.error('❌ Error parsing message:', e);
        }
      });

      roomsRef.current[sessionId] = { sub, inputEl, msgContainer };
      console.log(`✅ Staff subscribed to /topic/chat/${sessionId}`);
    }

    // Handle send button
    sendBtn.onclick = () => {
      const content = inputEl.value.trim();
      if (!content || !stompRef.current?.connected) return;

      stompRef.current.send(
        '/app/chat.send',
        {},
        JSON.stringify({
          sessionId,
          sender: 'STAFF',
          content,
          timestamp: Date.now()
        })
      );
      inputEl.value = '';
    };

    // Handle Enter key
    inputEl.onkeypress = (e) => {
      if (e.key === 'Enter') sendBtn.click();
    };

    setRooms((prev) => ({
      ...prev,
      [sessionId]: { msgContainer, inputEl, sendBtn }
    }));
  };

  const closeRoom = (sessionId) => {
    const entry = roomsRef.current[sessionId];
    if (!entry) return;

    if (entry.sub) entry.sub.unsubscribe();
    delete roomsRef.current[sessionId];

    setRooms((prev) => {
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });
  };

  const appendMsg = (sessionId, txt) => {
    const msgsEl = document.getElementById(`msgs-${sessionId}`);
    if (!msgsEl) return;

    const d = document.createElement('div');
    d.textContent = txt;
    d.className = 'chat-message';
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  };

  return (
    <div className="chat">
      <h2>💬 Chat với Khách Hàng</h2>

      {Object.keys(rooms).length === 0 ? (
        <div className="chat-empty">
          <p>Chờ khách hàng bắt đầu cuộc trò chuyện...</p>
        </div>
      ) : (
        <div className="chat-rooms">
          {Object.entries(rooms).map(([sessionId, { msgContainer, inputEl, sendBtn }]) => (
            <div key={sessionId} className="chat-room">
              <div className="chat-header">
                <strong>Session:</strong> {sessionId.substring(0, 8)}...
                <button
                  className="chat-close-btn"
                  onClick={() => {
                    if (stompRef.current?.connected) {
                      stompRef.current.send(
                        '/app/chat.close',
                        {},
                        JSON.stringify({ sessionId })
                      );
                    }
                    closeRoom(sessionId);
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                ref={(el) => {
                  if (el && !el.id) {
                    el.id = `msgs-${sessionId}`;
                    el.className = 'chat-messages';
                  }
                }}
              />

              <div className="chat-input-group">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="chat-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const content = e.target.value.trim();
                      if (content && stompRef.current?.connected) {
                        stompRef.current.send(
                          '/app/chat.send',
                          {},
                          JSON.stringify({
                            sessionId,
                            sender: 'STAFF',
                            content,
                            timestamp: Date.now()
                          })
                        );
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    const content = input.value.trim();
                    if (content && stompRef.current?.connected) {
                      stompRef.current.send(
                        '/app/chat.send',
                        {},
                        JSON.stringify({
                          sessionId,
                          sender: 'STAFF',
                          content,
                          timestamp: Date.now()
                        })
                      );
                      input.value = '';
                    }
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chat;

