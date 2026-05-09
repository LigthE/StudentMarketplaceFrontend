interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'buy' | 'rent';
  months?: number;
}

interface CartProps {
  cart: CartItem[];
  onBack: () => void;
  onRemove: (id: string) => void;
  user: { id: string; username: string } | null;
}

function Cart({ cart, onBack, onRemove, user }: CartProps) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      alert("Du måste logga in först!");
      return;
    }
    alert(`Köp genomfört!\nAnvändare: ${user.username}\nTotalt: ${total} kr\n\nTack för ditt köp!`);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Varukorg</h1>
          <button onClick={onBack} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Tillbaka
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            <p className="text-xl">Din varukorg är tom</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.type === 'buy' ? 'Köp' : `Hyra (${item.months} månader)`} - {item.price} kr
                    </p>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                    Ta bort
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Totalt</h2>
                <span className="text-2xl font-bold text-green-600">{total} kr</span>
              </div>
              
              {user && (
                <div className="bg-green-50 p-3 rounded mb-4">
                  <p className="text-green-800">Inloggad som: {user.username} (ID: {user.id})</p>
                </div>
              )}
              
              <button onClick={handleCheckout} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-bold">
                Godkänn köp
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;