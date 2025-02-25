'use client'

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function MultipleSvgHandler({ onFileSelect }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [outputFolder, setOutputFolder] = useState('icons');
  const [folderStructure, setFolderStructure] = useState('flat');
  
  // Handle file drop
  const onDrop = (acceptedFiles) => {
    // Filter only SVG files
    const svgFiles = acceptedFiles.filter(file => 
      file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
    );
    
    if (svgFiles.length > 0) {
      // Add new files to the existing list
      setUploadedFiles(prev => {
        // Create a new array with existing files
        const updatedFiles = [...prev];
        
        // Add new files if they don't already exist
        svgFiles.forEach(file => {
          if (!updatedFiles.some(existing => existing.name === file.name)) {
            updatedFiles.push(file);
          }
        });
        
        return updatedFiles;
      });
      
      // Notify parent component
      onFileSelect(svgFiles);
    }
  };
  
  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/svg+xml': ['.svg']},
    multiple: true
  });
  
  // Remove a file from the list
  const removeFile = (index) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  
  // Clear all files
  const clearFiles = () => {
    setUploadedFiles([]);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">Batch SVG Conversion</h2>
      
      {/* File Drop Area */}
      <div className="mb-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${isDragActive ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-600 hover:border-indigo-400'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-indigo-300">Drop the SVG files here...</p>
          ) : (
            <p className="text-gray-400">Drag & drop multiple SVG files here, or click to select files</p>
          )}
        </div>
      </div>
      
      {/* Output Folder Configuration */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Output Folder Name:
          </label>
          <input
            type="text"
            value={outputFolder}
            onChange={(e) => setOutputFolder(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="icons"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Folder Structure:
          </label>
          <select
            value={folderStructure}
            onChange={(e) => setFolderStructure(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="flat">Flat (all files in one folder)</option>
            <option value="categorized">Categorized (files in subfolders)</option>
            <option value="maintain">Maintain original structure</option>
          </select>
        </div>
      </div>
      
      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-300">Uploaded Files ({uploadedFiles.length})</h3>
            <button 
              onClick={clearFiles}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear All
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-md p-2 max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-800">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="py-2 px-1 flex justify-between items-center">
                  <span className="text-gray-300 truncate" style={{ maxWidth: '80%' }}>
                    {file.name}
                  </span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Batch Actions */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Convert All ({uploadedFiles.length})
          </button>
          <button
            className="bg-indigo-800 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download as ZIP
          </button>
        </div>
      )}
    </div>
  );
}