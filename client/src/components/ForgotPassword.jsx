import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: OTP & new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Email is required!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-password-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || 'Request failed!');
        setLoading(false);
        return;
      }

      setCurrentStep(2);
      // Always show OTP in development mode
      if (data.developmentOTP) {
        setError(`✅ OTP Generated: ${data.developmentOTP} (Copy this OTP)`);
      } else {
        setError(`OTP sent to ${formData.email}. Please check your email.`);
      }
    } catch (err) {
      setError(err.message || 'An error occurred!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required!');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-password-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || 'Password reset failed!');
        setLoading(false);
        return;
      }

      alert('Password reset successful! You can now sign in with your new password.');
      navigate('/sign-in');
    } catch (err) {
      setError(err.message || 'An error occurred!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/send-password-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to resend OTP');
        setLoading(false);
        return;
      }

      // Always show OTP in development mode
      if (data.developmentOTP) {
        setError(`✅ OTP Resent: ${data.developmentOTP} (Copy this OTP)`);
      } else {
        setError('OTP resent successfully!');
      }
    } catch (error) {
      setError(error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Forgot Password</h1>
      
      {currentStep === 1 && (
        <form onSubmit={handleSendOTP} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg'
            id='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg bg-gray-100'
            value={formData.email}
            disabled
          />
          <input
            type='text'
            placeholder='Enter 6-digit OTP'
            className='border p-3 rounded-lg'
            id='otp'
            value={formData.otp}
            onChange={handleChange}
            maxLength='6'
            required
          />
          <input
            type='password'
            placeholder='New Password'
            className='border p-3 rounded-lg'
            id='newPassword'
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Confirm New Password'
            className='border p-3 rounded-lg'
            id='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div className='flex justify-between items-center'>
            <button
              type='button'
              onClick={() => setCurrentStep(1)}
              className='text-blue-700 hover:underline'
            >
              Change Email
            </button>
            <button
              type='button'
              onClick={handleResendOTP}
              disabled={loading}
              className='text-blue-700 hover:underline disabled:opacity-50'
            >
              {loading ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className={`mt-5 ${error.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
          {error}
        </p>
      )}
    </div>
  );
}
