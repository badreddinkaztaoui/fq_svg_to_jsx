'use client'
// components/SvgInput.js
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import prettier from 'prettier/standalone';
import prettierPluginXml from '@prettier/plugin-xml';

export default function SvgInput({ svgInput, onSvgInputChange, onFileUpload }) {
  const [activeTab, setActiveTab] = useState('code');
  const [formattedSvg, setFormattedSvg] = useState('');
  
  const formatSvg = useCallback(async (svgCode) => {
    if (!svgCode) return '';
    
    try {
      const formatted = await prettier.format(svgCode, {
        parser: 'xml',
        plugins: [prettierPluginXml],
        printWidth: 80,
        tabWidth: 2,
        xmlWhitespaceSensitivity: 'ignore',
        xmlSelfClosingSpace: true
      });
      
      return formatted;
    } catch (error) {
      console.error('Error formatting SVG:', error);
      return svgCode;
    }
  }, []);
  
  useEffect(() => {
    const handleFormatting = async () => {
      if (svgInput) {
        const formatted = await formatSvg(svgInput);
        if (formatted !== formattedSvg) {
          setFormattedSvg(formatted);
        }
      } else {
        setFormattedSvg('');
      }
    };
    
    handleFormatting();
  }, [svgInput, formatSvg, formattedSvg]);
  
  const handleEditorChange = async (value) => {
    onSvgInputChange(value);
    
    // We don't format immediately on every keystroke to avoid disrupting typing
    // The useEffect will handle formatting after a delay
  };
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
      setActiveTab('code');
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/svg+xml': ['.svg']},
    multiple: false,
  });

  const handleFormatClick = async () => {
    const formatted = await formatSvg(svgInput);
    onSvgInputChange(formatted);
  };

  const insertBoilerplate = async () => {
    const boilerplate = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Insert your shapes here -->
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
</svg>`;
    
    const formatted = await formatSvg(boilerplate);
    onSvgInputChange(formatted);
  };

  const addSvgElement = async (elementType) => {
    let element = '';
    
    switch(elementType) {
      case 'rect':
        element = `<rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" />`;
        break;
      case 'circle':
        element = `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />`;
        break;
      case 'path':
        element = `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />`;
        break;
      case 'line':
        element = `<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" />`;
        break;
      case 'group':
        element = `<g>
  <!-- Group elements here -->
  <circle cx="12" cy="12" r="5" fill="currentColor" />
</g>`;
        break;
      default:
        element = '';
    }
    
    const svgContent = svgInput;
    const closingTagIndex = svgContent.lastIndexOf('</svg>');
    
    if (closingTagIndex !== -1) {
      const beforeClosingTag = svgContent.substring(0, closingTagIndex);
      const afterClosingTag = svgContent.substring(closingTagIndex);
      const newContent = beforeClosingTag + '\n  ' + element + '\n' + afterClosingTag;
      
      const formatted = await formatSvg(newContent);
      onSvgInputChange(formatted);
    } else {
      const newContent = svgContent + '\n' + element;
      const formatted = await formatSvg(newContent);
      onSvgInputChange(formatted);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">Input SVG</h2>
      
      <div className="border-b border-gray-700 mb-4">
        <div className="flex -mb-px">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'code' 
                ? 'border-b-2 border-indigo-400 text-indigo-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code Editor
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'upload' 
                ? 'border-b-2 border-indigo-400 text-indigo-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload File
          </button>
        </div>
      </div>
      
      {activeTab === 'code' ? (
        <>
          <div className="flex justify-between mb-2">
            <div className="flex space-x-2">
              <button
                onClick={() => addSvgElement('rect')}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                + rect
              </button>
              <button
                onClick={() => addSvgElement('circle')}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                + circle
              </button>
              <button
                onClick={() => addSvgElement('path')}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                + path
              </button>
              <button
                onClick={() => addSvgElement('line')}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                + line
              </button>
              <button
                onClick={() => addSvgElement('group')}
                className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
              >
                + group
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleFormatClick}
                className="text-sm text-gray-300 hover:text-gray-100 bg-gray-700 px-2 py-1 rounded"
              >
                Format
              </button>
              <button
                onClick={insertBoilerplate}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Insert Boilerplate
              </button>
            </div>
          </div>
          
          <div className="border border-gray-600 rounded-md overflow-hidden">
            <CodeMirror
              value={svgInput}
              height="320px"
              onChange={handleEditorChange}
              extensions={[xml()]}
              theme={tokyoNight}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightSelectionMatches: true,
                lint: true
              }}
              placeholder="<svg>...</svg>"
            />
          </div>
        </>
      ) : (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer h-80 flex flex-col items-center justify-center
              ${isDragActive ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-600 hover:border-indigo-400'}`}
          >
            <input {...getInputProps()} />
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
              />
            </svg>
            {isDragActive ? (
              <p className="text-indigo-300">Drop the SVG file here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-400">Drag & drop an SVG file here, or click to select one</p>
                <p className="text-gray-500 text-sm">Supported format: .svg</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}