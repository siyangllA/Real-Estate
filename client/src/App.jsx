import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp'; 
import Profile from './Pages/Profile';
import About from './Pages/about';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './Pages/CreateListing';

export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        </Routes>
    </BrowserRouter>
  );
}
