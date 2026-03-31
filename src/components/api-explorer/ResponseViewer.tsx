import React from 'react';
import { Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface ResponseViewerProps {
  data: any;
  status: number;
  time: number;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ data, status, time }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/50">
        <div className="flex items-center space-x-3">
          <span className={clsx(
            "text-xs font-bold px-2 py-0.5 rounded",
            status >= 200 && status < 300 ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
          )}>
            {status} OK
          </span>
          <span className="text-xs text-gray-400">{time}ms</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy Response"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-sm font-mono text-gray-300 leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
