import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CART,
  ADD_ITEM_TO_CART,
  REMOVE_CART_ITEM,
  CREATE_ORDER,
} from "../graphql/queries";
import { CartItem } from "../types/cart";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { data, loading } = useQuery(GET_CART);
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM);
  const [total, setTotal] = useState<number>(0);

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      await addItemToCart({
        variables: { input: { productId, quantity } },
        refetchQueries: [{ query: GET_CART }],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await removeCartItem({
        variables: { cartItemIdDto: { id: cartItemId } },
        refetchQueries: [{ query: GET_CART }],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove product from cart.");
    }
  };

  const calculateTotal = () => {
    if (data?.getCart?.cartItems) {
      const totalValue = data.getCart.cartItems.reduce(
        (acc: number, item: CartItem) =>
          acc + item.quantity * item.product.price,
        0
      );
      setTotal(totalValue);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [data]);

  if (loading) return <p>Loading Cart...</p>;

  const cartItems = data?.getCart?.cartItems || [];

  return (
    <div className="p-4">
      <Header />
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.id}
              className="p-4 transition duration-300 ease-in-out border rounded shadow-lg hover:shadow-xl"
            >
              <img
                src={item.product?.images[0]?.url}
                alt={item.product?.name}
                className="object-cover w-full h-40 mb-4 rounded"
              />
              <h2 className="text-xl font-bold">{item.product?.name}</h2>
              <p className="text-gray-700">{item.product?.description}</p>
              <p className="mt-2 font-bold text-green-500">
                ${item.product?.price.toFixed(2)}
              </p>
              <p className="mt-2">Quantity: {item.quantity}</p>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  onClick={() => handleAddToCart(item.product.id, 1)}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Increase
                </button>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="my-4">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
      </div>
      <CheckoutButton />
    </div>
  );
};

export default CartPage;

const CheckoutButton = () => {
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);
  const navigate = useNavigate();
  const handleProceedToCheckout = async () => {
    try {
      const { data } = await createOrder();
      const { order } = data.createOrder;

      navigate(`/payments/${order.id}`);
    } catch (err) {
      console.error("Error al crear la orden:", err);
    }
  };

  return (
    <button
      className="p-4 font-sans font-bold text-white bg-black rounded-lg"
      onClick={handleProceedToCheckout}
      disabled={loading}
    >
      Proceed to Checkout
    </button>
  );
};
