import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import TikTokMenu from "./pages/TikTokMenu";

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cacau-950">
        <TikTokMenu />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
