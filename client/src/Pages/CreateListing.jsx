import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState(null);  
  const [loading, setLoading] = useState(false);


  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUD_UPLOAD_PRESET);
  
      const uploadImage = async () => {
        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 20000, 
            }
          );
          resolve(res.data.secure_url);
        } catch (error) {
          console.error('Error uploading to Cloudinary:', error.message);
          reject(error); 
        }
      };
      
      uploadImage();
    });
  }; 


  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            Create a Beautiful Listing
          </h1>
          <p className='text-gray-600 text-lg'>
            Share your property with potential buyers or renters
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row'>
            {/* Left Side - Property Details */}
            <div className='flex-1 p-8 lg:border-r border-gray-200'>
              <div className='mb-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center'>
                  <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold'>1</span>
                  Property Details
                </h2>
                
                <div className='space-y-6'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                      Property Name *
                    </label>
                    <input
                      type='text'
                      placeholder='Enter a catchy property name'
                      className='w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                      id='name'
                      maxLength='62'
                      minLength='10'
                      required
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>

                  <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
                      Description *
                    </label>
                    <textarea
                      placeholder='Describe the property features, location benefits, and what makes it special...'
                      className='w-full border-2 border-gray-200 p-4 rounded-xl h-32 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                      id='description'
                      required
                      onChange={handleChange}
                      value={formData.description}
                    />
                  </div>

                  <div>
                    <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-2'>
                      Address *
                    </label>
                    <input
                      type='text'
                      placeholder='Full property address'
                      className='w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                      id='address'
                      required
                      onChange={handleChange}
                      value={formData.address}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type & Features */}
              <div className='mb-8'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>Property Type & Features</h3>
                
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.type === 'sale' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type='checkbox'
                      id='sale'
                      className='sr-only'
                      onChange={handleChange}
                      checked={formData.type === 'sale'}
                    />
                    <span className='font-medium'>🏠 For Sale</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.type === 'rent' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type='checkbox'
                      id='rent'
                      className='sr-only'
                      onChange={handleChange}
                      checked={formData.type === 'rent'}
                    />
                    <span className='font-medium'>🔑 For Rent</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.parking 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type='checkbox'
                      id='parking'
                      className='sr-only'
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <span className='font-medium'>🚗 Parking</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.furnished 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type='checkbox'
                      id='furnished'
                      className='sr-only'
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <span className='font-medium'>🛋️ Furnished</span>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.offer 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type='checkbox'
                      id='offer'
                      className='sr-only'
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <span className='font-medium'>🏷️ Special Offer</span>
                  </label>
                </div>
              </div>

              {/* Property Specifications */}
              <div>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>Property Specifications</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <div>
                    <label htmlFor='bedrooms' className='block text-sm font-medium text-gray-700 mb-2'>
                      🛏️ Bedrooms
                    </label>
                    <input
                      type='number'
                      id='bedrooms'
                      min='1'
                      max='10'
                      required
                      className='w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                  </div>

                  <div>
                    <label htmlFor='bathrooms' className='block text-sm font-medium text-gray-700 mb-2'>
                      🚿 Bathrooms
                    </label>
                    <input
                      type='number'
                      id='bathrooms'
                      min='1'
                      max='10'
                      required
                      className='w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                  </div>

                  <div>
                    <label htmlFor='regularPrice' className='block text-sm font-medium text-gray-700 mb-2'>
                      💰 Regular Price
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        id='regularPrice'
                        min='50'
                        max='10000000'
                        required
                        className='w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                        onChange={handleChange}
                        value={formData.regularPrice}
                      />
                      {formData.type === 'rent' && (
                        <span className='absolute right-3 top-3 text-gray-500 text-sm'>/ month</span>
                      )}
                    </div>
                  </div>

                  {formData.offer && (
                    <div className='md:col-span-2 lg:col-span-1'>
                      <label htmlFor='discountPrice' className='block text-sm font-medium text-gray-700 mb-2'>
                        🎯 Discounted Price
                      </label>
                      <div className='relative'>
                        <input
                          type='number'
                          id='discountPrice'
                          min='0'
                          max='10000000'
                          required
                          className='w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
                          onChange={handleChange}
                          value={formData.discountPrice}
                        />
                        {formData.type === 'rent' && (
                          <span className='absolute right-3 top-3 text-gray-500 text-sm'>/ month</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right Side - Image Upload */}
            <div className='flex-1 p-8 bg-gray-50'>
              <div className='mb-6'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center'>
                  <span className='bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold'>2</span>
                  Property Images
                </h2>
                
                <div className='bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 mb-6'>
                  <div className='text-center mb-4'>
                    <div className='text-4xl mb-2'>📸</div>
                    <p className='font-medium text-gray-700 mb-1'>
                      Upload Property Images
                    </p>
                    <p className='text-sm text-gray-500'>
                      The first image will be the cover (max 6 images)
                    </p>
                  </div>
                  
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <input
                      onChange={(e) => setFiles(e.target.files)}
                      className='flex-1 p-3 border-2 border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      type='file'
                      id='images'
                      accept='image/*'
                      multiple
                    />
                    <button
                      type='button'
                      disabled={uploading}
                      onClick={handleImageSubmit}
                      className='px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                    >
                      {uploading ? '⏳ Uploading...' : '📤 Upload'}
                    </button>
                  </div>
                  
                  {imageUploadError && (
                    <p className='text-red-500 text-sm mt-3 p-3 bg-red-50 rounded-lg border border-red-200'>
                      ❌ {imageUploadError}
                    </p>
                  )}
                </div>

                {/* Image Preview Grid */}
                {formData.imageUrls.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className='font-medium text-gray-700'>Uploaded Images ({formData.imageUrls.length}/6)</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {formData.imageUrls.map((url, index) => (
                        <div
                          key={url}
                          className='relative group bg-white p-3 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200'
                        >
                          <div className='relative'>
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className='w-full h-32 object-cover rounded-lg'
                            />
                            {index === 0 && (
                              <div className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full'>
                                Cover
                              </div>
                            )}
                            <button
                              type='button'
                              onClick={() => handleRemoveImage(index)}
                              className='absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'
                            >
                              ×
                            </button>
                          </div>
                          <p className='text-sm text-gray-600 mt-2 text-center'>
                            Image {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='mt-8'>
                <button
                  disabled={loading || uploading}
                  className='w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl'
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <span className='animate-spin mr-2'>⏳</span>
                      Creating Your Listing...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center'>
                      <span className='mr-2'>🚀</span>
                      Create Listing
                    </span>
                  )}
                </button>
                
                {error && (
                  <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                    <p className='text-red-600 text-sm flex items-center'>
                      <span className='mr-2'>❌</span>
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}