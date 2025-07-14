import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: OTP, 3: password, 4: success
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    password: '',
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
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/send-registration-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }


    } catch (error) {
      setError(error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/verify-registration-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Registration successful
      setCurrentStep(4);
      
      // Navigate to sign-in page after a short delay
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/send-registration-otp', {
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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      {currentStep === 1 && (
        <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg bg-gray-100"
            value={formData.email}
            disabled
          />
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="border p-3 rounded-lg"
            id="otp"
            value={formData.otp}
            onChange={handleChange}
            maxLength="6"
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Verifying...' : 'Verify & Sign Up'}
          </button>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-blue-700 hover:underline"
            >
              Change Email
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-blue-700 hover:underline disabled:opacity-50"
            >
              {loading ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <div className="flex flex-col gap-4 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-600 text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-green-700 mb-4">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            <p className="text-sm text-green-600">
              Redirecting to sign-in page in a moment...
            </p>
          </div>
          
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Go to Sign In
          </button>
        </div>
      )}

      {currentStep !== 4 && (
        <div className="mt-4">
          <OAuth />
        </div>
      )}

      {currentStep !== 4 && (
        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
      )}

      {error && (
        <p className={`mt-5 ${error.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
          {error}
        </p>
      )}
    </div>
  );
}
