import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/deal/:id" element={<ProductDetail />} />
        <Route path="/admin"    element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
