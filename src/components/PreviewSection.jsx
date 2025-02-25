'use client'

import { useState, useEffect } from 'react';
import parse from 'html-react-parser';

export default function PreviewSection({ svgInput, componentCode }) {
  const [previewSize, setPreviewSize] = useState(50);
  const [previewBackground, setPreviewBackground] = useState('dark');
  const [svgPreview, setSvgPreview] = useState(null);
  const [componentPreview, setComponentPreview] = useState(null);
  const [error, setError] = useState(null);
  
  const getBackgroundColor = () => {
    switch (previewBackground) {
      case 'dark': return 'bg-gray-700';
      case 'light': return 'bg-gray-300';
      case 'white': return 'bg-white';
      default: return 'bg-gray-700';
    }
  };
  
  const getTextColor = () => {
    return previewBackground === 'dark' ? 'text-gray-300' : 'text-gray-800';
  };

  useEffect(() => {
    if (!svgInput) {
      setSvgPreview(null);
      setError(null);
      return;
    }
    
    try {
      const cleanedSvg = svgInput.trim();
      if (cleanedSvg.startsWith('<svg')) {
        setSvgPreview(parse(cleanedSvg));
        setError(null);
      } else {
        setError('Invalid SVG: Must start with <svg> tag');
        setSvgPreview(null);
      }
    } catch (err) {
      console.error('Error parsing SVG:', err);
      setError(`Error parsing SVG: ${err.message}`);
      setSvgPreview(null);
    }
  }, [svgInput]);
  
  useEffect(() => {
    // For now, just use the same SVG preview for both sides
    // In a real implementation, this would render the actual component
    // based on the generated JSX/TSX code
    setComponentPreview(svgPreview);
  }, [svgPreview]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">Preview</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-gray-900 rounded-lg p-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Original SVG</h3>
          <div className={`${getBackgroundColor()} rounded-md h-40 flex items-center justify-center p-4 overflow-hidden`}>
            {svgPreview ? (
              <div className={getTextColor()} style={{ height: `${previewSize}px`, width: `${previewSize}px` }}>
                {svgPreview}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No SVG input yet</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">React Component</h3>
          <div className={`${getBackgroundColor()} rounded-md h-40 flex items-center justify-center p-4 overflow-hidden`}>
            {componentPreview ? (
              <div className={getTextColor()} style={{ height: `${previewSize}px`, width: `${previewSize}px` }}>
                {componentPreview}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No component preview available</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Background:</label>
          <div className="flex space-x-2">
            <button 
              className={`w-6 h-6 bg-gray-700 rounded-md border ${previewBackground === 'dark' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-600'}`}
              onClick={() => setPreviewBackground('dark')}
              aria-label="Dark background"
            />
            <button 
              className={`w-6 h-6 bg-gray-300 rounded-md border ${previewBackground === 'light' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-400'}`}
              onClick={() => setPreviewBackground('light')}
              aria-label="Light background"
            />
            <button 
              className={`w-6 h-6 bg-white rounded-md border ${previewBackground === 'white' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-400'}`}
              onClick={() => setPreviewBackground('white')}
              aria-label="White background"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Size: {previewSize}px</label>
          <input 
            type="range" 
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            min="24"
            max="100"
            value={previewSize}
            onChange={(e) => setPreviewSize(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}