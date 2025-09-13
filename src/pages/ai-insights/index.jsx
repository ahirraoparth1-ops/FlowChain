import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import InsightCard from './components/InsightCard';
import InsightFilters from './components/InsightFilters';
import ModelPerformance from './components/ModelPerformance';
import InsightsSummary from './components/InsightsSummary';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AIInsights = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    impact: 'all',
    search: ''
  });
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for insights
  const mockInsights = [
    {
      id: 1,
      title: "Seasonal Demand Spike Detected",
      summary: "Winter clothing demand is expected to increase by 45% in the next 4 weeks based on historical patterns and weather forecasts.",
      category: "seasonal",
      priority: "high",
      impact: "high",
      confidence: 92,
      metrics: [
        { label: "Expected Increase", value: "45%", trend: "up" },
        { label: "Affected SKUs", value: "127", trend: null },
        { label: "Revenue Impact", value: "$2.3M", trend: "up" }
      ],
      detailedAnalysis: `Our AI model has identified a significant seasonal pattern emerging for winter clothing categories. The analysis combines historical sales data from the past 5 years, current weather forecasts, and social media sentiment analysis. The model predicts a 45% increase in demand starting in 3 weeks, with peak demand occurring in weeks 6-8. This pattern is consistent with previous years but shows a 12% higher intensity due to early cold weather predictions.`,
      recommendations: [
        "Increase inventory orders for winter jackets, sweaters, and boots by 40-50%",
        "Negotiate expedited shipping with suppliers to meet demand surge",
        "Prepare marketing campaigns to capitalize on early season demand",
        "Monitor competitor pricing and adjust strategy accordingly"
      ],
      relatedItems: ["Winter Jackets", "Wool Sweaters", "Winter Boots", "Thermal Wear"]
    },
    {
      id: 2,
      title: "Inventory Optimization Opportunity",
      summary: "Electronics category shows 23% overstock in tablets while smartphones are understocked by 18%. Rebalancing could save $450K.",
      category: "inventory",
      priority: "medium",
      impact: "high",
      confidence: 87,
      metrics: [
        { label: "Overstock Value", value: "$450K", trend: "down" },
        { label: "Understock Items", value: "34", trend: null },
        { label: "Potential Savings", value: "$450K", trend: "up" }
      ],
      detailedAnalysis: `Analysis of electronics inventory reveals significant imbalances across product categories. Tablet inventory is 23% above optimal levels, tying up $450K in working capital, while smartphone inventory is 18% below demand requirements, leading to potential lost sales of $280K. The imbalance is attributed to shifting consumer preferences toward smartphones and declining tablet demand post-pandemic.`,
      recommendations: [
        "Reduce tablet orders by 30% for next quarter",
        "Increase smartphone inventory by 25% focusing on mid-range models",
        "Implement promotional campaigns to clear excess tablet inventory",
        "Adjust supplier agreements to reflect new demand patterns"
      ],
      relatedItems: ["iPad Pro", "Samsung Galaxy Tab", "iPhone 15", "Samsung Galaxy S24"]
    },
    {
      id: 3,
      title: "Supply Chain Disruption Alert",
      summary: "Potential shipping delays from Asia-Pacific region may affect 15% of inventory. Alternative routing recommended.",
      category: "anomaly",
      priority: "high",
      impact: "medium",
      confidence: 78,
      metrics: [
        { label: "Affected Orders", value: "156", trend: null },
        { label: "Delay Risk", value: "15%", trend: "up" },
        { label: "Alternative Routes", value: "3", trend: null }
      ],
      detailedAnalysis: `Our supply chain monitoring system has detected increased shipping delays from major Asia-Pacific ports, with average delays extending from 2-3 days to 7-10 days. This affects approximately 15% of our current inventory pipeline, particularly electronics and home goods categories. The disruption is attributed to port congestion and increased inspection procedures.`,
      recommendations: [
        "Activate alternative shipping routes through European ports",
        "Increase safety stock for affected categories by 20%",
        "Communicate potential delays to customers proactively",
        "Negotiate expedited processing with current suppliers"
      ],
      relatedItems: ["Electronics", "Home Goods", "Furniture", "Appliances"]
    },
    {
      id: 4,
      title: "Cost Optimization Through Supplier Consolidation",
      summary: "Consolidating 12 small suppliers into 3 major partners could reduce procurement costs by 18% while maintaining quality.",
      category: "cost",
      priority: "medium",
      impact: "medium",
      confidence: 85,
      metrics: [
        { label: "Cost Reduction", value: "18%", trend: "down" },
        { label: "Suppliers to Consolidate", value: "12", trend: null },
        { label: "Annual Savings", value: "$320K", trend: "up" }
      ],
      detailedAnalysis: `Analysis of supplier performance and costs reveals opportunities for significant savings through strategic consolidation. Currently working with 12 small suppliers for similar product categories results in higher per-unit costs, increased administrative overhead, and reduced negotiating power. Consolidating to 3 major suppliers would enable volume discounts, streamlined processes, and better quality control.`,
      recommendations: [
        "Initiate negotiations with top 3 performing suppliers",
        "Develop transition plan for supplier consolidation over 6 months",
        "Establish quality assurance protocols with new supplier structure",
        "Create contingency plans to maintain supply security"
      ],
      relatedItems: ["Office Supplies", "Packaging Materials", "Raw Materials", "Components"]
    },
    {
      id: 5,
      title: "Demand Pattern Shift in Home Office Products",
      summary: "Remote work trends show 35% sustained increase in home office product demand compared to pre-2020 levels.",
      category: "demand",
      priority: "low",
      impact: "medium",
      confidence: 91,
      metrics: [
        { label: "Demand Increase", value: "35%", trend: "up" },
        { label: "Market Growth", value: "28%", trend: "up" },
        { label: "Category Revenue", value: "$1.8M", trend: "up" }
      ],
      detailedAnalysis: `Long-term analysis reveals a permanent shift in home office product demand. Unlike the temporary spike during 2020-2021, current demand patterns show sustained 35% increase above pre-pandemic levels. This indicates a structural change in work patterns with hybrid and remote work becoming permanent for many professionals. Categories showing strongest growth include ergonomic furniture, lighting, and productivity accessories.`,
      recommendations: [
        "Expand home office product lines to capture growing market",
        "Develop partnerships with ergonomic furniture manufacturers",
        "Create bundled office setup packages for new remote workers",
        "Invest in marketing campaigns targeting remote work professionals"
      ],
      relatedItems: ["Desk Chairs", "Standing Desks", "Monitor Arms", "Desk Lamps"]
    },
    {
      id: 6,
      title: "Quality Issue Pattern Detection",
      summary: "AI detected recurring quality issues in Supplier X products. 8% higher return rate suggests need for quality review.",
      category: "anomaly",
      priority: "high",
      impact: "low",
      confidence: 82,
      metrics: [
        { label: "Return Rate", value: "8%", trend: "up" },
        { label: "Affected Products", value: "23", trend: null },
        { label: "Quality Score", value: "72%", trend: "down" }
      ],
      detailedAnalysis: `Pattern recognition algorithms have identified a concerning trend in product quality from Supplier X. Return rates have increased from 3% to 8% over the past quarter, with consistent complaints about durability and finish quality. The issue appears to correlate with a change in their manufacturing process implemented 4 months ago. Customer satisfaction scores for these products have dropped from 4.2 to 3.6 stars.`,
      recommendations: [
        "Schedule immediate quality audit with Supplier X",
        "Implement enhanced incoming quality inspection procedures",
        "Consider alternative suppliers for affected product lines",
        "Develop quality improvement plan with current supplier"
      ],
      relatedItems: ["Kitchen Appliances", "Power Tools", "Outdoor Equipment", "Electronics"]
    }
  ];

  // Mock performance data
  const mockPerformance = {
    overallAccuracy: 89,
    precision: 87,
    confidence: 91,
    dataQuality: 94,
    lastUpdated: "2 hours ago",
    algorithm: "Ensemble ML (XGBoost + LSTM)",
    trainingData: "24 months historical data",
    lastRetrained: "3 days ago",
    mae: "12.3%",
    rmse: "15.7%",
    r2Score: "0.89",
    trends: [
      { metric: "Forecast Accuracy", change: 3.2 },
      { metric: "Processing Speed", change: -1.1 },
      { metric: "Data Coverage", change: 5.8 }
    ]
  };

  // Mock summary data
  const mockSummary = {
    totalInsights: 47,
    highPriority: 12,
    implemented: 23,
    potentialSavings: "$2.1M",
    insightsChange: 8,
    highPriorityChange: -15,
    implementedChange: 12,
    savingsChange: 23
  };

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter insights based on current filters
    let filtered = mockInsights;

    if (filters?.category !== 'all') {
      filtered = filtered?.filter(insight => insight?.category === filters?.category);
    }

    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(insight => insight?.priority === filters?.priority);
    }

    if (filters?.impact !== 'all') {
      filtered = filtered?.filter(insight => insight?.impact === filters?.impact);
    }

    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(insight => 
        insight?.title?.toLowerCase()?.includes(searchTerm) ||
        insight?.summary?.toLowerCase()?.includes(searchTerm) ||
        insight?.category?.toLowerCase()?.includes(searchTerm)
      );
    }

    setFilteredInsights(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      priority: 'all',
      impact: 'all',
      search: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-gray-600 mt-2">
                Contextual recommendations and actionable intelligence from demand forecasting analysis
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Download" iconPosition="left">
                Export Report
              </Button>
              <Button variant="default" iconName="RefreshCw" iconPosition="left">
                Refresh Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <InsightsSummary summary={mockSummary} />

        {/* Model Performance */}
        <ModelPerformance performance={mockPerformance} />

        {/* Filters */}
        <InsightFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Insights ({filteredInsights?.length})
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filters?.category !== 'all' || filters?.priority !== 'all' || filters?.impact !== 'all' || filters?.search ?'Filtered results based on your criteria' :'All available insights from AI analysis'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Grid3X3">
              Grid
            </Button>
            <Button variant="ghost" size="sm" iconName="List">
              List
            </Button>
          </div>
        </div>

        {/* Insights Grid */}
        {filteredInsights?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredInsights?.map((insight) => (
              <InsightCard key={insight?.id} insight={insight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <Icon name="Search" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find relevant insights.
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredInsights?.length > 0 && (
          <div className="text-center">
            <Button variant="outline" iconName="ChevronDown" iconPosition="right">
              Load More Insights
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIInsights;