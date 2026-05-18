import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
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
  type: "buy" | "rent";
  months?: number;
}

interface User {
  id: number;
  username: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("API not reachable");
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
      type: "buy",
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
      type: "rent",
      months: monthsNum,
    };
    setCart([...cart, cartItem]);
    alert(`La till ${item.name} (${monthsNum} månader) i varukorgen!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted!");
        setRefresh((k) => k + 1);
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleProductChange = () => {
    setRefresh((k) => k + 1);
    navigate("/");
  };

  return (
    <div className="app">
      <header>
        <h1>Student Marketplace</h1>
        <p>Hitta tech till bra pris</p>

        <nav style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
            Home
          </Link>
          <Link
            to="/add-product"
            style={{ textDecoration: "none", color: "blue" }}
          >
            Sell Product
          </Link>
        </nav>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              onClick={() => setShowCart(true)}
              style={{ position: "relative" }}
            >
              🛒 Varukorg ({cart.length})
            </button>
          </div>
          {user ? (
            <div className="user-info">
              <span>
                Välkommen {user.username} (ID: {user.id})
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logga ut
              </button>
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

      {showCart && (
        <Cart
          cart={cart}
          onBack={() => setShowCart(false)}
          onRemove={removeFromCart}
          user={user}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
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
                      <button
                        onClick={() => handleBuy(product)}
                        className="btn-buy"
                      >
                        Köp
                      </button>
                      <button
                        onClick={() => handleRent(product)}
                        className="btn-rent"
                      >
                        Hyra
                      </button>
                      {user && (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/edit-product/${product.id}`, {
                                state: { product },
                              })
                            }
                            className="btn-edit"
                          >
                            redigera
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn-delete"
                          >
                            Ta bort
                          </button>
                        </>
                      )}
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
                        <button
                          onClick={() => handleBuy(product)}
                          className="btn-buy"
                        >
                          Köp
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </main>
          }
        />
        <Route
          path="/add-product"
          element={<AddProduct onProductAdded={handleProductChange} />}
        />
        <Route
          path="/edit-product/:id"
          element={<EditProduct onProductUpdated={handleProductChange} />}
        />
      </Routes>
    </div>
  );
}

export default App;
