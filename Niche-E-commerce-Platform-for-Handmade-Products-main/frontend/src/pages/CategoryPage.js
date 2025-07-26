import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      const filtered =
        categoryName === 'all'
          ? res.data
          : res.data.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
      setProducts(filtered);
    };
    fetch();
  }, [categoryName]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Home
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {categoryName === 'all' ? 'All Products' : `${categoryName} Collection`}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(p => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={p.image} alt={p.title} className="w-full h-48 object-contain bg-white" />
              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-lg font-semibold text-gray-800 truncate">{p.title}</h4>
                <p className="text-gray-700 font-medium">₹{p.price}</p>
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
