import React from 'react';
import { Card, Select, Typography, Radio, Button, Divider, Badge, Tooltip, Tag } from 'antd';
import { 
  FilterOutlined, 
  TagsOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const FilterPanel = ({ 
  categories, 
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockFilterChange,
  onResetFilters,
  priceRange,
  onPriceRangeChange,
  sortOrder,
  onSortOrderChange
}) => {
  // Calculate active filters count
  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    (stockFilter !== null ? 1 : 0) + 
    (priceRange ? 1 : 0) +
    (sortOrder ? 1 : 0);
    
  // Green theme colors
  const primaryGreen = '#10B981'; // Tailwind emerald-500
  const lightGreen = '#D1FAE5';   // Tailwind emerald-100
  const darkGreen = '#065F46';    // Tailwind emerald-800
  const borderGreen = '#34D399';  // Tailwind emerald-400

  return (
    <Card 
      className="mb-4 border-gray-200 shadow-sm"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FilterOutlined style={{ color: primaryGreen }} className="mr-2" />
            <span className="font-medium">Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <Badge 
                count={activeFiltersCount} 
                style={{ backgroundColor: primaryGreen }} 
                className="ml-2"
              />
            )}
          </div>
          <Tooltip title="Reset all filters">
            <Button 
              icon={<ReloadOutlined />} 
              size="small"
              onClick={onResetFilters}
              style={{ 
                backgroundColor: activeFiltersCount > 0 ? primaryGreen : 'white',
                borderColor: activeFiltersCount > 0 ? primaryGreen : '#d9d9d9',
                color: activeFiltersCount > 0 ? 'white' : 'rgba(0, 0, 0, 0.65)'
              }}
            >
              Reset
            </Button>
          </Tooltip>
        </div>
      }
      bodyStyle={{ padding: '20px' }}
      style={{ borderColor: borderGreen, borderRadius: '8px' }}
      headStyle={{ backgroundColor: lightGreen, borderColor: borderGreen }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Title level={5} className="flex items-center mb-3">
            <TagsOutlined style={{ color: primaryGreen }} className="mr-2" />
            <span>Category</span>
          </Title>
          <Select
            placeholder="Select a category"
            value={selectedCategory}
            onChange={onCategoryChange}
            allowClear
            style={{ width: '100%' }}
            className="rounded-md"
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>
        
        {/* Stock Status Filter */}
        <div className="space-y-2">
          <Title level={5} className="flex items-center mb-3">
            <CheckCircleOutlined style={{ color: primaryGreen }} className="mr-2" />
            <span>Stock Status</span>
          </Title>
          <Select
            placeholder="Select stock status"
            value={stockFilter}
            onChange={onStockFilterChange}
            allowClear
            style={{ width: '100%' }}
            className="rounded-md"
            size="large"
          >
            <Option value={true}>In Stock</Option>
            <Option value={false}>Out of Stock</Option>
          </Select>
        </div>
        
        {/* Price Range Filter */}
        <div className="space-y-2">
          <Title level={5} className="flex items-center mb-3">
            <DollarOutlined style={{ color: primaryGreen }} className="mr-2" />
            <span>Price Range</span>
          </Title>
          <Select
            placeholder="Select price range"
            value={priceRange}
            onChange={onPriceRangeChange}
            allowClear
            style={{ width: '100%' }}
            className="rounded-md"
            size="large"
          >
            <Option value="under-10">Under $10</Option>
            <Option value="10-50">$10 - $50</Option>
            <Option value="50-100">$50 - $100</Option>
            <Option value="over-100">Over $100</Option>
          </Select>
        </div>
        
        {/* Sort Order */}
        <div className="space-y-2">
          <Title level={5} className="flex items-center mb-3">
            <SortAscendingOutlined style={{ color: primaryGreen }} className="mr-2" />
            <span>Sort By</span>
          </Title>
          <Select
            placeholder="Sort order"
            value={sortOrder}
            onChange={onSortOrderChange}
            allowClear
            style={{ width: '100%' }}
            className="rounded-md"
            size="large"
          >
            <Option value="name-asc">Name (A-Z)</Option>
            <Option value="name-desc">Name (Z-A)</Option>
            <Option value="price-asc">Price (Low to High)</Option>
            <Option value="price-desc">Price (High to Low)</Option>
            <Option value="newest">Newest First</Option>
          </Select>
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <>
          <Divider className="my-4" style={{ borderColor: borderGreen }} />
          <div style={{ backgroundColor: lightGreen }} className="p-3 rounded-md">
            <Text style={{ color: darkGreen }}>
              <FilterOutlined className="mr-1" /> 
              Active Filters: {activeFiltersCount}
              {selectedCategory && (
                <span className="ml-2">• Category: 
                  <Tag color={primaryGreen} style={{ marginLeft: '4px' }}>{selectedCategory}</Tag>
                </span>
              )}
              {stockFilter !== null && (
                <span className="ml-2">• Status: {
                  stockFilter ? 
                  <Tag color={primaryGreen} style={{ marginLeft: '4px' }}>In Stock</Tag> : 
                  <Tag color="red" style={{ marginLeft: '4px' }}>Out of Stock</Tag>
                }
                </span>
              )}
              {priceRange && (
                <span className="ml-2">• Price: 
                  <Tag color={primaryGreen} style={{ marginLeft: '4px' }}>{priceRange}</Tag>
                </span>
              )}
              {sortOrder && (
                <span className="ml-2">• Sorted by: 
                  <Tag color={primaryGreen} style={{ marginLeft: '4px' }}>{sortOrder}</Tag>
                </span>
              )}
            </Text>
          </div>
        </>
      )}
    </Card>
  );
};

// Add default props
FilterPanel.defaultProps = {
  categories: [],
  selectedCategory: null,
  stockFilter: null,
  priceRange: null,
  sortOrder: null,
  onCategoryChange: () => {},
  onStockFilterChange: () => {},
  onResetFilters: () => {},
  onPriceRangeChange: () => {},
  onSortOrderChange: () => {}
};

export default FilterPanel;