import React from 'react';
import { Copy } from 'lucide-react';

interface OutputCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  colorClass: string;
  delayIndex: number;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, content, icon, colorClass, delayIndex }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-500 ease-out transform translate-y-0 opacity-100`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delayIndex * 0.1}s forwards`,
        opacity: 0, 
        transform: 'translateY(20px)' 
      }}
    >
      <div className={`flex items-center gap-2 mb-3 ${colorClass}`}>
        {icon}
        <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-slate-700 text-lg leading-relaxed">{content}</p>
      
      <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <span className="text-xs font-bold text-green-500">Copied!</span> : <Copy size={16} />}
      </button>
      
      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};