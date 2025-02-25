'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeOutput({ code, componentType, isLoading, error }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        console.log('Code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-400">
          {componentType.toUpperCase()} Output
        </h2>
        
        {code && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-100 bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Copy to Clipboard
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-10 rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        <div className="bg-gray-900 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="jsx"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              height: '350px',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
            showLineNumbers={true}
            wrapLongLines={false}
          >
            {code || (componentType === 'jsx' ? 
              '// JSX component will appear here after conversion' : 
              '// TSX component will appear here after conversion')}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}