import Link from 'next/link';
import Image from 'next/image';
import { getServerSettings } from '@/lib/getServerSettings';
import ContactForm from './components/ContactForm';

export default async function Home() {
  // Fetch settings
  const settings = await getServerSettings();

  return (
    <main className="bg-white">
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] md:h-[700px] bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center" style={{ 
          backgroundImage: `url('${settings.heroImage.url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Quality control<br />is our top Priority
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-xl">
              Delivering exceptional metal products with precision and reliability
            </p>
            
            <Link 
              href="/contact"
              className="mt-6 inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 hover:translate-y-[-2px]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              <span className="text-primary-600">{settings.contactInfo.companyName}:</span> India's leading wire and welded mesh Manufacturer and Supplier
            </h2>
            
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-md">
                <div className="text-2xl font-bold text-primary-600">{settings.contactInfo.phone.bangalore}</div>
                <div className="mt-2 text-lg font-medium text-gray-500">BANGALORE</div>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-md">
                <div className="text-2xl font-bold text-primary-600">{settings.contactInfo.phone.hyderabad}</div>
                <div className="mt-2 text-lg font-medium text-gray-500">CORPORATE OFFICE</div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="p-8 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:translate-y-[-5px]">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Experience</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                We have more than five decades of experience in this industry. Our products have won accolades both domestically and internationally for quality, performance and adherence to delivery schedule.
              </p>
            </div>
            
            <div className="mt-10 lg:mt-0 p-8 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:translate-y-[-5px]">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Products</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Innovation often results when ideas are applied by the company in order to further satisfy the needs and expectations of the customers.
              </p>
            </div>
            
            <div className="mt-10 lg:mt-0 p-8 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:translate-y-[-5px]">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Satisfaction</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Our company is one of the most reputed names in the Wire Mesh market engaged actively in manufacturing and supply of a vast range of best quality Wire mesh.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute left-0 right-0 h-32 -top-16 bg-gray-50 -skew-y-3 z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Range of Products</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We stock an extensive range of stainless steel wire and mesh to meet the specific needs of any project.
            </p>
          </div>
          
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Product Card 1 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="aspect-w-3 aspect-h-2">
                <div className="h-52 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="/images/placeholder.svg" alt="Welded Mesh" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welded Mesh</h3>
                <p className="mt-2 text-base text-gray-600">
                  Weldmesh is one of the most versatile of industrial wire products and has innumerable applications throughout all types of industry.
                </p>
                <div className="mt-6">
                  <Link href="/products/welded-mesh" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                    Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product Card 2 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="aspect-w-3 aspect-h-2">
                <div className="h-52 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="/images/placeholder.svg" alt="Wire Mesh" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wire Mesh</h3>
                <p className="mt-2 text-base text-gray-600">
                  Wiremesh can offer wide-ranging characteristics depending on the configuration of wire thickness in relation to the aperture size, as well as type of weave.
                </p>
                <div className="mt-6">
                  <Link href="/products/wire-mesh" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                    Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product Card 3 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="aspect-w-3 aspect-h-2">
                <div className="h-52 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="/images/placeholder.svg" alt="Expanded Metal" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expanded Metal</h3>
                <p className="mt-2 text-base text-gray-600">
                  Expanded Metal means versatility. Versatile is the key word describing Expanded Metal. New applications are found for it every day in industry, offices and home.
                </p>
                <div className="mt-6">
                  <Link href="/products/expanded-metal" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                    Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product Card 4 */}
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <div className="aspect-w-3 aspect-h-2">
                <div className="h-52 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="/images/placeholder.svg" alt="Perforated Sheet" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perforated Sheet</h3>
                <p className="mt-2 text-base text-gray-600">
                  Perforated sheets are available in various patterns, thickness and materials. Perforated patterns consists of round, square, slotted and other custom designed patterns.
                </p>
                <div className="mt-6">
                  <Link href="/products/perforated-sheet" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                    Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 hover:translate-y-[-2px]"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Running a Successful Business Since 1969</h2>
            <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-extrabold text-white mb-2">100+</div>
              <div className="text-xl font-medium text-primary-100">Products</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-extrabold text-white mb-2">50+</div>
              <div className="text-xl font-medium text-primary-100">Years in Business</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-extrabold text-white mb-2">5000+</div>
              <div className="text-xl font-medium text-primary-100">Happy Customers</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-extrabold text-white mb-2">100+</div>
              <div className="text-xl font-medium text-primary-100">Projects Delivered</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Industry Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Focused Industries</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our products serve diverse industries with specialized solutions designed for each sector's unique requirements.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Defence</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Poultry</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Stone Crusher</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Automobile</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Warehouses</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Construction</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Rubber</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Sugar Mills</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Fabrication</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">HVAC</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Mines & Filtration</h3>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
              <h3 className="text-lg font-medium text-gray-900">Cement</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Contact Us</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Have questions or ready to start your project? We're here to help.
            </p>
          </div>
          
          <div className="mt-12 bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                
                <div className="mt-8 space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Head Office:</h4>
                      <p className="mt-2 text-gray-600">
                        {settings.contactInfo.address.headOffice}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Corporate Office:</h4>
                      <p className="mt-2 text-gray-600">
                        {settings.contactInfo.address.corporateOffice}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Contact Information:</h4>
                      <p className="mt-2 text-gray-600">
                        <strong>Phone:</strong> {settings.contactInfo.phone.bangalore} (Bangalore)<br />
                        <strong>Phone:</strong> {settings.contactInfo.phone.hyderabad} (Corporate Office)<br />
                        <strong>Email:</strong> {settings.contactInfo.email}<br />
                        <strong>Hours:</strong> {settings.contactInfo.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-10 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
