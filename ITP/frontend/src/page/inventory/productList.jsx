import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, Select, Tag, Popconfirm, message, Image, 
  Typography, Card, Divider, Badge, Layout, Modal, Descriptions, Carousel
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  FilterOutlined, ReloadOutlined, EyeOutlined, InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import InventoryNavBar from "../../page/inventory/component/Adminnavbar";
import AddProductModal from './component/AddProductModal';
import EditProductModal from './component/EditProductModal';
import FilterPanel from './component/FilterPanel';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    // Add CSS for progress bar used in the report generation
    if (!document.getElementById('report-styles')) {
      const style = document.createElement('style');
      style.id = 'report-styles';
      style.innerHTML = `
        .progress-container {
          margin-top: 15px;
          width: 100%;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar {
         margin-top: 15px;
          height: 6px;
          background-color: #10b981;
          width: 0%;
          animation: progress 1.5s ease-in-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          90% { width: 95%; }
          100% { width: 95%; }
        }
      `;
      document.head.appendChild(style);
    }
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
      'Electronics': 'volcano',
      'Smart Devices': 'geekblue'
    };
    
    return colors[category] || 'default';
  };
  
  // Generate PDF Report
  const generateReport = () => {
    // Get current user or use fallback
    const currentUser = window.currentUser || 
      JSON.parse(localStorage.getItem('currentUser') || 'null') || 
      { fullName: 'System User' };
  
    // Check for data availability
    if (!products || products.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Data Available",
        text: "There are no products available to generate a report.",
        confirmButtonColor: "#10b981"
      });
      return;
    }
    
    // Confirm report generation
    Swal.fire({
      title: "Generate Products Report",
      html: "Do you want to create a <b>PDF report</b> containing all product data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "<i class='fas fa-file-pdf'></i> Generate Report"
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Generating Report",
          html: "<div class='progress-container'><div class='progress-bar'></div></div>",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        
        setTimeout(() => {
          try {
            // Initialize PDF document
            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Define color scheme
            const colors = {
              primary: [16, 185, 129],  // #10b981 in RGB
              secondary: [240, 249, 245],
              text: [51, 51, 51],
              text2: [255, 255, 255]
            };
            
            // Calculate pagination
            const rowsPerPage = 25;
            const totalPages = Math.ceil(products.length / rowsPerPage) || 1;
            
            // Add header function
            const addHeader = () => {
              // Header background
              doc.setFillColor(...colors.primary, 0.1);
              doc.rect(0, 0, pageWidth, 35, 'F');
              
              // Add title
              doc.setFont("helvetica", "bold");
              doc.setFontSize(18);
              doc.setTextColor(...colors.primary);
              doc.text("GreenStore Product Inventory Report", pageWidth / 2, 22, { align: "center" });
              
              // Add metadata
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(100, 100, 100);
              doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 15, { align: "right" });
            };
            
            // Add footer function
            const addFooter = (pageNum) => {
              doc.setFillColor(...colors.primary);
              doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
              
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(9);
              doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
              doc.text("© " + new Date().getFullYear() + " GreenStore", 15, pageHeight - 5);
              doc.text("Confidential", pageWidth - 15, pageHeight - 5, { align: "right" });
            };
            
            // Add summary section
            const addSummary = (y) => {
              // Calculate category distribution and stock status
              const categories = {};
              let inStock = 0;
              let outOfStock = 0;
              let totalValue = 0;
              
              products.forEach(product => {
                const category = product.category || "Uncategorized";
                categories[category] = (categories[category] || 0) + 1;
                
                if (typeof product.inStock !== 'undefined') {
                  product.inStock ? inStock++ : outOfStock++;
                }
                
                totalValue += product.price || 0;
              });
              
              // Draw summary container
              doc.setFillColor(...colors.secondary);
              doc.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'F');
              
              // Summary header
              doc.setFillColor(...colors.primary);
              doc.roundedRect(15, y, pageWidth - 30, 8, 3, 3, 'F');
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.setTextColor(255, 255, 255);
              doc.text("INVENTORY SUMMARY", pageWidth / 2, y + 5.5, { align: "center" });
              
              // Two-column layout
              const col1X = 25;
              const col2X = pageWidth / 2 + 10;
              
              // Product statistics - left column
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(...colors.primary);
              doc.text("Product Statistics:", col1X, y + 15);
              
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              doc.text(`Total Products: ${products.length}`, col1X, y + 21);
              doc.text(`In Stock: ${inStock} (${Math.round(inStock/products.length*100)}%)`, col1X, y + 26);
              doc.text(`Out of Stock: ${outOfStock} (${Math.round(outOfStock/products.length*100)}%)`, col1X, y + 31);
              
              // Category distribution - right column
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(...colors.primary);
              doc.text("Top Categories:", col2X, y + 15);
              
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              
              // Get top 3 categories
              const topCategories = Object.entries(categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
              
              let categoryY = y + 21;
              topCategories.forEach(([category, count]) => {
                const percentage = Math.round((count / products.length) * 100);
                doc.text(`${category}: ${count} (${percentage}%)`, col2X, categoryY);
                categoryY += 5;
              });
              
              return y + 40;
            };
            
            // Table data setup
            const headers = ["Name", "Category", "Price ($)", "Offer Price ($)", "Stock Status"];
            const tableData = products.map((product) => [
              product.name || "—",
              product.category || "—",
              product.price ? product.price.toFixed(2) : "—",
              product.offerPrice ? product.offerPrice.toFixed(2) : "—",
              product.inStock ? "In Stock" : "Out of Stock",
            ]);
            
            // Generate table with styling
            autoTable(doc, {
              head: [headers],
              body: tableData,
              startY: 100,
              theme: "grid",
              headStyles: {
                fillColor: colors.primary,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: "bold",
                halign: 'center',
              },
              bodyStyles: {
                textColor: colors.text,
                fontSize: 9,
              },
              alternateRowStyles: {
                fillColor: colors.secondary
              },
              columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 35, halign: 'center' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 30, halign: 'center' }
              },
              margin: { top: 40, right: 15, bottom: 25, left: 15 },
              didDrawPage: (data) => {
                addHeader();
                addFooter(doc.internal.getNumberOfPages());
                
                // Only add summary on first page
                if (data.pageNumber === 1) {
                  addSummary(40);
                }
              },
              didDrawCell: (data) => {
                // Style status cells
                if (data.section === 'body' && data.column.index === 4) {
                  const status = data.cell.text[0];
                  if (status === 'Out of Stock') {
                    doc.setFillColor(250, 230, 230);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.setTextColor(220, 53, 69);
                    doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                      align: 'center',
                      baseline: 'middle'
                    });
                  } else if (status === 'In Stock') {
                    doc.setFillColor(230, 250, 230);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.setTextColor(...colors.primary);
                    doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                      align: 'center',
                      baseline: 'middle'
                    });
                  }
                }
              }
            });
            
            // Save PDF with timestamp in filename
            const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
            const filename = `GreenStore_Products_Report_${timestamp}.pdf`;
            doc.save(filename);
            
            // Success message
            Swal.fire({
              icon: "success",
              title: "Report Generated Successfully!",
              html: `<p>Your report has been saved as: <b>${filename}</b></p>`,
              confirmButtonColor: "#10b981"
            });
            
            console.log(`Product report generated: ${filename} by ${currentUser.fullName}`);
            
          } catch (error) {
            console.error("PDF Generation Error:", error);
            
            // Error handling
            Swal.fire({
              icon: "error",
              title: "Report Generation Failed",
              text: `Error: ${error.message || "Unknown error"}`,
              confirmButtonColor: "#10b981",
              confirmButtonText: "Try Again",
              showCancelButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => generateReport(), 500);
              }
            });
          }
        }, 1000);
      }
    });
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

  // Custom table styles to remove borders
  const tableStyles = {
    // Remove table border
    border: 'none',
    // Remove header border
    headerBorder: 'none',
    // Custom styles for table cells
    tableCell: {
      borderBottom: '1px solid #f0f0f0', // Lighter border for row separation
      padding: '12px 16px',
    }
  };

  return (
    <Layout className="flex flex-row min-h-screen">
      {/* Left Sidebar - Your InventoryNavBar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <InventoryNavBar />
      </div>
      
      {/* Right Content Area */}
      <Content className="p-6 bg-gray-50 flex-1">
        <Card className="shadow-md rounded-lg" bordered={false}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="mb-0">Product Management</Title>
              <Paragraph className="text-gray-500 mt-1">View and manage all products</Paragraph>
            </div>
            <Space>
              <Button 
                type="primary" 
                icon={<FileTextOutlined />} 
                onClick={generateReport}
                size="large"
                style={{ backgroundColor: "#10b981" }}
              >
                Generate Report
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddProduct}
                size="large"
              >
                Add Product
              </Button>
            </Space>
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
            className="rounded-lg"
            rowClassName="hover:bg-gray-50"
            bordered={false}
            style={tableStyles}
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
                    {currentProduct.description && Array.isArray(currentProduct.description)
                      ? currentProduct.description.map((desc, index) => (
                          <div key={index}>{desc}</div>
                        ))
                      : currentProduct.description || "No description available for this product."}
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