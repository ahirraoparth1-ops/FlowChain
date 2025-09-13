import React from 'react';
import Icon from '../../../components/AppIcon';

const FilePreviewTable = ({ previewData, fileName }) => {
  if (!previewData || previewData?.length === 0) {
    return null;
  }

  const headers = Object.keys(previewData?.[0]);
  const rows = previewData?.slice(0, 5);

  const detectDataType = (value) => {
    if (value === null || value === undefined || value === '') return 'empty';
    if (!isNaN(value) && !isNaN(parseFloat(value))) return 'number';
    if (Date.parse(value)) return 'date';
    return 'text';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'number': return 'Hash';
      case 'date': return 'Calendar';
      case 'text': return 'Type';
      default: return 'Minus';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'number': return 'text-blue-600';
      case 'date': return 'text-green-600';
      case 'text': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="FileText" size={16} />
          <span>{fileName}</span>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {headers?.map((header, index) => {
                  const sampleValue = rows?.find(row => row?.[header] !== null && row?.[header] !== undefined && row?.[header] !== '')?.[header];
                  const dataType = detectDataType(sampleValue);
                  
                  return (
                    <th key={index} className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">{header}</span>
                        <div className={`flex items-center space-x-1 ${getTypeColor(dataType)}`}>
                          <Icon name={getTypeIcon(dataType)} size={12} />
                          <span className="text-xs capitalize">{dataType}</span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows?.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50">
                  {headers?.map((header, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <span className="text-sm text-foreground font-mono">
                        {row?.[header] !== null && row?.[header] !== undefined && row?.[header] !== '' 
                          ? String(row?.[header]) 
                          : <span className="text-muted-foreground italic">empty</span>
                        }
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {rows?.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Row {rowIndex + 1}</span>
            </div>
            <div className="space-y-2">
              {headers?.slice(0, 4)?.map((header, colIndex) => {
                const dataType = detectDataType(row?.[header]);
                return (
                  <div key={colIndex} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{header}</span>
                      <div className={`flex items-center space-x-1 ${getTypeColor(dataType)}`}>
                        <Icon name={getTypeIcon(dataType)} size={10} />
                      </div>
                    </div>
                    <span className="text-sm text-foreground font-mono">
                      {row?.[header] !== null && row?.[header] !== undefined && row?.[header] !== '' 
                        ? String(row?.[header]) 
                        : <span className="text-muted-foreground italic">empty</span>
                      }
                    </span>
                  </div>
                );
              })}
              {headers?.length > 4 && (
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  +{headers?.length - 4} more columns
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Data Summary */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Rows" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">
            Showing 5 of {previewData?.length} rows
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Columns" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">
            {headers?.length} columns detected
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewTable;