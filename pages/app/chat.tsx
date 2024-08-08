'use client';
import Image from 'next/image';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function Home() {
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const getResponse = async () => {
    setLoading(true);
    setError('');
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
      if (!data.text) {
        setError('Inget svar mottogs från servern.');
        return;
      }

      setResponse(data.text);
    } catch (error: unknown) {
      console.error('Error fetching response:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="absolute top-16 left-0 bg-white text-black border-r-2 border-b-2 border-green-500 w-[200px]">
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
        <div className="absolute top-20 right-10 mt-[-28px] bg-white border-2 border-green-300 shadow-lg p-3 rounded-tl-lg rounded-tr-3xl rounded-bl-lg rounded-br-none w-36 h-30">
          <p>Detta är en AI-baserad föräldrarådgivare</p>
        </div>
      )}
      <textarea
        className="w-11/12 mx-auto p-2 border-2 border-green-500 rounded-lg focus:border-green-600 focus:ring focus:ring-green-500 focus:ring-opacity-50"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Skriv här"
      />

      <button
        className="mt-2 bg-green-500 text-white p-2 py-2 rounded disabled:opacity-50"
        onClick={getResponse}
        disabled={loading}
      >
        {loading ? (
          <div className="loading-dots flex items-center">
            <img
              src="/images/kim4.png"
              alt="Avatar 2"
              className="w-6 h-6 mr-2"
            />
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          'Skicka fråga'
        )}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4">{response}</p>
    </div>
  );
}
