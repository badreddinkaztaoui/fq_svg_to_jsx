'use client'

export default function SettingsPanel({ 
  fileName, 
  setFileName, 
  componentType, 
  setComponentType, 
  options = {},
  onOptionChange = () => {}, 
  onDownload 
}) {
  // Handle checkbox changes
  const handleCheckboxChange = (option) => (e) => {
    onOptionChange(option, e.target.checked);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">Settings</h2>
      
      <div className="space-y-4">
        {/* Component Name */}
        <div>
          <label htmlFor="component-name" className="block text-sm font-medium text-gray-400 mb-1">
            Component Name:
          </label>
          <input
            type="text"
            id="component-name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Output Folder Path */}
        <div>
          <label htmlFor="output-path" className="block text-sm font-medium text-gray-400 mb-1">
            Output Path:
          </label>
          <div className="flex">
            <input
              type="text"
              id="output-path"
              defaultValue="components/icons"
              className="bg-gray-700 border border-gray-600 rounded-l-md p-2 w-full text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button 
              className="bg-gray-600 text-gray-200 px-3 rounded-r-md hover:bg-gray-500"
              title="Default path will be used for output"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Component Type Selection */}
        <div>
          <p className="block text-sm font-medium text-gray-400 mb-1">Component Type:</p>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-500"
                name="component-type"
                value="jsx"
                checked={componentType === 'jsx'}
                onChange={() => setComponentType('jsx')}
              />
              <span className="ml-2 text-gray-300">JSX</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-500"
                name="component-type"
                value="tsx"
                checked={componentType === 'tsx'}
                onChange={() => setComponentType('tsx')}
              />
              <span className="ml-2 text-gray-300">TSX</span>
            </label>
          </div>
        </div>
        
        {/* Additional Component Options */}
        <div>
          <p className="block text-sm font-medium text-gray-400 mb-2">Component Options:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-500 rounded"
                checked={!options.namedExport}
                onChange={handleCheckboxChange('namedExport')}
              />
              <span className="ml-2 text-gray-300 text-sm">Default export</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-500 rounded"
                checked={options.reactImport}
                onChange={handleCheckboxChange('reactImport')}
              />
              <span className="ml-2 text-gray-300 text-sm">React import</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-500 rounded"
                checked={options.namedExport}
                onChange={handleCheckboxChange('namedExport')}
              />
              <span className="ml-2 text-gray-300 text-sm">Named export</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-500 rounded"
                checked={options.memo}
                onChange={handleCheckboxChange('memo')}
              />
              <span className="ml-2 text-gray-300 text-sm">Memo component</span>
            </label>
          </div>
        </div>
        
        {/* Download Button */}
        <button
          onClick={onDownload}
          className="mt-2 w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download {componentType.toUpperCase()} Component
        </button>
      </div>
    </div>
  );
}