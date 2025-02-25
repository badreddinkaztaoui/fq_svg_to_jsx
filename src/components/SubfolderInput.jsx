'use client'

import { useState } from 'react';

export default function SubfolderInput({ onSubfolderChange }) {
  const [subfolders, setSubfolders] = useState([{ name: 'common', prefix: '' }]);
  
  // Add a new subfolder
  const addSubfolder = () => {
    setSubfolders([...subfolders, { name: '', prefix: '' }]);
  };
  
  // Update a subfolder
  const updateSubfolder = (index, field, value) => {
    const updated = [...subfolders];
    updated[index][field] = value;
    setSubfolders(updated);
    
    // Notify parent component
    if (onSubfolderChange) {
      onSubfolderChange(updated);
    }
  };
  
  // Remove a subfolder
  const removeSubfolder = (index) => {
    if (subfolders.length > 1) {
      const updated = [...subfolders];
      updated.splice(index, 1);
      setSubfolders(updated);
      
      // Notify parent component
      if (onSubfolderChange) {
        onSubfolderChange(updated);
      }
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-400">Subfolders Configuration</h2>
        <button
          onClick={addSubfolder}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-100 bg-indigo-800 hover:bg-indigo-700"
        >
          Add Subfolder
        </button>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {subfolders.map((folder, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-900 p-2 rounded-md">
            <div className="col-span-5">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Subfolder Name:
              </label>
              <input
                type="text"
                value={folder.name}
                onChange={(e) => updateSubfolder(index, 'name', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md p-1.5 w-full text-gray-100 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ui"
              />
            </div>
            
            <div className="col-span-5">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Prefix/Category:
              </label>
              <input
                type="text"
                value={folder.prefix}
                onChange={(e) => updateSubfolder(index, 'prefix', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md p-1.5 w-full text-gray-100 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="UI"
              />
            </div>
            
            <div className="col-span-2 flex justify-end items-end h-full">
              <button
                onClick={() => removeSubfolder(index)}
                disabled={subfolders.length === 1}
                className="text-gray-400 hover:text-red-400 disabled:text-gray-600 disabled:hover:text-gray-600 mt-5"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-900 p-3 rounded-md">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Preview Structure:</h3>
        <div className="text-gray-400 font-mono text-xs">
          <div>/your-project</div>
          <div>&nbsp;&nbsp;/{subfolders[0].name}</div>
          {subfolders.length > 1 && (
            <>
              {subfolders.slice(1).map((folder, index) => (
                <div key={index}>&nbsp;&nbsp;/{folder.name}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}