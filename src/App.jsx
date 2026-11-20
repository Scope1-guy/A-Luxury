import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Categories from "./pages/Categories/Categories";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import NotFound from "./pages/NotFound/NotFound";

// Provider order matters: ProductsProvider first (everything reads the
// product list), then CartProvider, then WishlistProvider (it uses the cart).
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:handle" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;
