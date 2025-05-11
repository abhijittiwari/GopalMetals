'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function EditProduct({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  // Form state
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

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch product
        const productResponse = await fetch(`/api/products/${params.id}`);
        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }

        const productData = await productResponse.json();
        setProduct(productData);

        // Initialize form data
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description || '',
          price: productData.price ? productData.price.toString() : '',
          categoryId: productData.categoryId,
          featured: productData.featured,
          images: productData.images || '',
          features: productData.features || '',
          applications: productData.applications || '',
          materials: productData.materials || '',
          thickness: productData.thickness || '',
          specifications: productData.specifications || ''
        });

        // Set upload method based on whether there's an image URL
        setUploadMethod(productData.images ? 'url' : 'file');
        
        // Set image preview if available
        if (productData.images) {
          setImagePreview(productData.images);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError((error as Error).message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

    // Auto-generate slug from name if it hasn't been manually edited
    if (name === 'name' && formData.slug === product?.slug) {
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
    setError('');
    setSuccess('');
    setSaving(true);

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

      // Prepare data for API
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        images: imageUrl
      };

      // Update product
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setSuccess('Product updated successfully!');

      // Redirect after successful update
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);

    } catch (error) {
      console.error('Error updating product:', error);
      setError((error as Error).message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Gopal Metals Admin</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href="/admin/categories"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
            <Link
              href="/admin/products"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Products
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700" role="alert">
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 text-green-700" role="alert">
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
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
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor="url-option" className="ml-3 block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                          </div>
                          
                          {uploadMethod === 'url' && (
                            <div>
                              <input
                                type="url"
                                name="images"
                                id="images"
                                value={formData.images}
                                onChange={handleChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
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
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                            <Image
                              src={imagePreview}
                              alt="Product image preview"
                              fill
                              style={{ objectFit: 'contain' }}
                              className="rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="featured" className="font-medium text-gray-700">
                            Featured Product
                          </label>
                          <p className="text-gray-500">Display this product on the homepage</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>

              {/* Structured Product Information */}
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                
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

              {/* Save buttons */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
 