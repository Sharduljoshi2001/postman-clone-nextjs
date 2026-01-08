'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Send, Play } from 'lucide-react';
import HistorySidebar from '../src/components/HistorySidebar';
import ResponseDisplay from '../src/components/ResponseDisplay';

export default function Home() { 
  // --- STATE MANAGEMENT ---
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  
  // Response States
  const [response, setResponse] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger to refresh history sidebar
  const [refreshHistory, setRefreshHistory] = useState(0);

  // --- HANDLERS ---

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setMeta(null);

    try {
      // Parsing JSON inputs safely
      let parsedBody = null;
      let parsedHeaders = null;

      if (method !== 'GET' && body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          throw new Error("Invalid JSON in Body");
        }
      }

      if (headers) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          throw new Error("Invalid JSON in Headers");
        }
      }

      // Calling our own Backend API
      const res = await axios.post('/api/request', {
        url,
        method,
        body: parsedBody,
        headers: parsedHeaders
      });

      const result = res.data.data;
      
      setResponse(result.response);
      setMeta(result.meta);
      
      // Trigger history refresh
      setRefreshHistory(prev => prev + 1);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Load request from history sidebar
  const handleHistorySelect = (item: any) => {
    setUrl(item.url);
    setMethod(item.method);
    // If body/headers exist in history, stringify them for the text area
    if (item.body) setBody(JSON.stringify(item.body, null, 2));
    if (item.headers) setHeaders(JSON.stringify(item.headers, null, 2));
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-800 font-sans">
      
      {/* 1. Left Sidebar: History */}
      <HistorySidebar onSelect={handleHistorySelect} refreshTrigger={refreshHistory} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header / Navbar */}
        <header className="border-b bg-white p-4 shadow-sm z-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
             <Send className="text-blue-600" /> Postman Clone <span className="text-xs text-gray-400 font-normal border px-2 py-0.5 rounded-full">v1.0</span>
          </h1>
        </header>

        {/* Request Input Area */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden border border-gray-300 bg-white">
            {/* Method Dropdown */}
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="px-4 py-3 bg-gray-100 font-bold text-gray-700 border-r outline-none hover:bg-gray-200 cursor-pointer"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            {/* URL Input */}
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL here..." 
              className="flex-1 px-4 outline-none text-gray-700"
            />

            {/* Send Button */}
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : <><Play size={16} fill="white" /> Send</>}
            </button>
          </div>
        </div>

        {/* Body & Response Split View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Input Config (Body/Headers) */}
          <div className="w-1/3 border-r bg-white flex flex-col p-4 gap-4 overflow-y-auto">
            
            {/* Headers Input */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Headers (JSON)</label>
              <textarea 
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="w-full h-32 border rounded-md p-3 text-xs font-mono bg-gray-50 outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Body Input (Only for non-GET) */}
            <div className={`flex-1 flex flex-col ${method === 'GET' ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Request Body (JSON)</label>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full flex-1 border rounded-md p-3 text-xs font-mono bg-gray-50 outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Right: Response View */}
          <div className="flex-1 p-4 bg-gray-50">
             <div className="h-full">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Response</label>
                <ResponseDisplay 
                  data={response} 
                  meta={meta} 
                  loading={loading} 
                  error={error} 
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}