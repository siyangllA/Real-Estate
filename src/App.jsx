import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import SignIn from './Pages/signin';
import SignUp from './Pages/SignUp'; 
import Profile from './Pages/profile';
import About from './Pages/about';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
