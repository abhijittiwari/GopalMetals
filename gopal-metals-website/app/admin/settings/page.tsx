'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { WebsiteSettings, defaultSettings } from '@/lib/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('contact');

  // Set active tab based on URL parameter when it changes
  useEffect(() => {
    if (tabParam && ['contact', 'social', 'images', 'about'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
           
          // Ensure contactFormEmails is always an array
          if (!data.contactInfo.contactFormEmails) {
            data.contactInfo.contactFormEmails = ['info@gopalmetals.com'];
          }
          
          // Ensure aboutInfo exists and has all required properties
          if (!data.aboutInfo) {
            data.aboutInfo = {
              companyDescription: '',
              companyImage: '',
              mission: '',
              vision: '',
              values: [],
            };
          } else {
            // Ensure all aboutInfo properties exist
            data.aboutInfo.companyDescription = data.aboutInfo.companyDescription || '';
            data.aboutInfo.companyImage = data.aboutInfo.companyImage || '';
            data.aboutInfo.mission = data.aboutInfo.mission || '';
            data.aboutInfo.vision = data.aboutInfo.vision || '';
            data.aboutInfo.values = data.aboutInfo.values || [];
          }
           
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setErrorMessage('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle file upload for images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update settings with new image URL
      setSettings({
        ...settings,
        aboutInfo: {
          ...(settings.aboutInfo || {}),
          companyImage: data.url,
        },
      });

      // Show preview
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file upload for logo or hero image
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update settings with new image URL
      if (type === 'logo') {
        setSettings({
          ...settings,
          logo: {
            ...(settings.logo || {}),
            url: data.url,
          },
        });
      } else if (type === 'heroImage') {
        setSettings({
          ...settings,
          heroImage: {
            ...(settings.heroImage || {}),
            url: data.url,
          },
        });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setErrorMessage(`Failed to upload ${type}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      // Ensure contactFormEmails exists before validation or saving
      if (!settings.contactInfo.contactFormEmails) {
        settings.contactInfo = {
          ...settings.contactInfo,
          contactFormEmails: ['info@gopalmetals.com']
        };
      }
      
      // Ensure aboutInfo exists and has all required properties
      if (!settings.aboutInfo) {
        settings.aboutInfo = {
          companyDescription: '',
          companyImage: '',
          mission: '',
          vision: '',
          values: [],
        };
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccessMessage('Settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Website Settings</h1>
            
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`${
                    activeTab === 'contact'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Contact Information
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`${
                    activeTab === 'about'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  About Company
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`${
                    activeTab === 'social'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Social Links
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`${
                    activeTab === 'images'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Images
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={settings.contactInfo.companyName}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            companyName: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="headOffice" className="block text-sm font-medium text-gray-700">
                        Head Office Address
                      </label>
                      <textarea
                        id="headOffice"
                        value={settings.contactInfo.address.headOffice}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            address: {
                              ...settings.contactInfo.address,
                              headOffice: e.target.value,
                            },
                          },
                        })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="corporateOffice" className="block text-sm font-medium text-gray-700">
                        Corporate Office Address
                      </label>
                      <textarea
                        id="corporateOffice"
                        value={settings.contactInfo.address.corporateOffice}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            address: {
                              ...settings.contactInfo.address,
                              corporateOffice: e.target.value,
                            },
                          },
                        })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phoneBangalore" className="block text-sm font-medium text-gray-700">
                          Phone (Bangalore)
                        </label>
                        <input
                          type="text"
                          id="phoneBangalore"
                          value={settings.contactInfo.phone.bangalore}
                          onChange={(e) => setSettings({
                            ...settings,
                            contactInfo: {
                              ...settings.contactInfo,
                              phone: {
                                ...settings.contactInfo.phone,
                                bangalore: e.target.value,
                              },
                            },
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phoneHyderabad" className="block text-sm font-medium text-gray-700">
                          Phone (Corporate Office)
                        </label>
                        <input
                          type="text"
                          id="phoneHyderabad"
                          value={settings.contactInfo.phone.hyderabad}
                          onChange={(e) => setSettings({
                            ...settings,
                            contactInfo: {
                              ...settings.contactInfo,
                              phone: {
                                ...settings.contactInfo.phone,
                                hyderabad: e.target.value,
                              },
                            },
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={settings.contactInfo.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            email: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Form Recipients
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        Add email addresses that will receive messages from the contact form. At least one email is required.
                      </p>
                      
                      <div className="mt-2">
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newEmail || !newEmail.trim()) return;
                              
                              // Simple email validation
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (!emailRegex.test(newEmail)) {
                                setErrorMessage('Please enter a valid email address.');
                                return;
                              }
                              
                              // Ensure contactFormEmails exists and is an array
                              const currentEmails = settings.contactInfo.contactFormEmails || [];
                              
                              // Check if email already exists in the list
                              if (currentEmails.includes(newEmail)) {
                                setErrorMessage('This email is already in the list.');
                                return;
                              }
                              
                              setSettings({
                                ...settings,
                                contactInfo: {
                                  ...settings.contactInfo,
                                  contactFormEmails: [...currentEmails, newEmail],
                                },
                              });
                              
                              setNewEmail('');
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Add
                          </button>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          {(!settings.contactInfo.contactFormEmails || settings.contactInfo.contactFormEmails.length === 0) ? (
                            <p className="text-sm text-red-500">
                              At least one recipient email is required.
                            </p>
                          ) : (
                            (settings.contactInfo.contactFormEmails || []).map((email, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                <span className="text-sm">{email}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentEmails = settings.contactInfo.contactFormEmails || [];
                                    if (currentEmails.length <= 1) {
                                      setErrorMessage('At least one recipient email is required.');
                                      return;
                                    }
                                    
                                    setSettings({
                                      ...settings,
                                      contactInfo: {
                                        ...settings.contactInfo,
                                        contactFormEmails: currentEmails.filter(
                                          (_, i) => i !== index
                                        ),
                                      },
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={(settings.contactInfo.contactFormEmails || []).length === 1}
                                  title={(settings.contactInfo.contactFormEmails || []).length === 1 ? "At least one email is required" : "Remove"}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        id="hours"
                        value={settings.contactInfo.hours}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            hours: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700">
                        Google Maps URL
                      </label>
                      <input
                        type="url"
                        id="googleMapsUrl"
                        value={settings.contactInfo.googleMapsUrl}
                        onChange={(e) => setSettings({
                          ...settings,
                          contactInfo: {
                            ...settings.contactInfo,
                            googleMapsUrl: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        For best results, use an embed URL from Google Maps. Open Google Maps → select your location → click "Share" → 
                        select "Embed a map" → copy the URL from the iframe code (src attribute).
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                      
                      {/* Company Description */}
                      <div className="mb-6">
                        <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                          Company Description
                        </label>
                        <p className="mt-1 text-sm text-gray-500 mb-2">
                          This description appears on the About page. Share your company's story, history, and what makes you unique.
                        </p>
                        <textarea
                          id="companyDescription"
                          rows={8}
                          value={settings.aboutInfo?.companyDescription || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            aboutInfo: {
                              ...settings.aboutInfo || {},
                              companyDescription: e.target.value,
                            },
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="Describe your company's background, mission, values, and what sets you apart..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="url"
                        id="facebook"
                        value={settings.socialLinks.facebook}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            facebook: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <input
                        type="url"
                        id="twitter"
                        value={settings.socialLinks.twitter}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            twitter: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <input
                        type="url"
                        id="instagram"
                        value={settings.socialLinks.instagram}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            instagram: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        value={settings.socialLinks.linkedin}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            linkedin: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                        YouTube
                      </label>
                      <input
                        type="url"
                        id="youtube"
                        value={settings.socialLinks.youtube}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: {
                            ...settings.socialLinks,
                            youtube: e.target.value,
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Logo */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Logo</h3>
                        <div className="mb-4 bg-gray-100 p-4 flex justify-center items-center rounded">
                          <div className="w-48 h-48 relative">
                            <Image 
                              src={settings.logo.url || '/images/placeholder.svg'}
                              alt={settings.logo.alt}
                              fill
                              style={{ objectFit: 'contain' }}
                              className="rounded"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="logoAlt" className="block text-sm font-medium text-gray-700 mb-2">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            id="logoAlt"
                            value={settings.logo.alt}
                            onChange={(e) => setSettings({
                              ...settings,
                              logo: {
                                ...settings.logo || {},
                                alt: e.target.value,
                              },
                            })}
                            className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload New Logo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload(e, 'logo')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                        </div>
                      </div>

                      {/* Hero Image */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Hero Image</h3>
                        <div className="mb-4 bg-gray-100 p-4 flex justify-center items-center rounded">
                          <div className="w-full h-48 relative">
                            <Image 
                              src={settings.heroImage.url || '/images/hero-placeholder.svg'}
                              alt={settings.heroImage.alt}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="heroAlt" className="block text-sm font-medium text-gray-700 mb-2">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            id="heroAlt"
                            value={settings.heroImage.alt}
                            onChange={(e) => setSettings({
                              ...settings,
                              heroImage: {
                                ...settings.heroImage || {},
                                alt: e.target.value,
                              },
                            })}
                            className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload New Hero Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload(e, 'heroImage')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Image (About Page) */}
                    <div className="border rounded-lg p-4 mt-8">
                      <h3 className="text-md font-medium text-gray-700 mb-2">Company Image (About Page)</h3>
                      <div className="mb-4 bg-gray-100 p-4 flex justify-center items-center rounded">
                        <div className="w-full h-48 relative">
                          {(imagePreview || settings.aboutInfo?.companyImage) ? (
                            <Image 
                              src={imagePreview || settings.aboutInfo?.companyImage || '/images/placeholder.svg'}
                              alt="Company"
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image uploaded
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Company Image
                        </label>
                        <p className="text-sm text-gray-500 mb-4">
                          This image appears on the About page. Recommended size: 800x600 pixels.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}