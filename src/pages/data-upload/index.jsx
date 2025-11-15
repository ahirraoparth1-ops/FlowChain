import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import FileUploadZone from './components/FileUploadZone';
import FilePreviewTable from './components/FilePreviewTable';
import ProcessingActions from './components/ProcessingActions';
import ToastNotification from './components/ToastNotification';
import Icon from '../../components/AppIcon';
import * as XLSX from 'xlsx';

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [rawFileData, setRawFileData] = useState(null);

  // Mock data for different file types
  const mockPreviewData = {
    csv: [
      { date: "2024-01-01", product_id: "SKU001", product_name: "Wireless Headphones", quantity_sold: 45, revenue: 2250.00, region: "North" },
      { date: "2024-01-02", product_id: "SKU001", product_name: "Wireless Headphones", quantity_sold: 38, revenue: 1900.00, region: "North" },
      { date: "2024-01-03", product_id: "SKU002", product_name: "Bluetooth Speaker", quantity_sold: 22, revenue: 1320.00, region: "South" },
      { date: "2024-01-04", product_id: "SKU003", product_name: "Smart Watch", quantity_sold: 15, revenue: 3750.00, region: "East" },
      { date: "2024-01-05", product_id: "SKU001", product_name: "Wireless Headphones", quantity_sold: 52, revenue: 2600.00, region: "West" },
      { date: "2024-01-06", product_id: "SKU004", product_name: "Phone Case", quantity_sold: 89, revenue: 1780.00, region: "North" },
      { date: "2024-01-07", product_id: "SKU002", product_name: "Bluetooth Speaker", quantity_sold: 31, revenue: 1860.00, region: "South" }
    ],
    excel: [
      { item_code: "PROD-001", description: "Premium Coffee Beans", current_stock: 150, monthly_sales: 85, unit_cost: 12.50, supplier: "Global Coffee Co" },
      { item_code: "PROD-002", description: "Organic Tea Bags", current_stock: 200, monthly_sales: 120, unit_cost: 8.75, supplier: "Tea Masters Ltd" },
      { item_code: "PROD-003", description: "Energy Drinks", current_stock: 75, monthly_sales: 95, unit_cost: 2.25, supplier: "Beverage Corp" },
      { item_code: "PROD-004", description: "Protein Bars", current_stock: 300, monthly_sales: 180, unit_cost: 3.50, supplier: "Nutrition Plus" },
      { item_code: "PROD-005", description: "Vitamin Supplements", current_stock: 125, monthly_sales: 65, unit_cost: 15.00, supplier: "Health First" },
      { item_code: "PROD-006", description: "Sports Drinks", current_stock: 180, monthly_sales: 140, unit_cost: 1.75, supplier: "Athletic Beverages" }
    ],
    json: [
      { transaction_id: "TXN-2024-001", timestamp: "2024-01-15T10:30:00Z", customer_segment: "Premium", order_value: 450.00, items_count: 3, fulfillment_center: "FC-NYC" },
      { transaction_id: "TXN-2024-002", timestamp: "2024-01-15T11:45:00Z", customer_segment: "Standard", order_value: 125.50, items_count: 2, fulfillment_center: "FC-LA" },
      { transaction_id: "TXN-2024-003", timestamp: "2024-01-15T14:20:00Z", customer_segment: "Premium", order_value: 780.25, items_count: 5, fulfillment_center: "FC-CHI" },
      { transaction_id: "TXN-2024-004", timestamp: "2024-01-15T16:10:00Z", customer_segment: "Basic", order_value: 89.99, items_count: 1, fulfillment_center: "FC-NYC" },
      { transaction_id: "TXN-2024-005", timestamp: "2024-01-15T18:35:00Z", customer_segment: "Standard", order_value: 320.75, items_count: 4, fulfillment_center: "FC-MIA" }
    ]
  };

  const showToast = (message, type) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert to object format with headers
          const headers = jsonData[0];
          const rows = jsonData.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const parseCSVFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          }).filter(row => Object.values(row).some(val => val !== ''));
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseJSONFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          resolve(Array.isArray(jsonData) ? jsonData : [jsonData]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file, error) => {
    if (error) {
      showToast(error, 'error');
      return;
    }

    setSelectedFile(file);
    showToast('Parsing file...', 'info');

    try {
      const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
      let parsedData;

      switch (fileExtension) {
        case '.csv':
          parsedData = await parseCSVFile(file);
          break;
        case '.xls': case'.xlsx':
          parsedData = await parseExcelFile(file);
          break;
        case '.json':
          parsedData = await parseJSONFile(file);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      // Limit preview to first 10 rows for performance
      const previewRows = parsedData?.slice(0, 10);
      setPreviewData(previewRows);
      setRawFileData(parsedData);

      // Store only metadata in localStorage (not the entire dataset to avoid quota issues)
      try {
        localStorage.setItem('uploadedData', JSON.stringify({
          fileName: file?.name,
          uploadTime: new Date()?.toISOString(),
          totalRows: parsedData?.length,
          fileSize: file?.size
        }));
      } catch (storageError) {
        // If localStorage fails, just keep data in memory
        console.warn('Could not store metadata in localStorage:', storageError);
        // Continue anyway - data is in component state
      }

      showToast(`File "${file?.name}" parsed successfully! ${parsedData?.length} rows found.`, 'success');
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      showToast(`Error parsing file: ${parseError?.message}`, 'error');
      setPreviewData(null);
      setRawFileData(null);
    }
  };

  const handleProcessData = async () => {
    if (!selectedFile) {
      showToast('No file selected. Please upload a file first.', 'error');
      return false;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Show progress bar while uploading/processing
      setProcessingProgress(20);
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Send file to FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/forecast', {
        method: 'POST',
        body: formData,
      });
      setProcessingProgress(60);
      const result = await response.json();
      setProcessingProgress(90);

      if (result.error) {
        showToast(`Forecast error: ${result.error}`, 'error');
        setIsProcessing(false);
        return false;
      }

      // Store forecast result in localStorage for dashboard
      localStorage.setItem('forecastResult', JSON.stringify(result.forecast));

      setIsProcessing(false);
      setProcessingProgress(100);
      showToast('Forecast generated successfully! You can now view results in the dashboard.', 'success');
      return true;
    } catch (processingError) {
      setIsProcessing(false);
      showToast(`Processing failed: ${processingError?.message}`, 'error');
      return false;
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setRawFileData(null);
    setProcessingProgress(0);
    
    // Clear stored data
    localStorage.removeItem('uploadedData');
    
    showToast('File cleared successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Icon name="Upload" size={24} color="var(--color-primary)" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Upload Historical Data
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your historical sales and inventory data to generate AI-powered demand forecasts and optimization recommendations.
            </p>
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-2xl shadow-lg p-6 lg:p-8"
          >
            <FileUploadZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              isProcessing={isProcessing}
            />
          </motion.div>

          {/* File Preview Section */}
          {previewData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-2xl shadow-lg p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">File Preview</h3>
                {rawFileData && (
                  <div className="text-sm text-muted-foreground">
                    Showing 10 of {rawFileData?.length} total rows
                  </div>
                )}
              </div>
              <FilePreviewTable
                previewData={previewData}
                fileName={selectedFile?.name}
              />
            </motion.div>
          )}

          {/* Processing Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl shadow-lg p-6 lg:p-8"
          >
            <ProcessingActions
              selectedFile={selectedFile}
              previewData={previewData}
              isProcessing={isProcessing}
              onProcessData={handleProcessData}
              onClearFile={handleClearFile}
              processingProgress={processingProgress}
            />
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-muted rounded-2xl p-6 lg:p-8"
          >
            <div className="flex items-start space-x-4">
              <Icon name="HelpCircle" size={24} color="var(--color-primary)" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Data Format Tips:</p>
                    <ul className="space-y-1">
                      <li>• Include date/time columns for temporal analysis</li>
                      <li>• Ensure product identifiers are consistent</li>
                      <li>• Include quantity and revenue data</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Best Practices:</p>
                    <ul className="space-y-1">
                      <li>• Use at least 3 months of historical data</li>
                      <li>• Clean data for better forecast accuracy</li>
                      <li>• Include seasonal patterns if available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      {/* Toast Notification */}
      <ToastNotification
        message={toast?.message}
        type={toast?.type}
        isVisible={toast?.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default DataUpload;