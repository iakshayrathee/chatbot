import { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(['User1', 'User2', 'User3']);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSend = async () => {
    if (!input || !selectedUser) return;

    // Add user message to the chat
    const userMessage = { sender: 'User', content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Call the Gemini API
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP__GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        }
      );

      // Log the response to check if it's coming back correctly
      console.log('API Response:', response.data);

      // Access the bot message from the response
      const botMessage = response.data.candidates[0].content.parts[0].text;
      const botResponse = { sender: 'Bot', content: botMessage };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error fetching response from Gemini API:', error);
    }

    setInput('');
  };

  return (
    <div className='flex h-[90vh] w-[100%] bg-white'>
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <div className='flex-1 p-4 w-[80%] bg-gray-50'>
        <div className='flex items-center justify-between border-b pb-2 mb-4'>
          <h1 className='text-xl font-bold text-gray-700'>
            {selectedUser || 'Select a User'}
          </h1>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 ${
                msg.sender === 'User' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg shadow ${
                  msg.sender === 'User'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300'
                }`}
              >
                {msg.content.length > 200
                  ? `${msg.content.substring(0, 200)}...`
                  : msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className='flex mt-4 w-[100%]'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className='input flex-1 border rounded p-2 mb-20'
            placeholder='Type a message...'
          />
          <button
            onClick={handleSend}
            className='send-button bg-blue-500 w-[10%] mb-20 text-white px-4 py-2 rounded ml-2 '
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
