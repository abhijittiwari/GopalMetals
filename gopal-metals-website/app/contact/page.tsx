import { Metadata } from 'next';
import { WebPageJsonLd } from '@/components/SEO/JsonLd';
import ContactForm from '@/app/components/ContactForm';
import ReCaptchaProvider from '@/components/ReCaptchaProvider';
import { getServerSettings } from '@/lib/getServerSettings';
import Image from 'next/image';
import Link from 'next/link';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Contact Us | Gopal Metals - Wire Mesh Manufacturer',
  description: 'Get in touch with Gopal Metals, leading manufacturer and supplier of wire mesh products in India. Request quotes, place orders, or ask questions about our products.',
  keywords: 'contact Gopal Metals, wire mesh supplier contact, industrial wire mesh contact, metal products India contact',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Gopal Metals - Wire Mesh Manufacturer',
    description: 'Get in touch with Gopal Metals, leading manufacturer and supplier of wire mesh products in India.',
    url: '/contact',
    siteName: 'Gopal Metals',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function ContactPage() {
  const settings = await getServerSettings();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gopalmetals.com';
  
  return (
    <>
      {/* Structured data for the webpage */}
      <WebPageJsonLd 
        title="Contact Us | Gopal Metals"
        description="Get in touch with Gopal Metals, leading manufacturer and supplier of wire mesh products in India."
        url={`${baseUrl}/contact`}
        settings={settings}
      />
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions about our products or need to place an order? Get in touch with our team and we'll be happy to help.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form with reCAPTCHA */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              <ReCaptchaProvider>
                <ContactForm />
              </ReCaptchaProvider>
            </div>
            
            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Bangalore Office */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Bangalore Office</h3>
                  <address className="mt-3 not-italic text-base text-gray-600">
                    {settings.contactInfo.address.headOffice}
                  </address>
                  <p className="mt-2 text-base text-gray-600">
                    <span className="font-medium">Phone:</span> {settings.contactInfo.phone.bangalore}
                  </p>
                </div>
                
                {/* Email */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-base text-gray-600">
                    <a href={`mailto:${settings.contactInfo.email}`} className="text-primary-600 hover:text-primary-500">
                      {settings.contactInfo.email}
                    </a>
                  </p>
                </div>
                
                {/* Business Hours */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                  <p className="mt-1 text-base text-gray-600">
                    Monday - Saturday: 9:30 AM - 6:30 PM
                  </p>
                  <p className="text-base text-gray-600">
                    Sunday: Closed
                  </p>
                </div>
                
                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Connect With Us</h3>
                  <div className="mt-2 flex space-x-5">
                    <a 
                      href={settings.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Facebook"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path 
                          fillRule="evenodd" 
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </a>
                    <a 
                      href={settings.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Twitter"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path 
                          d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" 
                        />
                      </svg>
                    </a>
                    <a 
                      href={settings.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="LinkedIn"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path 
                          fillRule="evenodd" 
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Google Map */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Find Us</h2>
            <div className="h-96 bg-gray-300 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9859347539903!2d77.55742231100661!3d12.977208087318097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3df0d77b6f65%3A0xf8c8cd26e5e8003!2sRajajinagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1652959074657!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gopal Metals Location Map"
                aria-label="Google Map showing Gopal Metals office location in Bangalore"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 