import React from 'react';
import { Card, Select, Space, Typography, Radio } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const FilterPanel = ({ 
  categories, 
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockFilterChange
}) => {
  return (
    <Card className="mb-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Title level={5}>Filter by Category</Title>
          <Select
            placeholder="Select a category"
            value={selectedCategory}
            onChange={onCategoryChange}
            allowClear
            style={{ width: '100%' }}
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>
        
        <div>
          <Title level={5}>Filter by Stock Status</Title>
          <Radio.Group 
            value={stockFilter} 
            onChange={(e) => onStockFilterChange(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value={null}>All</Radio>
              <Radio value={true}>In Stock</Radio>
              <Radio value={false}>Out of Stock</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;