import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';
import { generateTicketId, generateQRCode } from '../utils/ticketGenerator';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    section: '',
    year: '',
    department: '',
    game: '',
    referredBy: '',
    transactionId: '',
  });

  const [files, setFiles] = useState({
    qrCode: null as File | null,
    paymentScreenshot: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const games = ['Chess', 'Counter-Strike', 'FIFA', 'PUBG Mobile', 'Valorant'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Generate ticket ID and QR code
      const ticketId = generateTicketId();
      const qrCodeDataUrl = await generateQRCode(ticketId, formData);

      // Convert QR code data URL to Blob
      const qrCodeBlob = await fetch(qrCodeDataUrl).then(res => res.blob());
      const qrCodeFile = new File([qrCodeBlob], `${ticketId}.png`, { type: 'image/png' });

      // Upload files to Supabase Storage
      let qrCodeUrl = '';
      let paymentScreenshotUrl = '';

      // Upload QR code
      const { data: qrData, error: qrError } = await supabase.storage
        .from('registration-files')
        .upload(`qr-codes/${ticketId}.png`, qrCodeFile);

      if (qrError) throw qrError;
      qrCodeUrl = qrData.path;

      // Upload payment screenshot
      if (files.paymentScreenshot) {
        const { data: psData, error: psError } = await supabase.storage
          .from('registration-files')
          .upload(`payment-screenshots/${formData.rollNumber}-${Date.now()}`, files.paymentScreenshot);

        if (psError) throw psError;
        paymentScreenshotUrl = psData.path;
      }

      // Save registration data to Supabase
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            ...formData,
            ticket_id: ticketId,
            qr_code_url: qrCodeUrl,
            payment_screenshot_url: paymentScreenshotUrl,
            registration_date: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast.success('Registration successful! Your ticket has been generated.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        rollNumber: '',
        section: '',
        year: '',
        department: '',
        game: '',
        referredBy: '',
        transactionId: '',
      });
      setFiles({
        qrCode: null,
        paymentScreenshot: null,
      });

      // Download ticket QR code
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `${ticketId}-ticket.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800 rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Register for Event</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="10-digit mobile number"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-300">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    required
                    className="input-field"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-300">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    required
                    className="input-field"
                    value={formData.section}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-300">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="input-field"
                    value={formData.year}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-300">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="input-field"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="game" className="block text-sm font-medium text-gray-300">
                    Game <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="game"
                    name="game"
                    required
                    className="input-field"
                    value={formData.game}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Game</option>
                    {games.map(game => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="referredBy" className="block text-sm font-medium text-gray-300">Referred By</label>
                  <input
                    type="text"
                    id="referredBy"
                    name="referredBy"
                    className="input-field"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    required
                    className="input-field"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-300">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="paymentScreenshot" className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400">
                          <span>Upload a file</span>
                          <input
                            id="paymentScreenshot"
                            name="paymentScreenshot"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                      </div>
                      {files.paymentScreenshot && (
                        <p className="text-sm text-gray-400">
                          Selected: {files.paymentScreenshot.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Fields marked with <span className="text-red-500 mx-1">*</span> are required
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;