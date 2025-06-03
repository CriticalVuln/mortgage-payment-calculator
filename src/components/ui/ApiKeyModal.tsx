import React, { useState, useEffect } from 'react';
import { XCircle, Key, CheckCircle, AlertCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from './Button';
import { getApiKey, saveApiKey, hasApiKey, clearApiKey } from '../../services/apiConfig';
import { validateApiKey, sanitizeString } from '../../utils/validation';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Get existing API key if available
      const existingKey = getApiKey('ninjas') || '';
      setApiKey(existingKey);
      setIsSaved(hasApiKey('ninjas'));
      setError(''); // Clear any previous errors
    }
  }, [isOpen]);
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeString(e.target.value);
    setApiKey(value);
    setIsSaved(false);
    
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  // Handle clearing the API key
  const handleClearKey = () => {
    clearApiKey('ninjas');
    setApiKey('');
    setIsSaved(false);
    setError('');
    
    // Show notification that the key was cleared
    setError('API key removed successfully!');
    setTimeout(() => {
      setError('');
    }, 2000);
  };
  
  const handleSave = () => {
    // Validate API key format
    if (!apiKey.trim()) {
      setError('API key cannot be empty');
      return;
    }
    
    if (!validateApiKey(apiKey)) {
      setError('Invalid API key format. Keys should be alphanumeric and at least 10 characters.');
      return;
    }
    
    // Save the API key if valid
    saveApiKey('ninjas', apiKey);
    setIsSaved(true);
    setError('');
    
    // Show success message for 1.5 seconds before closing
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-slideDown">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-neutral-800">API Key Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-neutral-600 mb-4">
            Enter your API Ninjas API key to fetch real property tax data. 
            You can get a free API key by signing up at{' '}
            <a 
              href="https://api-ninjas.com/api/propertytax" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary-600 hover:text-primary-800 underline"
            >
              api-ninjas.com
            </a>.
          </p>
            <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              API Ninjas API Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter your API key"
                className={`w-full px-3 py-2 pr-10 rounded-md border ${error ? 'border-error-300' : 'border-neutral-300'} focus:outline-none focus:ring-2 ${error ? 'focus:ring-error-500' : 'focus:ring-primary-500'} focus:border-transparent transition-all`}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {isSaved && (
              <div className="flex items-center text-emerald-600 text-sm mt-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>API key saved successfully!</span>
              </div>
            )}
            {error && (
              <div className="flex items-center text-red-600 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
          <div className="flex justify-between items-center">
          {hasApiKey('ninjas') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearKey}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove API Key
            </Button>
          )}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
            >
              Save API Key
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
