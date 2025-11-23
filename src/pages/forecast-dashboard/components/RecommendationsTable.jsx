import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RecommendationsTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (currentStock, forecastDemand) => {
    const ratio = currentStock / forecastDemand;
    if (ratio < 0.5) return 'red';
    if (ratio < 0.8) return 'yellow';
    return 'green';
  };

  const getStatusText = (currentStock, forecastDemand) => {
    const ratio = currentStock / forecastDemand;
    if (ratio < 0.5) return 'Critical Shortage';
    if (ratio < 0.8) return 'Low Stock';
    return 'Adequate Stock';
  };

  const getStatusClasses = (status) => {
    const classes = {
      'Critical Shortage': 'bg-red-100 text-red-800 border-red-200',
      'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Adequate Stock': 'bg-green-100 text-green-800 border-green-200'
    };
    return classes?.[status] || classes?.['Adequate Stock'];
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data?.filter(item => 
      item?.item?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered?.filter(item => {
        const status = getStatusText(item?.currentStock, item?.forecastDemand);
        return status === filterStatus;
      });
    }

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, filterStatus]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Item', 'Current Stock', 'Forecast Demand', 'Suggested Order', 'Status'];
    const csvContent = [
      headers?.join(','),
      ...filteredAndSortedData?.map(row => [
        row?.item,
        row?.currentStock,
        row?.forecastDemand,
        row?.suggestedOrder,
        getStatusText(row?.currentStock, row?.forecastDemand)
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-recommendations.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Inventory Recommendations</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 sm:w-64">
              <Input
                type="search"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Critical Shortage">Critical Shortage</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Adequate Stock">Adequate Stock</option>
            </select>
            
            <Button
              variant="outline"
              onClick={exportToCSV}
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'item', label: 'Item' },
                { key: 'currentStock', label: 'Current Stock' },
                { key: 'forecastDemand', label: 'Forecast Demand' },
                { key: 'suggestedOrder', label: 'Suggested Order' },
                { key: 'status', label: 'Status' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    <Icon 
                      name={
                        sortConfig?.key === column?.key 
                          ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' :'ChevronsUpDown'
                      } 
                      size={14} 
                      className="text-gray-400"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData?.map((item, index) => {
              const status = getStatusText(item?.currentStock, item?.forecastDemand);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item?.item}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item?.currentStock?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item?.forecastDemand?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item?.suggestedOrder?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusClasses(status)}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredAndSortedData?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No items found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTable;