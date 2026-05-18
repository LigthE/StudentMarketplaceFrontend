import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

function EditProduct({ onProductUpdated }: { onProductUpdated: () => void }) {
  const { id } = useParams();
  const location = useLocation();
  const productFromState: any = (location.state as any)?.product;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (productFromState) {
      setName(productFromState.name);
      setDescription(productFromState.description);
      setPrice(String(productFromState.price));
      setRentPrice(String(productFromState.rentPrice));
      setCategory(productFromState.category);
      setFetching(false);
    } else {
      fetchProduct();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
        setPrice(String(data.price));
        setRentPrice(String(data.rentPrice));
        setCategory(data.category);
      } else {
        alert("Product not found");
        onProductUpdated();
      }
    } catch (err) {
      alert("Failed to fetch product");
      onProductUpdated();
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !description || !price || !rentPrice) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          rentPrice: Number(rentPrice),
          category,
        }),
      });

      if (res.ok) {
        alert("Product updated!");
        onProductUpdated();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-xl text-center mt-8">Loading...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Price (kr)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Rent Price (kr/month)</label>
          <input
            type="number"
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Phone">Phone</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-bold"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </main>
  );
}

export default EditProduct;
