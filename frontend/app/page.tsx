'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin ? { email, password } : { email, password, name };
      
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      
      // Clear form
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      alert('Error: ' + (error as any).response?.data?.error || 'Something went wrong');
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/content/generate`,
        { prompt, type: 'article' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setContent(response.data.content.content);
    } catch (error) {
      alert('Error generating content. Make sure your OpenAI API key is set.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setContent('');
    setPrompt('');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            {isLogin ? 'Login' : 'Register'}
          </h1>
          
          <form onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 mb-4 border rounded text-gray-900 bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded text-gray-900 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded text-gray-900 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          
          <p className="mt-4 text-center text-gray-700">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Content Generator</h1>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Generate Content</h2>
          
          <textarea
            placeholder="Enter your prompt... (e.g., Write a blog post about AI in healthcare)"
            className="w-full p-3 border rounded mb-4 text-gray-900 bg-white min-h-[120px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={generateContent}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {content && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Generated Content</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-800 font-sans">{content}</pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(content)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}