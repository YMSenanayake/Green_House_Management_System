import React, { useState } from 'react';
import { 
  Modal, Form, Input, InputNumber, Select, 
  Button, message, Space, Divider, Image, Tooltip, Card, Typography
} from 'antd';
import { 
  PlusOutlined, MinusCircleOutlined, LinkOutlined, 
  SaveOutlined, CloseOutlined, CheckCircleOutlined, 
  EyeOutlined, DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const AddProductModal = ({ visible, onCancel, onSuccess, categories = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // Theme colors
  const themeColors = {
    primary: '#4caf50',
    secondary: '#2e7d32',
    light: '#e8f5e9',
    border: '#a5d6a7',
    danger: '#f44336'
  };

  // Handle form submission
  const onFinish = async (values) => {
    // Format the data for API submission
    const formattedValues = {
      name: values.name,
      description: values.description || [''], // Ensure description is an array
      price: values.price,
      offerPrice: values.offerPrice,
      image: imageUrls, // Use the image URLs array
      category: values.category,
      inStock: values.stockStatus === 'in-stock' // Convert dropdown to boolean
    };

    // Sample payload format for reference
    /* {
      "name": "Smart Indoor Plant Sensor",
      "description": [
        "Monitors soil moisture, temperature, and light",
        "Compatible with Android and iOS",
        "Real-time alerts and insights"
      ],
      "price": 79.99,
      "offerPrice": 59.99,
      "image": [
        "https://example.com/images/plant-sensor1.jpg",
        "https://example.com/images/plant-sensor2.jpg"
      ],
      "category": "Smart Devices",
      "inStock": true
    } */

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/product/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        message.success({
          content: 'Product added successfully!',
          icon: <CheckCircleOutlined style={{ color: themeColors.primary }} />,
          duration: 3
        });

        // Reset form and state
        form.resetFields();
        setImageUrls([]);
        setNewImageUrl('');
        
        // Call onSuccess to refresh product list
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data.product || formattedValues);
        }
        
        // Close the modal
        onCancel();
      } else {
        message.error(data.message || 'Failed to add product!');
      }
    } catch (error) {
      message.error('An error occurred while adding the product!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add new image URL to the list
  const handleAddImageUrl = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl('');
    } else if (imageUrls.includes(newImageUrl)) {
      message.warning('This image URL already exists in the list');
    } else if (!newImageUrl) {
      message.warning('Please enter an image URL');
    }
  };

  // Remove image URL from the list
  const handleRemoveImageUrl = (url) => {
    setImageUrls(imageUrls.filter(item => item !== url));
  };

  // Preview image
  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // Handle Enter key in URL input
  const handleUrlInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImageUrl();
    }
  };

  // Get all available categories or use default ones if none provided
  const availableCategories = categories.length > 0 ? categories : [
    'Vegetables', 'Fruits', 'Drinks', 'Dairy', 'Bakery', 'Instant', 'Grains', 'Smart Devices'
  ];

  return (
    <Modal
      title={
        <div style={{ color: themeColors.secondary }}>
          <Title level={4} style={{ margin: 0, color: themeColors.secondary }}>
            Add New Product
          </Title>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered={true} // Center the modal on the page
      bodyStyle={{ 
        maxHeight: '80vh', 
        overflow: 'auto',
        padding: '24px'
      }}
      style={{ 
        top: 20, // Add some top margin for better positioning
      }}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }} // Darker overlay for better focus
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          stockStatus: 'in-stock',
          description: ['']
        }}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter the product name!' }]}
        >
          <Input 
            placeholder="Enter product name" 
            style={{ borderColor: themeColors.border }}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Form.List name="description">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space 
                    key={field.key} 
                    style={{ display: 'flex', marginBottom: 8 }} 
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      rules={[{ required: true, message: 'Please enter description point or delete this field.' }]}
                      style={{ width: '100%' }}
                    >
                      <Input 
                        placeholder={`Description point ${index + 1}`}
                        style={{ borderColor: themeColors.border }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined 
                        onClick={() => remove(field.name)} 
                        style={{ color: themeColors.danger }}
                      />
                    ) : null}
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    style={{ borderColor: themeColors.border, color: themeColors.secondary }}
                  >
                    Add description point
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the price!' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%', borderColor: themeColors.border }}
              placeholder="Enter price"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="offerPrice"
            label="Offer Price"
            rules={[{ required: true, message: 'Please enter the offer price!' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%', borderColor: themeColors.border }}
              placeholder="Enter offer price"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select 
              placeholder="Select a category"
              style={{ borderColor: themeColors.border }}
              dropdownStyle={{ borderColor: themeColors.border }}
            >
              {availableCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
              <Option key="new-category" value="new-category">+ Add New Category</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="stockStatus"
            label="Stock Status"
            rules={[{ required: true, message: 'Please select stock status!' }]}
          >
            <Select
              placeholder="Select stock status"
              style={{ borderColor: themeColors.border }}
            >
              <Option value="in-stock">
                <Space>
                  <CheckCircleOutlined style={{ color: themeColors.primary }} />
                  In Stock
                </Space>
              </Option>
              <Option value="out-of-stock">
                <Space>
                  <CloseOutlined style={{ color: themeColors.danger }} />
                  Out of Stock
                </Space>
              </Option>
            </Select>
          </Form.Item>
        </div>

        {/* Image URL Section */}
        <Form.Item
          label={
            <div className="flex items-center">
              <span>Product Images</span> 
              <Tooltip title="Add URLs to your product images">
                <LinkOutlined style={{ marginLeft: 8, color: themeColors.secondary }} />
              </Tooltip>
            </div>
          }
          required
        >
          <Card 
            title="Add Product Images" 
            headStyle={{ backgroundColor: themeColors.light, color: themeColors.secondary }}
            style={{ marginBottom: 16, borderColor: themeColors.border }}
          >
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image 
                      src={url}
                      alt={`Product image ${index + 1}`}
                      width="100%"
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                      fallback="/api/placeholder/120/120"
                      preview={false}
                      onClick={() => handlePreview(url)}
                    />
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <Space>
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />} 
                          onClick={() => handlePreview(url)}
                          style={{ color: 'white' }}
                        />
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => handleRemoveImageUrl(url)}
                          style={{ color: 'white' }}
                        />
                      </Space>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">No images added yet</div>
            )}

            <div className="flex mt-4">
              <Input 
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={handleUrlInputKeyPress}
                style={{ borderColor: themeColors.border }}
                prefix={<LinkOutlined style={{ color: themeColors.secondary }} />}
              />
              <Button 
                type="primary" 
                onClick={handleAddImageUrl}
                style={{ marginLeft: 8, backgroundColor: themeColors.primary, borderColor: themeColors.secondary }}
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </div>
          </Card>
        </Form.Item>

        <Divider style={{ borderColor: themeColors.border }} />

        <Form.Item className="text-right">
          <Space>
            <Button 
              onClick={onCancel}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                backgroundColor: themeColors.primary, 
                borderColor: themeColors.secondary,
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              icon={<SaveOutlined />}
              size="large"
            >
              Add Product
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default AddProductModal;