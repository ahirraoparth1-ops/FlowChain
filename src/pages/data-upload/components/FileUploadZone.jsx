import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, selectedFile, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { extension: '.csv', type: 'text/csv', icon: 'FileText' },
    { extension: '.xls', type: 'application/vnd.ms-excel', icon: 'FileSpreadsheet' },
    { extension: '.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'FileSpreadsheet' },
    { extension: '.json', type: 'application/json', icon: 'FileCode' }
  ];

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file?.size > maxSize) {
      onFileSelect(null, 'File size exceeds 50MB limit');
      return;
    }

    const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
    const isSupported = supportedFormats?.some(format => format?.extension === fileExtension);
    
    if (!isSupported) {
      onFileSelect(null, 'Unsupported file format. Please upload CSV, Excel, or JSON files.');
      return;
    }

    onFileSelect(file, null);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const getFileIcon = (fileName) => {
    const extension = '.' + fileName?.split('.')?.pop()?.toLowerCase();
    const format = supportedFormats?.find(f => f?.extension === extension);
    return format ? format?.icon : 'File';
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xls,.xlsx,.json"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-primary bg-blue-50 scale-[1.02]'
            : selectedFile
            ? 'border-success bg-green-50' :'border-border bg-card hover:border-primary hover:bg-blue-50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm font-medium text-foreground">Processing file...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          {selectedFile ? (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full">
                <Icon name={getFileIcon(selectedFile?.name)} size={32} color="var(--color-success)" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">File Selected</h3>
                <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Icon name="Upload" size={32} color="var(--color-primary)" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {isDragOver ? 'Drop your file here' : 'Upload Historical Data'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
            </>
          )}
        </div>

        {!selectedFile && (
          <div className="mt-6">
            <Button variant="outline" className="mb-4">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Choose File
            </Button>
          </div>
        )}
      </div>
      {/* Supported Formats */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Supported Formats</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {supportedFormats?.map((format) => (
            <div key={format?.extension} className="flex items-center space-x-2">
              <Icon name={format?.icon} size={16} color="var(--color-muted-foreground)" />
              <span className="text-xs text-muted-foreground font-mono">
                {format?.extension?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Maximum file size: 50MB
        </p>
      </div>
    </div>
  );
};

export default FileUploadZone;