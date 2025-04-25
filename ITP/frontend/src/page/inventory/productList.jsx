import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, Select, Tag, Popconfirm, message, Image, 
  Typography, Card, Divider, Badge, Layout, Modal, Descriptions, Carousel
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  FilterOutlined, ReloadOutlined, EyeOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import InventoryNavBar from "../../page/inventory/component/Adminnavbar";
import AddProductModal from './component/AddProductModal';
import EditProductModal from './component/EditProductModal';
import FilterPanel from './component/FilterPanel';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Content } = Layout;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [stockFilter, setStockFilter] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  
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
      const response = await fetch(`http://localhost:3000/api/product/${id}`, {
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
  
  // Filter products based on search text, category, stock status, and price range
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        item => item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filter by category
    if (filteredCategory) {
      filtered = filtered.filter(
        item => item.category === filteredCategory
      );
    }
    
    // Filter by stock status
    if (stockFilter !== null) {
      filtered = filtered.filter(
        item => item.inStock === stockFilter
      );
    }
    
    // Filter by price range
    if (priceRange) {
      switch(priceRange) {
        case 'under-10':
          filtered = filtered.filter(item => item.price < 10);
          break;
        case '10-50':
          filtered = filtered.filter(item => item.price >= 10 && item.price <= 50);
          break;
        case '50-100':
          filtered = filtered.filter(item => item.price > 50 && item.price <= 100);
          break;
        case 'over-100':
          filtered = filtered.filter(item => item.price > 100);
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    if (sortOrder) {
      switch(sortOrder) {
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // Assuming there's a createdAt field, otherwise this needs to be adjusted
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }
    
    return filtered;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchText('');
    setFilteredCategory(null);
    setStockFilter(null);
    setPriceRange(null);
    setSortOrder(null);
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

  // Handle view product
  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };
  
  // After successful add/edit, refresh products
  const onProductUpdated = () => {
    fetchProducts();
  };
  
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
          style={{ objectFit: 'cover', borderRadius: '6px' }}
          fallback="/api/placeholder/60/60"
          preview={false}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>
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
      render: (offerPrice, record) => (
        <span className={record.price > offerPrice ? "text-green-600 font-medium" : ""}>
          ${offerPrice.toFixed(2)}
        </span>
      ),
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            size="small"
            style={{ backgroundColor: "#10b981" }}
            onClick={() => handleViewProduct(record)}
          />
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

  return (
    <Layout className="flex flex-row min-h-screen">
      {/* Left Sidebar - Your InventoryNavBar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <InventoryNavBar />
      </div>
      
      {/* Right Content Area */}
      <Content className="p-6 bg-gray-50 flex-1">
        <Card className="shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="mb-0">Product Management</Title>
              <Paragraph className="text-gray-500 mt-1">View and manage all products</Paragraph>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddProduct}
              size="large"
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
                  prefix={<SearchOutlined className="text-gray-400" />}
                  style={{ width: 250 }}
                  allowClear
                  size="large"
                  className="rounded-lg"
                />
                
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  size="large"
                  className="rounded-lg"
                  style={{ 
                    backgroundColor: showFilterPanel ? "#10b981" : "",
                    color: showFilterPanel ? "white" : "" 
                  }}
                >
                  {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={resetFilters}
                  size="large"
                  className="rounded-lg"
                >
                  Reset
                </Button>
              </div>
              
              <div>
                <Badge 
                  count={getFilteredProducts().length} 
                  style={{ backgroundColor: '#10b981' }}
                  className="p-2"
                >
                  <span className="text-gray-600 mr-2 text-base">Total Products:</span>
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
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                onResetFilters={resetFilters}
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: true }}
            className="shadow-sm rounded-lg"
            rowClassName="hover:bg-gray-50"
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

        {/* View Product Modal */}
        {showViewModal && currentProduct && (
          <Modal
            visible={showViewModal}
            title={
              <div className="flex items-center">
                <InfoCircleOutlined className="mr-2 text-green-500" />
                <span>Product Details</span>
              </div>
            }
            onCancel={() => setShowViewModal(false)}
            footer={[
              <Button key="close" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            ]}
            width={800}
            centered
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Product Images */}
              <div className="border rounded-lg p-4 bg-white">
                {currentProduct.image && currentProduct.image.length > 0 ? (
                  <Carousel autoplay className="bg-gray-100 rounded-lg overflow-hidden">
                    {currentProduct.image.map((img, index) => (
                      <div key={index} className="h-64 flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`${currentProduct.name} - Image ${index + 1}`}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          fallback="/api/placeholder/300/300"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src="/api/placeholder/300/300"
                      alt="No product image"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>

              {/* Right side - Product Details */}
              <div>
                <Descriptions 
                  bordered 
                  column={1} 
                  size="small" 
                  className="bg-white rounded-lg"
                  labelStyle={{ fontWeight: 'bold', width: '100px' }}
                >
                  <Descriptions.Item label="Name">{currentProduct.name}</Descriptions.Item>
                  <Descriptions.Item label="Category">
                    <Tag color={getCategoryColor(currentProduct.category)}>{currentProduct.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">${currentProduct.price.toFixed(2)}</Descriptions.Item>
                  <Descriptions.Item label="Offer Price">
                    <span className={currentProduct.price > currentProduct.offerPrice ? "text-green-600 font-medium" : ""}>
                      ${currentProduct.offerPrice.toFixed(2)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {currentProduct.inStock ? (
                      <Tag color="green">In Stock</Tag>
                    ) : (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Bottom section - Product Description */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <Card 
                  title="Product Description" 
                  className="bg-green-50 border-green-200"
                  headStyle={{ backgroundColor: '#10b981', color: 'white' }}
                >
                  <Paragraph className="mb-0">
                    {currentProduct.description || "No description available for this product."}
                  </Paragraph>
                </Card>
              </div>
            </div>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default ProductList;