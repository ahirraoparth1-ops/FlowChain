import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReverseforecastingModule = ({ data }) => {
  const [activeTab, setActiveTab] = useState('surplus');
  
  const tabs = [
    { id: 'surplus', label: 'Surplus Inventory', icon: 'Package' },
    { id: 'redistribution', label: 'Redistribution', icon: 'ArrowLeftRight' },
    { id: 'recycling', label: 'Recycling Options', icon: 'Recycle' }
  ];

  // Mock data for surplus analysis
  const surplusData = [
    { 
      item: 'Widget A', 
      currentStock: 890, 
      forecastDemand: 750, 
      surplus: 140,
      location: 'Store A',
      expiryDays: null,
      category: 'durable'
    },
    { 
      item: 'Widget F', 
      currentStock: 520, 
      forecastDemand: 410, 
      surplus: 110,
      location: 'Store A',
      expiryDays: null,
      category: 'durable'
    },
    { 
      item: 'Perishable Item X', 
      currentStock: 200, 
      forecastDemand: 150, 
      surplus: 50,
      location: 'Store B',
      expiryDays: 7,
      category: 'perishable'
    },
    { 
      item: 'Perishable Item Y', 
      currentStock: 300, 
      forecastDemand: 220, 
      surplus: 80,
      location: 'Store C',
      expiryDays: 3,
      category: 'perishable'
    }
  ];

  // Mock redistribution suggestions
  const redistributionData = [
    {
      from: 'Store A',
      to: 'Store B',
      item: 'Widget A',
      surplus: 140,
      demandShortfall: 100,
      suggestedTransfer: 100,
      savings: 2400,
      transportCost: 200
    },
    {
      from: 'Store A', 
      to: 'Store D',
      item: 'Widget F',
      surplus: 110,
      demandShortfall: 80,
      suggestedTransfer: 80,
      savings: 1800,
      transportCost: 150
    }
  ];

  // Mock recycling options
  const recyclingOptions = [
    {
      item: 'Perishable Item Y',
      location: 'Store C',
      surplus: 80,
      expiryDays: 3,
      options: [
        { type: 'Discount Sale', discount: '40%', expectedRevenue: 960, urgency: 'high' },
        { type: 'Staff Purchase', discount: '50%', expectedRevenue: 800, urgency: 'medium' },
        { type: 'Donation', taxBenefit: 400, socialImpact: 'high', urgency: 'low' }
      ]
    },
    {
      item: 'Perishable Item X',
      location: 'Store B', 
      surplus: 50,
      expiryDays: 7,
      options: [
        { type: 'Bundle Offer', discount: '25%', expectedRevenue: 1125, urgency: 'medium' },
        { type: 'B2B Sale', discount: '35%', expectedRevenue: 975, urgency: 'medium' },
        { type: 'Compost/Recycle', cost: -50, environmentalImpact: 'positive', urgency: 'low' }
      ]
    }
  ];

  const getSurplusBarData = () => {
    return surplusData?.map(item => ({
      item: item?.item?.substring(0, 10) + '...',
      surplus: item?.surplus,
      currentStock: item?.currentStock,
      forecastDemand: item?.forecastDemand
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
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
        </div>
      );
    }
    return null;
  };

  const renderSurplusTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Icon name="Recycle" size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-green-900 mb-2">Surplus Inventory Detected</h4>
            <p className="text-green-700 mb-4">
              System identified {surplusData?.length} items with excess inventory. 
              Take action to reduce waste and optimize storage costs.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {surplusData?.reduce((sum, item) => sum + item?.surplus, 0)?.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Total Surplus Units</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(surplusData?.reduce((sum, item) => sum + (item?.surplus * 20), 0))?.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Tied Up Capital</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {surplusData?.filter(item => item?.category === 'perishable')?.length}
                </div>
                <div className="text-sm text-green-600">Perishable Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Icon name="BarChart3" size={20} className="text-blue-600" />
            <span>Surplus Analysis</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getSurplusBarData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="item" fontSize={12} stroke="#6b7280" />
                <YAxis fontSize={12} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="surplus" fill="#10b981" name="Surplus Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-orange-600" />
            <span>Priority Items</span>
          </h4>
          <div className="space-y-3">
            {surplusData
              ?.sort((a, b) => (a?.expiryDays || 999) - (b?.expiryDays || 999))
              ?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item?.item}</div>
                  <div className="text-sm text-gray-600">
                    {item?.surplus} surplus units at {item?.location}
                  </div>
                </div>
                <div className="text-right">
                  {item?.expiryDays ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item?.expiryDays <= 3 
                        ? 'bg-red-100 text-red-800' 
                        : item?.expiryDays <= 7 
                        ? 'bg-yellow-100 text-yellow-800' :'bg-green-100 text-green-800'
                    }`}>
                      {item?.expiryDays}d to expiry
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Durable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRedistributionTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Icon name="ArrowLeftRight" size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Smart Redistribution</h4>
            <p className="text-blue-700 mb-4">
              Optimize inventory across locations by moving surplus stock to areas with demand.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {redistributionData?.length}
                </div>
                <div className="text-sm text-blue-600">Transfer Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${redistributionData?.reduce((sum, item) => sum + item?.savings, 0)?.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Potential Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {redistributionData?.reduce((sum, item) => sum + item?.suggestedTransfer, 0)?.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Units to Transfer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {redistributionData?.map((transfer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-800">{transfer?.from}</span>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-gray-400" />
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-green-800">{transfer?.to}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${transfer?.savings?.toLocaleString()} saved
                </div>
                <div className="text-sm text-gray-600">
                  Transport: ${transfer?.transportCost?.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Item</div>
                <div className="font-medium text-gray-900">{transfer?.item}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Available Surplus</div>
                <div className="font-medium text-gray-900">{transfer?.surplus?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Demand Shortfall</div>
                <div className="font-medium text-gray-900">{transfer?.demandShortfall?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Suggested Transfer</div>
                <div className="font-medium text-orange-600">{transfer?.suggestedTransfer?.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button size="sm" iconName="Send" iconPosition="left">
                Initiate Transfer
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderRecyclingTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
        <div className="flex items-start space-x-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Icon name="Recycle" size={24} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-orange-900 mb-2">Recycling & Recovery Options</h4>
            <p className="text-orange-700 mb-4">
              Minimize waste and recover value from surplus inventory through strategic recycling options.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {recyclingOptions?.length}
                </div>
                <div className="text-sm text-orange-600">Items Needing Action</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${recyclingOptions?.reduce((sum, item) => 
                    sum + Math.max(...item?.options?.map(opt => opt?.expectedRevenue || 0)), 0
                  )?.toLocaleString()}
                </div>
                <div className="text-sm text-orange-600">Max Recovery Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {recyclingOptions?.filter(item => item?.expiryDays <= 7)?.length}
                </div>
                <div className="text-sm text-orange-600">Urgent Actions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {recyclingOptions?.map((recycling, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">{recycling?.item}</h5>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">
                    Location: {recycling?.location}
                  </span>
                  <span className="text-sm text-gray-600">
                    Surplus: {recycling?.surplus} units
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    recycling?.expiryDays <= 3 
                      ? 'bg-red-100 text-red-800' 
                      : recycling?.expiryDays <= 7 
                      ? 'bg-yellow-100 text-yellow-800' :'bg-green-100 text-green-800'
                  }`}>
                    {recycling?.expiryDays}d to expiry
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recycling?.options?.map((option, optIndex) => (
                <div 
                  key={optIndex}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-medium text-gray-900">{option?.type}</h6>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      option?.urgency === 'high' ?'bg-red-100 text-red-800'
                        : option?.urgency === 'medium' ?'bg-yellow-100 text-yellow-800' :'bg-green-100 text-green-800'
                    }`}>
                      {option?.urgency}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {option?.discount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-gray-900">{option?.discount}</span>
                      </div>
                    )}
                    {option?.expectedRevenue && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="text-green-600 font-medium">
                          ${option?.expectedRevenue?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {option?.taxBenefit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax Benefit:</span>
                        <span className="text-blue-600 font-medium">
                          ${option?.taxBenefit?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {option?.socialImpact && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Social Impact:</span>
                        <span className="text-green-600">{option?.socialImpact}</span>
                      </div>
                    )}
                    {option?.environmentalImpact && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Environmental:</span>
                        <span className="text-green-600">{option?.environmentalImpact}</span>
                      </div>
                    )}
                    {option?.cost && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="text-red-600 font-medium">
                          ${Math.abs(option?.cost)?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full mt-4"
                    variant={option?.urgency === 'high' ? 'default' : 'outline'}
                  >
                    Select Option
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Recycle" size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Reverse Forecasting & Recycling</h3>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Report
          </Button>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab?.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="text-sm font-medium">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'surplus' && renderSurplusTab()}
        {activeTab === 'redistribution' && renderRedistributionTab()}
        {activeTab === 'recycling' && renderRecyclingTab()}
      </div>
    </div>
  );
};

export default ReverseforecastingModule;