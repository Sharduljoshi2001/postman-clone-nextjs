'use client'; // This component runs in the browser
import dynamic from 'next/dynamic';
import { Clock, Database, FileJson } from 'lucide-react';

//dynamically importing ReactJson to avoid Server-Side Renderin issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface ResponseProps {
  data: any;
  meta: {
    statusCode: number;
    duration: number;
    size: string;
  } | null;
  loading: boolean;
  error?: string | null;
}

export default function ResponseDisplay({ data, meta, loading, error }: ResponseProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!meta && !error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <FileJson size={48} className="mb-2 opacity-50" />
        <p>Send a request to see the response here</p>
      </div>
    );
  }

  // Determine status color (Green for 2xx, Red for 4xx/5xx)
  const statusColor = meta && meta.statusCode >= 200 && meta.statusCode < 300 
    ? 'text-green-500' 
    : 'text-red-500';

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Meta Bar (Status, Time, Size) */}
      {meta && (
        <div className="flex items-center gap-6 px-4 py-2 bg-gray-50 border-b text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className={`font-bold ${statusColor}`}>{meta.statusCode}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} />
            <span>{meta.duration} ms</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Database size={14} />
            <span>{meta.size}</span>
          </div>
        </div>
      )}

      {/* Response Body Area */}
      <div className="flex-1 overflow-auto p-4 bg-white">
        {error ? (
          <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
            Error: {error}
          </div>
        ) : (
          <ReactJson 
            src={data} 
            theme="rjv-default" 
            name={false} 
            displayDataTypes={false} 
            enableClipboard={true}
          />
        )}
      </div>
    </div>
  );
}