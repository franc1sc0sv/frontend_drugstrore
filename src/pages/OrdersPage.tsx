import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { format } from "date-fns";
import Header from "../components/Header";
import { Order } from "../types/order";
import { useNavigate } from "react-router-dom";

const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      createdAt
      updatedAt
      total
      orderStatus
      orderItems {
        id
        product {
          name
          price
          images {
            url
          }
        }
        quantity
      }
      payments {
        id
        stripeAmount
        stripeCurrency
        stripeStatus
        createdAt
      }
    }
  }
`;

const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($orderIdDto: IdDto!) {
    cancelOrder(orderIdDto: $orderIdDto) {
      id
      orderStatus
      updatedAt
    }
  }
`;

const NEW_PAYMENT_INTENT_MUTATION = gql`
  mutation generateNewPaymentIntent($orderIdDto: IdDto!) {
    generateNewPaymentIntent(orderIdDto: $orderIdDto) {
      id
      stripeClientSecret
      stripeAmount
      stripeCurrency
      stripeStatus
      createdAt
      orderId
    }
  }
`;

const CANCEL_PAYMENT_MUTATION = gql`
  mutation CancelPayment($paymentIntentIdDto: IdDto!) {
    cancelPayment(paymentIntentIdDto: $paymentIntentIdDto)
  }
`;

const OrdersPage = () => {
  const { loading, error, data } = useQuery(GET_ORDERS);
  const [cancelOrder] = useMutation(CANCEL_ORDER_MUTATION);
  const [cancelPayment] = useMutation(CANCEL_PAYMENT_MUTATION);
  const [createPaymentIntent] = useMutation(NEW_PAYMENT_INTENT_MUTATION);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const handleSelectOrder = (orderId: string) => {
    const order = data?.getOrders.find((order: Order) => order.id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleRetryPayment = (orderId: string, paymentId: string) => {
    window.location.href = `/payments/${orderId}/${paymentId}`;
  };

  const handleCancelPayment = async (paymentId: string) => {
    console.log(paymentId);

    try {
      const { data } = await cancelPayment({
        variables: { paymentIntentIdDto: { id: paymentId } },
      });

      if (data.cancelPayment) {
        alert("Payment canceled successfully.");
      } else {
        alert(`Error canceling the payment: ${data.cancelPayment.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while canceling the payment.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { data } = await cancelOrder({
        variables: { orderIdDto: { id: orderId } },
      });
      if (data.cancelOrder.orderStatus === "CANCELED") {
        alert("Order canceled successfully.");
      } else {
        alert("Error canceling the order.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while canceling the order.");
    }
  };

  const handleNewPaymentIntent = async (orderId: string) => {
    try {
      const { data } = await createPaymentIntent({
        variables: { orderIdDto: { id: orderId } },
      });
      console.log(data);
      if (data.generateNewPaymentIntent) {
        navigate(
          `/payments/${data.generateNewPaymentIntent.orderId}/${data.generateNewPaymentIntent.id}`
        );
        alert("New payment intent created successfully.");
      } else {
        alert("Error creating a new payment intent.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating a new payment intent.");
    }
  };

  if (loading)
    return <div className="text-lg text-center">Loading orders...</div>;
  if (error)
    return (
      <div className="text-red-500">Error loading orders: {error.message}</div>
    );

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Header />
      <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.getOrders.length === 0 && <p>You have no orders yet.</p>}
        {data.getOrders.map((order: Order) => (
          <div
            key={order.id}
            className="p-4 transition bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-lg"
            onClick={() => handleSelectOrder(order.id)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  order.orderStatus === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "CANCELED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Created on: {format(new Date(order.createdAt), "dd/MM/yyyy")}
            </p>
            <p className="mt-2 text-lg font-bold">
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="p-6 mt-8 bg-white border rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Order Details #{selectedOrder.id}
            </h2>
            <button
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {format(new Date(selectedOrder.updatedAt), "dd/MM/yyyy HH:mm")}
          </p>
          <h3 className="mt-4 text-lg font-semibold">Items:</h3>
          <ul className="mt-2 space-y-4">
            {selectedOrder.orderItems?.map((item) => (
              <li key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="object-cover w-16 h-16 rounded-md"
                />
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-lg font-semibold">Payments:</h3>
          <ul className="mt-2 space-y-2">
            {selectedOrder.payments?.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm">
                    {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm")} -
                    ${payment.stripeAmount.toFixed(2)} {payment.stripeCurrency}
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      payment.stripeStatus === "payment_intent.succeeded"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.stripeStatus}
                  </span>
                </div>

                {(payment.stripeStatus === "requires_payment_method" ||
                  payment.stripeStatus === "payment_intent.payment_failed") && (
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() =>
                        handleRetryPayment(selectedOrder.id, payment.id)
                      }
                    >
                      Retry Payment
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleCancelPayment(payment.id)}
                    >
                      Cancel Payment
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex mt-6 space-x-4">
            {(selectedOrder.orderStatus === "PENDING" ||
              selectedOrder.orderStatus === "FAILED") && (
              <>
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => handleNewPaymentIntent(selectedOrder.id)}
                >
                  Generate New Payment Intent
                </button>

                <button
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
