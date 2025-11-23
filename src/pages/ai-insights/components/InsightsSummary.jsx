import React from 'react';
import Icon from '../../../components/AppIcon';

const InsightsSummary = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Total Insights',
      value: summary?.totalInsights,
      icon: 'Lightbulb',
      color: 'bg-blue-50 text-blue-600',
      change: summary?.insightsChange,
      changeType: summary?.insightsChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'High Priority',
      value: summary?.highPriority,
      icon: 'AlertTriangle',
      color: 'bg-red-50 text-red-600',
      change: summary?.highPriorityChange,
      changeType: summary?.highPriorityChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Implemented',
      value: summary?.implemented,
      icon: 'CheckCircle',
      color: 'bg-green-50 text-green-600',
      change: summary?.implementedChange,
      changeType: summary?.implementedChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Potential Savings',
      value: summary?.potentialSavings,
      icon: 'DollarSign',
      color: 'bg-yellow-50 text-yellow-600',
      change: summary?.savingsChange,
      changeType: summary?.savingsChange > 0 ? 'increase' : 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {summaryCards?.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card?.color}`}>
              <Icon name={card?.icon} size={24} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              card?.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon 
                name={card?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
              />
              <span>{Math.abs(card?.change)}%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{card?.value}</h3>
            <p className="text-gray-600 text-sm">{card?.title}</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {card?.changeType === 'increase' ? 'Increased' : 'Decreased'} by {Math.abs(card?.change)}% from last week
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightsSummary;