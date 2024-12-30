import { useQuery } from "@apollo/client";
import { GET_ORDER_BY_ID_QUERY } from "../graphql/queries";
import { useParams } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import Header from "../components/Header";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);

const PaymentsPage = ({
  stripe,
  elements,
}: {
  stripe: Stripe | null;
  elements: StripeElements | null;
}) => {
  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe no está listo");
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: import.meta.env.VITE_FRONTEND_URL + "/confirm",
      },
    });

    if (result.error) {
      alert(`Error: ${result.error.message}`);
      return;
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="max-w-md p-6 mx-auto space-y-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Pago Seguro
      </h2>
      <p className="text-center text-gray-500">
        Completa los datos de pago para continuar.
      </p>
      <div className="border-t border-gray-300"></div>
      <div className="space-y-4">
        <PaymentElement />
      </div>
      <button
        className="w-full py-3 font-sans font-bold text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
        type="submit"
        disabled={!stripe}
      >
        Pagar
      </button>
    </form>
  );
};

const InjectedCheckoutForm = () => {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <PaymentsPage stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
};

const PaymentsPageWithStripe = () => {
  const params = useParams();
  const { id } = params;

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_QUERY, {
    variables: { orderIdDto: { id } },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getOrderById) return <p>Error: No se encontró la orden</p>;

  const { stripeClientSecret } = data.getOrderById.payments[0];

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: stripeClientSecret }}
    >
      <Header />
      <InjectedCheckoutForm />
    </Elements>
  );
};

export default PaymentsPageWithStripe;
