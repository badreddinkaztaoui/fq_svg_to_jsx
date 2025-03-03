'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SvgInput from '@/components/SvgInput';
import SettingsPanel from '@/components/SettingsPanel';
import CodeOutput from '@/components/CodeOutput';
import PreviewSection from '@/components/PreviewSection';
import MultipleSvgHandler from '@/components/MultipleSvgHandler';
import SubfolderInput from '@/components/SubfolderInput';
// import { convertSvgToComponent, createPreviewHtml } from '../services/converter';
import { convertSvgToComponent } from  "../services/converter"

export default function SvgConverter() {
  const [svgInput, setSvgInput] = useState('');
  const [fileName, setFileName] = useState('IconComponent');
  const [componentType, setComponentType] = useState('jsx');
  const [outputCode, setOutputCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [batchFiles, setBatchFiles] = useState([]);
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [subfolders, setSubfolders] = useState([{ name: 'common', prefix: '' }]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  
  const [conversionOptions, setConversionOptions] = useState({
    memo: false,
    namedExport: false,
    defaultExport: true,
    reactImport: true,
  });
  
  useEffect(() => {
    const convertSvg = async () => {
      if (!svgInput) {
        setOutputCode('');
        setPreviewHtml('');
        setError(null);
        return;
      }
      
      setIsConverting(true);
      setError(null);
      
      try {
        // First create a quick preview HTML
        // const preview = createPreviewHtml(svgInput);
        // setPreviewHtml(preview);
        
        // Then do the full conversion to JSX/TSX
        const options = {
          componentName: fileName,
          typescript: componentType === 'tsx',
          ...conversionOptions
        };
        
        const code = convertSvgToComponent(svgInput, options);
        setOutputCode(code);
        console.log({code})
      } catch (err) {
        console.error('Conversion error:', err);
        setError(err.message || 'Error converting SVG');
      } finally {
        setIsConverting(false);
      }
    };
    
    const timerId = setTimeout(convertSvg, 300);
    return () => clearTimeout(timerId);
  }, [svgInput, fileName, componentType, conversionOptions]);
  
  const handleSvgInputChange = (svg) => {
    setSvgInput(svg);
  };
  
  const handleFileUpload = (file) => {
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const componentName = `${fileName[0].toUpperCase()}${fileName.slice(1)}Icon`

    setFileName(componentName);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const svg = e.target.result;
      handleSvgInputChange(svg);
    };
    reader.readAsText(file);
  };
  
  // Handle batch file selection
  const handleBatchFileSelect = (files) => {
    setBatchFiles(prevFiles => {
      const mergedFiles = [...prevFiles];
      
      files.forEach(file => {
        if (!mergedFiles.some(f => f.name === file.name)) {
          mergedFiles.push(file);
        }
      });
      
      return mergedFiles;
    });
  };
  
  // Handle subfolder configuration changes
  const handleSubfolderChange = (updatedSubfolders) => {
    setSubfolders(updatedSubfolders);
  };
  
  const toggleBatchMode = () => {
    setShowBatchMode(!showBatchMode);
  };
  
  const handleOptionChange = (option, value) => {
    setConversionOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Handle download functionality
  const handleDownload = () => {
    console.log('Download functionality will be implemented later');
    // For now, just simulate a download by copying to clipboard
    navigator.clipboard.writeText(outputCode)
      .then(() => {
        alert('Code copied to clipboard (download functionality coming soon)');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        {/* Mode Toggle */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={toggleBatchMode}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showBatchMode ? 'Switch to Single Mode' : 'Switch to Batch Mode'}
          </button>
        </div>
        
        {!showBatchMode ? (
          /* Single SVG Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Input and Settings */}
            <div className="space-y-6">
              <SvgInput 
                svgInput={svgInput}
                onSvgInputChange={handleSvgInputChange}
                onFileUpload={handleFileUpload}
              />
              
              <SettingsPanel
                fileName={fileName}
                setFileName={setFileName}
                componentType={componentType}
                setComponentType={setComponentType}
                options={conversionOptions}
                onOptionChange={handleOptionChange}
                onDownload={handleDownload}
              />
            </div>
            
            {/* Right Column: Output and Preview */}
            <div className="space-y-6">
              <CodeOutput
                code={outputCode}
                componentType={componentType}
                isLoading={isConverting}
                error={error}
              />
              
              <PreviewSection
                svgInput={svgInput}
                componentCode={outputCode}
              />
            </div>
          </div>
        ) : (
          /* Batch Mode */
          <div>
            <MultipleSvgHandler onFileSelect={handleBatchFileSelect} />
            
            {/* Display subfolder input if in categorized mode */}
            <SubfolderInput onSubfolderChange={handleSubfolderChange} />
            
            {/* Batch Conversion Summary */}
            {batchFiles.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg mt-6">
                <h2 className="text-xl font-semibold text-indigo-400 mb-4">Conversion Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                  <div className="bg-gray-900 p-3 rounded-md flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-400">{batchFiles.length}</span>
                    <span className="text-sm mt-1">Files to Convert</span>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-md flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-400">{subfolders.length}</span>
                    <span className="text-sm mt-1">Subfolders</span>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-md flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-400">{componentType.toUpperCase()}</span>
                    <span className="text-sm mt-1">Output Format</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    className="w-full bg-indigo-600 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Conversion & Download ZIP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}