import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ForecastChart = ({ data, title, showSurplusIndicators = false }) => {
  const [timeRange, setTimeRange] = useState('3M');

  const timeRanges = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' }
  ];

  // Add surplus calculation only if both actual and predicted exist
  const enhancedData = data?.map(item => ({
    ...item,
    surplus: (item?.actual != null && item?.predicted != null) ? Math.max(0, item.actual - item.predicted) : undefined,
    deficit: (item?.actual != null && item?.predicted != null) ? Math.max(0, item.predicted - item.actual) : undefined
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const surplusValue = payload?.find(p => p?.dataKey === 'surplus')?.value || 0;
      const deficitValue = payload?.find(p => p?.dataKey === 'deficit')?.value || 0;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-gray-600">{entry?.dataKey}:</span>
              <span className="text-sm font-medium text-gray-900">
                {entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
          {showSurplusIndicators && surplusValue > 0 && (
            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
              <div className="flex items-center space-x-2">
                <Icon name="Recycle" size={14} className="text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Surplus: {surplusValue?.toLocaleString()} units
                </span>
              </div>
              <span className="text-xs text-green-600">Consider redistribution or recycling</span>
            </div>
          )}
          {showSurplusIndicators && deficitValue > 0 && (
            <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-red-600" />
                <span className="text-sm text-red-800 font-medium">
                  Shortage: {deficitValue?.toLocaleString()} units
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showSurplusIndicators && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Surplus Tracking Enabled
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {timeRanges?.map((range) => (
            <Button
              key={range?.value}
              variant={timeRange === range?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range?.value)}
            >
              {range?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value?.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Only plot actuals if available */}
            {enhancedData.some(d => d.actual != null) && (
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                name="Actual Sales"
              />
            )}
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#10b981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Predicted Sales"
            />
            {showSurplusIndicators && (
              <>
                <Line
                  type="monotone"
                  dataKey="surplus"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  name="Surplus (Overshoot)"
                />
                {/* Add reference line at zero */}
                <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showSurplusIndicators && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Surplus Indicator</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Recycle" size={14} className="text-green-600" />
              <span className="text-gray-600">Recycling Opportunity</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total Surplus: {enhancedData?.reduce((sum, item) => sum + (item?.surplus || 0), 0)?.toLocaleString()} units
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastChart;