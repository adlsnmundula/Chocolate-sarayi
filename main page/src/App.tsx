import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import TikTokMenu from "./pages/TikTokMenu";
import Landing from "./pages/Landing";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout do site principal: navbar + rodapé
function SiteLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/localizacao" element={<Location />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />
        <CartDrawer />
        <Routes>
          {/* Páginas independentes (sem navbar/rodapé) */}
          <Route path="/menu-visual" element={<TikTokMenu />} />
          <Route path="/redirecionamento" element={<Landing />} />
          {/* Site principal */}
          <Route path="/*" element={<SiteLayout />} />
        </Routes>
      </CartProvider>
    </HashRouter>
  );
}
