import { BrowserRouter as Router, Routes ,Route} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import { ProductProvider } from './context/ProductContext';


import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import AmazonPage from "./pages/AmazonPage"

import LoginPage from "./pages/LoginPage";
import Products from "./pages/Products";
import RegisterUser from "./pages/RegisterUser";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <div className="app">
      <Toaster
        toastOptions={{
          style: {
            background: "rgb(51 65 85)",
            color: "#fff",
          },
        }}
      />
      <Header />
      <Routes>
      <Route path="/amazon" element={<AmazonPage />} />
        <Route path="/home" element={<HomePage />} />
        
        <Route path="/order" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage/>}/>

        
        
        <Route path="/Products" element={<Products/>}/>
        <Route path="/register" element={<RegisterUser/>}/>
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      <Footer />
    </div>
  );
}



