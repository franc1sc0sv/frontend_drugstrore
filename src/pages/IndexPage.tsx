import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS, ADD_ITEM_TO_CART } from "../graphql/queries";
import { ItemEdge, Product } from "../types/products";
import Header from "../components/Header";

const Index: React.FC = () => {
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageHistory, setPageHistory] = useState<string[]>([]);

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { first: 10, after, before },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.getProducts) {
        const newProducts = data.getProducts.edges.map(
          (edge: ItemEdge) => edge.node
        );
        setProducts(newProducts);
        if (after) {
          setPageHistory((prevHistory) => [...prevHistory, after]);
        }
      }
    },
  });

  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItemToCart({
        variables: { input: { productId, quantity: 1 } },
      });
      alert("Product added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  const handleNext = () => {
    const endCursor = data?.getProducts?.pageInfo?.endCursor;
    if (endCursor) {
      setBefore(null);
      setAfter(endCursor);
    }
  };

  const handlePrev = () => {
    const startCursor = data?.getProducts?.pageInfo?.startCursor;
    if (startCursor && pageHistory.length > 1) {
      setAfter(pageHistory[pageHistory.length - 2]);
      setBefore(null);
      setPageHistory((prevHistory) =>
        prevHistory.slice(0, prevHistory.length - 1)
      );
    } else {
      setAfter(null);
      setBefore(null);
      setPageHistory([]);
    }
  };

  if (loading && !products.length) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  const { hasNextPage, hasPreviousPage } = data?.getProducts?.pageInfo || {};

  return (
    <div className="p-4">
      <Header />
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <div className="flex justify-start mb-4">
        <button
          onClick={handlePrev}
          disabled={!hasPreviousPage}
          className={`px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 ${
            !hasPreviousPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className={`px-4 py-2 ml-4 text-white bg-blue-500 rounded hover:bg-blue-600 ${
            !hasNextPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product: Product) => (
          <div key={product.id} className="p-4 border rounded shadow-lg">
            <img
              src={product.images && product.images[1]?.url}
              alt={product.name}
              className="object-cover w-full h-40 mb-4 rounded"
            />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="mt-2 font-bold text-green-500">
              ${product.price.toFixed(2)}
            </p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
