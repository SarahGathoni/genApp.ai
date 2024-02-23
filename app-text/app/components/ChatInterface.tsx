'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const sendMessage = async () => {
    try {
      const response = await fetch('/generate-content', {
        method: 'POST',
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
    <div>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your prompt..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
