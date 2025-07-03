import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { ValidationResult } from '../utils/dagValidation';

interface ValidationBannerProps {
  validation: ValidationResult;
  nodeCount: number;
  edgeCount: number;
  onDismiss?: () => void;
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({
  validation,
  nodeCount,
  edgeCount,
  onDismiss,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const hasIssues = validation.errors.length > 0 || validation.warnings.length > 0;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
      <div
        className={`rounded-lg shadow-lg border-2 transition-all duration-300 ${
          validation.isValid
            ? hasIssues
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        {/* Main Banner */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {validation.isValid ? (
              hasIssues ? (
                <Info className="w-5 h-5 text-yellow-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    validation.isValid
                      ? hasIssues
                        ? 'text-yellow-800'
                        : 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {validation.isValid
                    ? hasIssues
                      ? 'Graph Valid (with warnings)'
                      : 'Graph Valid'
                    : 'Graph Invalid'}
                </span>
                <span
                  className={`text-sm ${
                    validation.isValid
                      ? hasIssues
                        ? 'text-yellow-600'
                        : 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  • {nodeCount} nodes, {edgeCount} edges
                </span>
              </div>
              
              {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div
                  className={`text-sm mt-1 ${
                    validation.isValid ? 'text-yellow-700' : 'text-red-700'
                  }`}
                >
                  {validation.errors.length > 0 && (
                    <span>{validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''}</span>
                  )}
                  {validation.errors.length > 0 && validation.warnings.length > 0 && <span>, </span>}
                  {validation.warnings.length > 0 && (
                    <span>{validation.warnings.length} warning{validation.warnings.length !== 1 ? 's' : ''}</span>
                  )}
                  <span className="ml-2 opacity-75">Click for details</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasIssues && (
              <div
                className={`transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                validation.isValid
                  ? hasIssues
                    ? 'hover:bg-yellow-600 text-yellow-600'
                    : 'hover:bg-green-600 text-green-600'
                  : 'hover:bg-red-600 text-red-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && hasIssues && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            {validation.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Errors ({validation.errors.length})
                </h4>
                <ul className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700 pl-6 relative">
                      <span className="absolute left-2 top-1">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Warnings ({validation.warnings.length})
                </h4>
                <ul className="space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700 pl-6 relative">
                      <span className="absolute left-2 top-1">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                💡 Tip: A valid DAG should have no cycles and all nodes should be connected to the workflow.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};