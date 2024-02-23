import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'antd/dist/antd.min.css';
import Home from './pages/home/Home';
import Products from './pages/products/Products';
import Cart from './pages/cart/Cart';
import Login from './pages/login/Login';
import Reports from './pages/reports/Reports';
import InvoicesRoute from './pages/invoices/InvoiceRoute';
import Categories from "./pages/categories/Categories"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRouter>
              <Home /> 
            </ProtectedRouter>  
            } />
          <Route path="/products" element={
            <ProtectedRouter>
              <Products />
            </ProtectedRouter>
            } />
          <Route path="/cart" element={
            <ProtectedRouter>
              <Cart />
            </ProtectedRouter>
            } />
            <Route path="/invoice" element={
            <ProtectedRouter>
              <InvoicesRoute />
            </ProtectedRouter>
            } />
            <Route path="/categories" element={
            <ProtectedRouter>
              <Categories />
            </ProtectedRouter>
            } />
            <Route path="/reports" element={
            <ProtectedRouter>
              <Reports />
            </ProtectedRouter>
            } />
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default App;

export function ProtectedRouter({children}) {

// const storage = localStorage.getItem('auth');
// const parsedStorage = JSON.parse(storage);

// if(parsedStorage !== null && parsedStorage !== undefined &&  parsedStorage.access === "allow") {
  return children;
// } else {
//   return <Navigate to="/login" />
// };

}
