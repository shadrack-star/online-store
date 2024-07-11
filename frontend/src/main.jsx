
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Amazon from "./pages/AmazonPage"
import Home from "./pages/HomePage";
import Products from "./pages/Products";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterUser";
import Orders from "./pages/OrderPage"
import Profile from "./pages/ProfilePage"
import Footer from "./components/Footer";
import { UserContext, UserProvider } from "./context/UserContext";
export default function App() {
  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="amazon" element={<Amazon />} />
          <Route path="products" element={<Products />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="order" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      </UserProvider>
    </BrowserRouter>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
