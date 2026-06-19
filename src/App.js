import { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

const Home         = lazy(() => import("./pages/Home"));
const Shop         = lazy(() => import("./pages/Shop"));
const Cart         = lazy(() => import("./pages/Cart"));
const Product      = lazy(() => import("./pages/Product"));
const Login        = lazy(() => import("./pages/Login"));
const Register     = lazy(() => import("./pages/Register"));
const Checkout     = lazy(() => import("./pages/Checkout"));
const AddressPage  = lazy(() => import("./pages/Address"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const UpiPayment   = lazy(() => import("./pages/UpiPayment"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <Router>
          <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="light" />
          <NavBar />
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/shop"          element={<Shop />} />
            <Route path="/shop/:id"      element={<Product />} />
            <Route path="/cart"          element={<Cart />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/checkout"      element={<Checkout />} />
            <Route path="/addresses"     element={<AddressPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/upi-payment"   element={<UpiPayment />} />
          </Routes>
          <Footer />
        </Router>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
