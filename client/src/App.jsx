import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import SignIn from './Pages/signin';
import SignUp from './Pages/SignUp'; 
import Profile from './Pages/profile';
import About from './Pages/about';
import Header from './components/Header';

export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
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
