import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'demand', label: 'Demand Forecasting' },
    { value: 'inventory', label: 'Inventory Optimization' },
    { value: 'seasonal', label: 'Seasonal Trends' },
    { value: 'anomaly', label: 'Anomaly Detection' },
    { value: 'cost', label: 'Cost Optimization' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const impacts = [
    { value: 'all', label: 'All Impact Levels' },
    { value: 'high', label: 'High Impact' },
    { value: 'medium', label: 'Medium Impact' },
    { value: 'low', label: 'Low Impact' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.category !== 'all') count++;
    if (filters?.priority !== 'all') count++;
    if (filters?.impact !== 'all') count++;
    if (filters?.search) count++;
    return count;
  };

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">Filter Insights</h3>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} iconName="X" iconPosition="left">
              Clear All ({getActiveFiltersCount()})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search insights..."
                value={filters?.search || ''}
                onChange={(e) => handleFilterChange('search', e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters?.category || 'all'}
              onChange={(e) => handleFilterChange('category', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories?.map((category) => (
                <option key={category?.value} value={category?.value}>
                  {category?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filters?.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities?.map((priority) => (
                <option key={priority?.value} value={priority?.value}>
                  {priority?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Impact Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
            <select
              value={filters?.impact || 'all'}
              onChange={(e) => handleFilterChange('impact', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {impacts?.map((impact) => (
                <option key={impact?.value} value={impact?.value}>
                  {impact?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterPanelOpen(true)}
          iconName="Filter"
          iconPosition="left"
          className="w-full"
        >
          Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </Button>
      </div>
      {/* Mobile Filter Panel */}
      {isFilterPanelOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsFilterPanelOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-900">Filter Insights</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterPanelOpen(false)}
                className="h-8 w-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Mobile Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={filters?.search || ''}
                    onChange={(e) => handleFilterChange('search', e?.target?.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters?.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e?.target?.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories?.map((category) => (
                    <option key={category?.value} value={category?.value}>
                      {category?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters?.priority || 'all'}
                  onChange={(e) => handleFilterChange('priority', e?.target?.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities?.map((priority) => (
                    <option key={priority?.value} value={priority?.value}>
                      {priority?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Impact Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
                <select
                  value={filters?.impact || 'all'}
                  onChange={(e) => handleFilterChange('impact', e?.target?.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {impacts?.map((impact) => (
                    <option key={impact?.value} value={impact?.value}>
                      {impact?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                variant="default"
                onClick={() => setIsFilterPanelOpen(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InsightFilters;