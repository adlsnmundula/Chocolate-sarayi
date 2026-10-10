import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Location from "./pages/Location";
import Contact from "./pages/Contact";

function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/sobre") {
      // "Sobre Nós" agora vive na página inicial: faz scroll até à secção.
      document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollManager />
        <div className="flex min-h-screen flex-col bg-cacau-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/localizacao" element={<Location />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </HashRouter>
  );
}
