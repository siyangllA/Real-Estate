import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp'; 
import Profile from './Pages/Profile';
import About from './Pages/about';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';


export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
             path='/update-listing/:listingId'
             element={<UpdateListing />}
           />
        </Route>
        </Routes>
    </BrowserRouter>
  );
}
