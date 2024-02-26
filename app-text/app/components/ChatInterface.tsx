'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/generate-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: inputValue })
      });
      if (!response.ok) {
        throw new Error('Error generating content');
      }
      const data = await response.json();
      // Update messages state with the generated content
      setMessages([...messages, { sender: 'bot', text: data }]);
      // Clear input field after sending the message
      setInputValue('');
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call sendMessage function when form is submitted
    sendMessage();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="chat-interface bg-white p-4 h-full w-full flex flex-col justify-between overflow-hidden pt-5">
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form flex items-center">
      <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your prompt..."
          className='flex flex-grow min-w-0 h-auto resize-none bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
          focus:border-blue-500 block p-2.5 mr-2  resize-vertical min-height-100 max-height-200'
        />
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Send</button>
      </form>

    </div>
  );
};

export default ChatInterface;
