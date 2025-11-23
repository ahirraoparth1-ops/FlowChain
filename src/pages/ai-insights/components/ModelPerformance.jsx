import React from 'react';
import Icon from '../../../components/AppIcon';

const ModelPerformance = ({ performance }) => {
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-50';
    if (accuracy >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAccuracyIcon = (accuracy) => {
    if (accuracy >= 90) return 'CheckCircle';
    if (accuracy >= 80) return 'AlertTriangle';
    return 'AlertCircle';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon name="Brain" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">AI Model Performance</h3>
            <p className="text-gray-600 text-sm">Real-time accuracy and reliability metrics</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-sm font-medium text-gray-900">{performance?.lastUpdated}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Accuracy */}
        <div className={`p-4 rounded-lg ${getAccuracyColor(performance?.overallAccuracy)}`}>
          <div className="flex items-center justify-between mb-2">
            <Icon name={getAccuracyIcon(performance?.overallAccuracy)} size={20} />
            <span className="text-2xl font-bold">{performance?.overallAccuracy}%</span>
          </div>
          <div className="text-sm font-medium">Overall Accuracy</div>
          <div className="text-xs opacity-80 mt-1">
            {performance?.overallAccuracy >= 90 ? 'Excellent' : 
             performance?.overallAccuracy >= 80 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        {/* Forecast Precision */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Target" size={20} className="text-gray-600" />
            <span className="text-2xl font-bold text-gray-900">{performance?.precision}%</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Forecast Precision</div>
          <div className="text-xs text-gray-600 mt-1">Prediction accuracy</div>
        </div>

        {/* Model Confidence */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Shield" size={20} className="text-gray-600" />
            <span className="text-2xl font-bold text-gray-900">{performance?.confidence}%</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Model Confidence</div>
          <div className="text-xs text-gray-600 mt-1">Reliability score</div>
        </div>

        {/* Data Quality */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Database" size={20} className="text-gray-600" />
            <span className="text-2xl font-bold text-gray-900">{performance?.dataQuality}%</span>
          </div>
          <div className="text-sm font-medium text-gray-900">Data Quality</div>
          <div className="text-xs text-gray-600 mt-1">Input data score</div>
        </div>
      </div>
      {/* Performance Trends */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Recent Performance Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performance?.trends?.map((trend, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                trend?.change > 0 ? 'bg-green-50 text-green-600' : 
                trend?.change < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
              }`}>
                <Icon 
                  name={trend?.change > 0 ? 'TrendingUp' : trend?.change < 0 ? 'TrendingDown' : 'Minus'} 
                  size={16} 
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{trend?.metric}</div>
                <div className={`text-sm ${
                  trend?.change > 0 ? 'text-green-600' : 
                  trend?.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend?.change > 0 ? '+' : ''}{trend?.change}% vs last week
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Model Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Model Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Algorithm:</span>
                <span className="text-gray-900 font-medium">{performance?.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training Data:</span>
                <span className="text-gray-900 font-medium">{performance?.trainingData}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Retrained:</span>
                <span className="text-gray-900 font-medium">{performance?.lastRetrained}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">MAE (Mean Absolute Error):</span>
                <span className="text-gray-900 font-medium">{performance?.mae}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RMSE (Root Mean Square Error):</span>
                <span className="text-gray-900 font-medium">{performance?.rmse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">R² Score:</span>
                <span className="text-gray-900 font-medium">{performance?.r2Score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;