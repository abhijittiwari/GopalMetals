'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string | null;
  price: number | null;
  categoryId: string;
  featured: boolean;
  features: string | null;
  applications: string | null;
  materials: string | null;
  thickness: string | null;
  specifications: string | null;
  createdAt: string;
  category: {
    name: string;
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // New product form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    featured: false,
    images: '',
    features: '',
    applications: '',
    materials: '',
    thickness: '',
    specifications: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real application, these would be actual API calls
        // For now, we'll simulate a response
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  // Handle upload method change
  const handleUploadMethodChange = (method: 'url' | 'file') => {
    setUploadMethod(method);
    // Clear image file when switching to URL method
    if (method === 'url') {
      setImageFile(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.images;

      // If using file upload and there's a file selected, upload it first
      if (uploadMethod === 'file' && imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('type', 'products');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: imageUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      const newProduct = await response.json();
      
      // Add the new product to the list
      setProducts(prev => [...prev, newProduct]);
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        categoryId: '',
        featured: false,
        images: '',
        features: '',
        applications: '',
        materials: '',
        thickness: '',
        specifications: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Close form
      setIsFormOpen(false);
      
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please try again.');
    }
  };
  
  // Handle product deletion
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Remove product from list
      setProducts(prev => prev.filter(product => product.id !== productId));
      
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  return (
    <div>
      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isFormOpen ? 'Cancel' : 'Add Product'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Add Product Form */}
          {isFormOpen && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        id="categoryId"
                        name="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <fieldset>
                      <legend className="text-base font-medium text-gray-700">Product Image</legend>
                      <div className="mt-2 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="url-option"
                            name="upload-method"
                            type="radio"
                            checked={uploadMethod === 'url'}
                            onChange={() => handleUploadMethodChange('url')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label htmlFor="url-option" className="ml-3 block text-sm font-medium text-gray-700">
                            Image URL
                          </label>
                        </div>
                        
                        {uploadMethod === 'url' && (
                          <div>
                            <input
                              type="text"
                              name="images"
                              id="images"
                              value={formData.images}
                              onChange={handleChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        )}

                        <div className="flex items-center">
                          <input
                            id="file-option"
                            name="upload-method"
                            type="radio"
                            checked={uploadMethod === 'file'}
                            onChange={() => handleUploadMethodChange('file')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label htmlFor="file-option" className="ml-3 block text-sm font-medium text-gray-700">
                            Upload Image
                          </label>
                        </div>
                        
                        {uploadMethod === 'file' && (
                          <div>
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                          </div>
                        )}
                      </div>
                    </fieldset>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <div className="relative h-48 w-full border rounded-md overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Product image preview"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="featured" className="font-medium text-gray-700">
                          Featured Product
                        </label>
                        <p className="text-gray-500">
                          Featured products will be displayed prominently on the homepage.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Features Section */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Product Details</h4>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                        Unique Features
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Enter each feature on a new line.
                      </p>
                      <textarea
                        id="features"
                        name="features"
                        rows={4}
                        value={formData.features}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Evenly spaced round-shaped holes punched through metal sheets."
                      />
                    </div>
                    
                    {/* Applications */}
                    <div className="mb-4">
                      <label htmlFor="applications" className="block text-sm font-medium text-gray-700 mb-1">
                        Applications
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Enter each application on a new line in the format "Type: Description".
                      </p>
                      <textarea
                        id="applications"
                        name="applications"
                        rows={4}
                        value={formData.applications}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Filtration and Separation: Used in filters, screens, and sieves."
                      />
                    </div>
                    
                    {/* Materials */}
                    <div className="mb-4">
                      <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                        Materials Available
                      </label>
                      <input
                        type="text"
                        id="materials"
                        name="materials"
                        value={formData.materials}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="SS/GI/MS"
                      />
                    </div>
                    
                    {/* Thickness */}
                    <div className="mb-4">
                      <label htmlFor="thickness" className="block text-sm font-medium text-gray-700 mb-1">
                        Sheet Thickness (mm)
                      </label>
                      <input
                        type="text"
                        id="thickness"
                        name="thickness"
                        value={formData.thickness}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.5mm - 10mm"
                      />
                    </div>
                    
                    {/* Specifications */}
                    <div className="mb-4">
                      <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Specifications
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Enter each specification on a new line in the format "Key: Value".
                      </p>
                      <textarea
                        id="specifications"
                        name="specifications"
                        rows={4}
                        value={formData.specifications}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Hole Size: 1mm - 25mm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Products Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  {loading ? (
                    <div className="bg-white px-4 py-5 text-center">
                      <p className="text-gray-500">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="bg-white px-4 py-5 text-center">
                      <p className="text-gray-500">No products found. Add your first product to get started.</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {product.images ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={product.images}
                                      alt={product.name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-sm">No img</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.price ? `₹${product.price.toFixed(2)}` : '—'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.featured ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Featured
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Standard
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}