'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { History, ChevronRight, RefreshCw } from 'lucide-react';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  statusCode: number;
  createdAt: string;
}

interface SidebarProps {
  onSelect: (item: any) => void; // Parent function to load history into form
  refreshTrigger: number; // Prop to trigger refresh when new request is sent
}

export default function HistorySidebar({ onSelect, refreshTrigger }: SidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to fetch history from our backend API
  const fetchHistory = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/history?page=${pageNum}&limit=10`);
      
      const newItems = res.data.data;
      
      if (reset) {
        setHistory(newItems);
      } else {
        setHistory(prev => [...prev, newItems]);
      }

      // If we got fewer items than limit, no more pages left
      if (newItems.length < 10) setHasMore(false);
      
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when a new request is sent
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchHistory(1, true);
  }, [refreshTrigger]);

  // Handle Load More
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage);
  };

  // Helper to color code methods
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-600 bg-blue-100';
      case 'POST': return 'text-green-600 bg-green-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'PUT': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-screen">
      <div className="p-4 border-b bg-white shadow-sm flex items-center justify-between">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <History size={18} /> History
        </h2>
        <button 
          onClick={() => fetchHistory(1, true)} 
          className="p-1 hover:bg-gray-200 rounded-full transition"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)} // Clicking loads this request
            className="p-3 border-b hover:bg-white cursor-pointer transition flex flex-col gap-1 group"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${getMethodColor(item.method)}`}>
                {item.method}
              </span>
              <span className={`text-xs ${item.statusCode >= 400 ? 'text-red-500' : 'text-green-600'}`}>
                {item.statusCode}
              </span>
            </div>
            <div className="text-sm text-gray-600 truncate w-full" title={item.url}>
              {item.url}
            </div>
            <div className="flex justify-between items-center mt-1">
               <span className="text-[10px] text-gray-400">
                {new Date(item.createdAt).toLocaleTimeString()}
               </span>
               <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400" />
            </div>
          </div>
        ))}

        {hasMore && (
          <button 
            onClick={loadMore}
            disabled={loading}
            className="w-full p-3 text-sm text-blue-600 hover:bg-blue-50 font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
}