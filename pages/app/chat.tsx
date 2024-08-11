'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

interface Message {
  text: string;
  from: 'user' | 'ai';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const getResponse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: prompt, from: 'user' },
    ]);
    try {
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Error fetching response');
      }

      const data = await res.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, from: 'ai' },
      ]);
      setPrompt('');
    } catch (error: any) {
      console.error('Error fetching response:', error);
      setError('Ett fel inträffade när svaret skulle hämtas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    const lastMessageElement = document.querySelector('.message:last-child');
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
        <button onClick={toggleMenu} className="text-3xl">
          {menuOpen ? <IoMdClose /> : <FaBars />}
        </button>
        <Image
          className="mt-2"
          src="/images/Kimlogo.png"
          alt="K1M avatar1"
          width={120}
          height={120}
        />
        <button onClick={toggleInfo}>
          <Image
            src="/images/circle-info-solid.svg"
            alt="Info"
            width={44}
            height={44}
          />
        </button>
      </header>
      {menuOpen && (
        <div className="menu absolute top-16 left-0 bg-white text-black border-r-2 border-b-2 border-green-500 w-[200px]">
          <ul className="list-none p-4">
            <li className="p-2 hover:bg-green-300 border-b border-gray-200 last:border-b-0">
              Fråga K1M
            </li>
            <li className="p-2 hover:bg-green-300 border-b border-gray-200 last:border-b-0">
              Tipsbanken
            </li>
            <li className="p-2 hover:bg-green-300 border-b border-gray-200 last:border-b-0">
              Hjälp / Stöd
            </li>
          </ul>
        </div>
      )}
      {showInfo && (
        <div className="info absolute top-20 right-10 mt-[-28px] bg-white border-2 border-green-300 shadow-lg p-3 rounded-tl-lg rounded-tr-3xl rounded-bl-lg rounded-br-none w-36 h-30">
          <p>Detta är en AI-baserad föräldrarådgivare</p>
        </div>
      )}
      <div className="chat-container w-full p-4 max-h-[70vh] overflow-y-auto">
        <div
          ref={chatContainerRef}
          className="chat-container w-full p-4 max-h-[70vh] overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from === 'ai' ? 'ai-message' : 'user-message'}`}
            >
              {msg.from === 'ai' && (
                <Image
                  src="/images/kim4.png"
                  alt="AI Avatar"
                  width={40}
                  height={40}
                  className="ai-avatar"
                />
              )}
              <div
                className="message-text"
                style={{ paddingLeft: msg.from === 'ai' ? '20px' : '10px' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="loading-dots flex items-center justify-center mb-2">
          <Image
            src="/images/kim4.png"
            alt="Loading"
            className="w-6 h-6 mr-2"
          />
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <form onSubmit={getResponse} className="w-full px-4">
        <textarea
          ref={textareaRef}
          className="w-full p-2 border-2 border-green-500 rounded-lg focus:border-green-600 focus:ring focus:ring-green-500 focus:ring-opacity-50"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Skriv här"
          style={{ overflowY: 'hidden', minHeight: '50px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              getResponse(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        />
        <input type="submit" className="hidden" />
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
