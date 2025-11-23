import React from 'react';
import { Lightbulb, X } from 'lucide-react';

const SmartSuggestions = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg z-10">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Lightbulb className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">
              Quick Solutions
            </span>
          </div>
          <button
            onClick={() => onSuggestionClick('close')}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="block w-full text-left p-2 text-sm text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors duration-200"
            >
              💡 {suggestion}
            </button>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-yellow-600">
          Click to add to description
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;