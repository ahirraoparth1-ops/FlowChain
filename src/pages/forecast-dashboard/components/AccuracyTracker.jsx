import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const AccuracyTracker = ({ data }) => {
  const averageAccuracy = data?.reduce((sum, item) => sum + item?.accuracy, 0) / data?.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-sm text-gray-600">Accuracy:</span>
            <span className="text-sm font-medium text-gray-900">
              {payload?.[0]?.value?.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy) => {
    if (accuracy >= 90) return 'bg-green-50 border-green-200';
    if (accuracy >= 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Forecast Accuracy</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border ${getAccuracyBgColor(averageAccuracy)}`}>
          <span className={`text-sm font-medium ${getAccuracyColor(averageAccuracy)}`}>
            {averageAccuracy?.toFixed(1)}% Avg
          </span>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {data?.filter(d => d?.accuracy >= 90)?.length}
          </p>
          <p className="text-xs text-gray-600">Excellent (&gt;90%)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {data?.filter(d => d?.accuracy >= 80 && d?.accuracy < 90)?.length}
          </p>
          <p className="text-xs text-gray-600">Good (80-90%)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {data?.filter(d => d?.accuracy < 80)?.length}
          </p>
          <p className="text-xs text-gray-600">Needs Improvement (&lt;80%)</p>
        </div>
      </div>
    </div>
  );
};

export default AccuracyTracker;