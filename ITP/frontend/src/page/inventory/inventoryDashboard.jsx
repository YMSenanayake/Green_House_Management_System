import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, ShoppingBag, DollarSign, TrendingUp, Package, Clock } from 'lucide-react';
import InventoryNavBar from "../../page/inventory/component/Adminnavbar";

const InventoryDashboard = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product data
    const fetchData = async () => {
      try {
        // Make the API call
        const response = await fetch('http://localhost:3000/api/product');
        const data = await response.json();
        
        if (data.success && data.products) {
          // Process the API response data
          const products = data.products;
          
          // Calculate totals
          const totalProducts = products.length;
          const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
          const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
          const inStock = products.filter(product => product.inStock).length;
          const outOfStock = products.filter(product => !product.inStock).length;
          
          // Get category distribution
          const categoryMap = {};
          products.forEach(product => {
            const category = product.category || 'Uncategorized';
            categoryMap[category] = (categoryMap[category] || 0) + 1;
          });
          
          const categoryData = Object.keys(categoryMap).map(name => ({
            name,
            count: categoryMap[name]
          }));
          
          // Get latest products (3 most recent)
          const latestProducts = [...products]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
          
          // Create the stock data for the pie chart
          const stockData = [
            { name: 'In Stock', value: inStock },
            { name: 'Out of Stock', value: outOfStock }
          ];
          
          // Set the processed data
          setProductData({
            totalProducts,
            totalValue,
            averagePrice,
            inStock,
            outOfStock,
            categoryData,
            latestProducts,
            stockData
          });
        } else {
          console.error('Invalid API response format:', data);
          setMockData();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setMockData();
        setLoading(false);
      }
    };
    
    // Fallback to mock data if API fails
    const setMockData = () => {
      setProductData({
        totalProducts: 73,
        totalValue: 3005.99,
        averagePrice: 41.18,
        inStock: 72,
        outOfStock: 1,
        categoryData: [
          { name: 'Fruits', count: 10 },
          { name: 'Dairy', count: 10 },
          { name: 'Bakery', count: 5 },
          { name: 'Vegetables', count: 9 },
          { name: 'Drinks', count: 9 },
          { name: 'Instant', count: 11 },
          { name: 'Grains', count: 10 },
          { name: 'Electronics', count: 8 },
          { name: 'Smart Devices', count: 1 }
        ],
        latestProducts: [
          { 
            name: "Strawberries",
            category: "Fruits", 
            price: 120, 
            offerPrice: 80,
            inStock: true,
            image: ["https://res.cloudinary.com/drv8misnw/image/upload/v1745430606/fpjyrygighsbe5taswuk.jpg"]
          },
          { 
            name: "Orange Juice",
            category: "Drinks", 
            price: 23, 
            offerPrice: 20,
            inStock: true,
            image: ["https://res.cloudinary.com/drv8misnw/image/upload/v1745427072/pujxy4vthdoepsi6ppv7.png"]
          },
          { 
            name: "Grow More Bloom Special",
            category: "Instant", 
            price: 48, 
            offerPrice: 45,
            inStock: true,
            image: ["https://res.cloudinary.com/drv8misnw/image/upload/v1745428240/eesz93mez5y5bksbfrjn.webp"]
          }
        ],
        stockData: [
          { name: 'In Stock', value: 72 },
          { name: 'Out of Stock', value: 1 }
        ]
      });
    };
    
    // Call the fetch function
    fetchData();
  }, []);

  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#2E7D32', '#1B5E20', '#81C784', '#A5D6A7', '#C8E6C9', '#388E3C'];
  const STOCK_COLORS = ['#4CAF50', '#F44336'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-green-600 text-xl font-semibold">Loading inventory data...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Navigation */}
      <div className="w-64 min-h-screen">
        <InventoryNavBar />
      </div>

      {/* Right Side - Dashboard Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Inventory Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Products</h3>
              <p className="text-2xl font-bold text-gray-800">{productData.totalProducts}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Inventory Value</h3>
              <p className="text-2xl font-bold text-gray-800">${productData.totalValue.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <AlertCircle className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Out of Stock Items</h3>
              <p className="text-2xl font-bold text-gray-800">{productData.outOfStock}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">Product Categories</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData.categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Products" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Stock Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">Stock Status</h2>
            <div className="h-80 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData.stockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productData.stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STOCK_COLORS[index % STOCK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-800">Latest Products</h2>
            <a href="/productlist" className="text-green-600 font-medium hover:underline flex items-center">
              <span>View All</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productData.latestProducts.map((product, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
           
<div className="h-48 bg-gray-200 flex flex-col items-center justify-center text-center px-2">
  {product.image && product.image.length > 0 ? (
    <img
      src={product.image[0]}
      alt={product.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/images/image-not-found.png";
      }}
    />
  ) : (
    <>
      <img
        src="/images/image-not-found.png"
        alt="Image not available"
        className="w-24 h-24 object-contain mb-2"
      />
      <p className="text-sm text-gray-500">Image not available</p>
    </>
  )}
</div>


                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                  <div className="flex items-center">
                    <span className="text-green-700 font-bold">${product.offerPrice.toFixed(2)}</span>
                    {product.price !== product.offerPrice && (
                      <span className="text-gray-400 line-through ml-2 text-sm">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;