import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const hideSearch =
    location.pathname === '/sign-in' ||
    location.pathname === '/sign-up' ||
    location.pathname === '/profile' ||
    location.pathname === '/forgot-password';



  return (
    <header>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Real</span>
          <span className='text-slate-700'>Estate</span>
        </h1>
        </Link>




        <ul className='flex gap-4'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/'>Home</Link>
          </li>
          
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/about'>About</Link>
          </li>
          <Link to='/profile'>
          {currentUser ? (
                <img
                 className='rounded-full h-7 w-7 object-cover'
                 src={currentUser.avatar}
                 alt='profile'
               />
            ) : (
          <li className='text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  );
}
