import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightCard = ({ insight }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high':
        return 'TrendingUp';
      case 'medium':
        return 'BarChart3';
      case 'low':
        return 'Activity';
      default:
        return 'Info';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(insight?.priority)}`}>
            <Icon name={getImpactIcon(insight?.impact)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{insight?.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight?.priority)}`}>
                {insight?.priority?.charAt(0)?.toUpperCase() + insight?.priority?.slice(1)} Priority
              </span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">{insight?.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{insight?.confidence}%</div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>
      </div>
      {/* Summary */}
      <p className="text-gray-700 mb-4 leading-relaxed">{insight?.summary}</p>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {insight?.metrics?.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">{metric?.label}</div>
            <div className={`text-lg font-semibold ${
              metric?.trend === 'up' ? 'text-green-600' : 
              metric?.trend === 'down' ? 'text-red-600' : 'text-gray-900'
            }`}>
              {metric?.value}
              {metric?.trend && (
                <Icon 
                  name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className="inline ml-1" 
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
          {/* Detailed Analysis */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Detailed Analysis</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{insight?.detailedAnalysis}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {insight?.recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Items */}
          {insight?.relatedItems && insight?.relatedItems?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Related Items</h4>
              <div className="flex flex-wrap gap-2">
                {insight?.relatedItems?.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
            View Details
          </Button>
          <Button variant="ghost" size="sm" iconName="ExternalLink" iconPosition="left">
            Dashboard
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="BookmarkPlus">
            Save
          </Button>
          <Button variant="default" size="sm" iconName="Play" iconPosition="left">
            Implement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;