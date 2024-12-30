import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { format } from "date-fns";
import Header from "../components/Header";
import { Order } from "../types/order";

// Definición del query para obtener las órdenes
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

const OrdersPage = () => {
  const { loading, error, data } = useQuery(GET_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSelectOrder = (orderId: string) => {
    const order = data?.getOrders.find((order: Order) => order.id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading)
    return <div className="text-lg text-center">Cargando órdenes...</div>;
  if (error)
    return (
      <div className="text-red-500">
        Error al cargar las órdenes: {error.message}
      </div>
    );

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Header />
      <h1 className="mb-4 text-2xl font-bold">Mis Órdenes</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.getOrders.map((order: Order) => (
          <div
            key={order.id}
            className="p-4 transition bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-lg"
            onClick={() => handleSelectOrder(order.id)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Orden #{order.id}</h2>
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
              Creado el: {format(new Date(order.createdAt), "dd/MM/yyyy")}
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
              Detalles de la Orden #{selectedOrder.id}
            </h2>
            <button
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              onClick={handleCloseDetails}
            >
              Cerrar
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Última actualización:{" "}
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
                    Cantidad: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Precio: ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-lg font-semibold">Pagos:</h3>
          <ul className="mt-2 space-y-2">
            {selectedOrder.payments?.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between"
              >
                <p className="text-sm">
                  {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm")} - $
                  {payment.stripeAmount.toFixed(2)} {payment.stripeCurrency}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
