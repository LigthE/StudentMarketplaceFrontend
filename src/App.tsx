import { useState, useEffect } from "react";
import Cart from "./pages/Cart";
import "./App.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rentPrice: number;
  category: string;
  image: string;
  createdAt?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'buy' | 'rent';
  months?: number;
}

interface User {
  id: number;
  username: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("API not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.id) {
        setUser({ id: data.id, username: data.username });
      } else {
        alert(data.message || "Fel användarnamn eller lösenord");
      }
    } catch (err) {
      alert("Något gick fel");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsername("");
    setPassword("");
    setCart([]);
  };

  const handleBuy = (item: any) => {
    if (!user) {
      alert("Du måste logga in först!");
      return;
    }
    const cartItem: CartItem = {
      id: Date.now().toString(),
      name: item.name,
      price: item.price,
      type: 'buy'
    };
    setCart([...cart, cartItem]);
    alert(`La till ${item.name} i varukorgen!`);
  };

  const handleRent = (item: any) => {
    if (!user) {
      alert("Du måste logga in först!");
      return;
    }
    const months = prompt("Hur många månader vill du hyra?", "1");
    if (!months || parseInt(months) < 1) return;
    const monthsNum = parseInt(months);
    const cartItem: CartItem = {
      id: Date.now().toString(),
      name: item.name,
      price: item.rentPrice * monthsNum,
      type: 'rent',
      months: monthsNum
    };
    setCart([...cart, cartItem]);
    alert(`La till ${item.name} (${monthsNum} månader) i varukorgen!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  if (loading) return <div className="loading">Laddar...</div>;

  if (showCart) {
    return <Cart cart={cart} onBack={() => setShowCart(false)} onRemove={removeFromCart} user={user} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Student Marketplace</h1>
        <p>Hitta tech till bra pris</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button onClick={() => setShowCart(true)} style={{ position: 'relative' }}>
              🛒 Varukorg ({cart.length})
            </button>
          </div>
          {user ? (
            <div className="user-info">
              <span>Välkommen {user.username} (ID: {user.id})</span>
              <button onClick={handleLogout} className="btn-logout">Logga ut</button>
            </div>
          ) : null}
        </div>

        {user ? null : (
          <form onSubmit={handleAuth} className="auth-form">
            <input
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isLogin ? "Logga in" : "Registrera"}</button>
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Skapa konto" : "Har du konto?"}
            </button>
          </form>
        )}
      </header>

      <main>
        <h2>Datorer till salu</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} width="150" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="category">{product.category}</p>
              <div className="prices">
                <span>Köp: {product.price} kr</span>
                <span>Hyra: {product.rentPrice} kr/mån</span>
              </div>
              <div className="buttons">
                <button onClick={() => handleBuy(product)} className="btn-buy">
                  Köp
                </button>
                <button onClick={() => handleRent(product)} className="btn-rent">
                  Hyra
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2>Dina produkter i butiken</h2>
        {products.length === 0 ? (
          <p>Inga produkter än</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="category">{product.category}</p>
                <div className="prices">
                  <span>Köp: {product.price} kr</span>
                  <span>Hyra: {product.rentPrice} kr/mån</span>
                </div>
                {user && (
                  <button onClick={() => handleBuy(product)} className="btn-buy">
                    Köp
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;