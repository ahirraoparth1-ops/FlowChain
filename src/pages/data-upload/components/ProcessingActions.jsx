import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProcessingActions = ({ 
  selectedFile, 
  previewData, 
  isProcessing, 
  onProcessData, 
  onClearFile,
  processingProgress 
}) => {
  const navigate = useNavigate();

  const handleProcessData = async () => {
    if (!selectedFile || !previewData) return;
    
    const success = await onProcessData();
    if (success) {
      // Navigate to dashboard after successful processing
      setTimeout(() => {
        navigate('/forecast-dashboard');
      }, 2000);
    }
  };

  const canProcess = selectedFile && previewData && previewData?.length > 0 && !isProcessing;

  return (
    <div className="w-full space-y-6">
      {/* Processing Progress */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <h3 className="text-lg font-semibold text-foreground">Processing Your Data</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{processingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {processingProgress < 30 && "Analyzing data structure..."}
              {processingProgress >= 30 && processingProgress < 60 && "Generating AI forecasts..."}
              {processingProgress >= 60 && processingProgress < 90 && "Calculating recommendations..."}
              {processingProgress >= 90 && "Finalizing results..."}
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={handleProcessData}
          disabled={!canProcess}
          loading={isProcessing}
          iconName="Zap"
          iconPosition="left"
          className="flex-1"
        >
          {isProcessing ? 'Processing Data...' : 'Generate Forecast'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onClearFile}
          disabled={isProcessing}
          iconName="X"
          iconPosition="left"
          className="sm:w-auto"
        >
          Clear File
        </Button>
      </div>
      {/* Processing Requirements */}
      {selectedFile && previewData && !isProcessing && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Ready for Processing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span>File format validated</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span>{previewData?.length} rows of data detected</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span>Data structure compatible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Requirements Info */}
      {!selectedFile && (
        <div className="bg-muted rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Data Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>Historical sales data (minimum 3 months)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Package" size={14} />
                <span>Product/item identifiers</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} />
                <span>Quantity/volume information</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} />
                <span>Location/region data (optional)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingActions;