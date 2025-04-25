import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, Select, Tag, Popconfirm, message, Image, 
  Typography, Card, Divider, Badge, Layout
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  FilterOutlined, ReloadOutlined
} from '@ant-design/icons';
import InventoryNavBar from "../../page/inventory/component/Adminnavbar";
import AddProductModal from './component/AddProductModal';
import EditProductModal from './component/EditProductModal';
import FilterPanel from './component/FilterPanel';

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [stockFilter, setStockFilter] = useState(null);
  
  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/product');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.products.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      message.error('Failed to fetch products!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Delete product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        message.success('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      message.error('Failed to delete product!');
      console.error(error);
    }
  };
  
  // Filter products based on search text and category
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    if (searchText) {
      filtered = filtered.filter(
        item => item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (filteredCategory) {
      filtered = filtered.filter(
        item => item.category === filteredCategory
      );
    }
    
    if (stockFilter !== null) {
      filtered = filtered.filter(
        item => item.inStock === stockFilter
      );
    }
    
    return filtered;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchText('');
    setFilteredCategory(null);
    setStockFilter(null);
    setShowFilterPanel(false);
  };
  
  // Handle add product
  const handleAddProduct = () => {
    setShowAddModal(true);
  };
  
  // Handle edit product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };
  
  // After successful add/edit, refresh products
  const onProductUpdated = () => {
    fetchProducts();
  };
  
  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (images) => (
        <Image 
          src={images && images.length > 0 ? images[0] : '/api/placeholder/60/60'} 
          alt="Product"
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
          fallback="/api/placeholder/60/60"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Offer Price',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      render: (offerPrice) => `$${offerPrice.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock) => (
        inStock ? 
        <Tag color="green">In Stock</Tag> : 
        <Tag color="red">Out of Stock</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Get color for category tag
  const getCategoryColor = (category) => {
    const colors = {
      'Vegetables': 'green',
      'Fruits': 'orange',
      'Drinks': 'blue',
      'Dairy': 'cyan',
      'Bakery': 'gold',
      'Instant': 'purple',
      'Grains': 'magenta',
      'Electronics': 'volcano'
    };
    
    return colors[category] || 'default';
  };

  return (
    <Layout className="flex flex-row min-h-screen">
      {/* Left Sidebar - Your InventoryNavBar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <InventoryNavBar />
      </div>
      
      {/* Right Content Area */}
      <Content className="p-6 bg-gray-50 flex-1">
        <Card className="shadow-md">
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>Product Management</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Input
                  placeholder="Search products"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  style={{ width: 250 }}
                  allowClear
                />
                
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                >
                  {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
              
              <div>
                <Badge count={getFilteredProducts().length}>
                  <span className="text-gray-600 mr-2">Total Products:</span>
                </Badge>
              </div>
            </div>
            
            {showFilterPanel && (
              <FilterPanel 
                categories={categories}
                selectedCategory={filteredCategory}
                onCategoryChange={setFilteredCategory}
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
              />
            )}
          </div>
          
          <Table 
            columns={columns} 
            dataSource={getFilteredProducts()}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            scroll={{ x: true }}
          />
        </Card>
        
        {/* Modals */}
        <AddProductModal
          visible={showAddModal}
          onCancel={() => setShowAddModal(false)}
          onSuccess={onProductUpdated}
          categories={categories}
        />
        
        {showEditModal && currentProduct && (
          <EditProductModal
            visible={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onSuccess={onProductUpdated}
            product={currentProduct}
            categories={categories}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ProductList;