import Header from "../components/Header";

const PaymentConfirmationPage = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 ">
        <img
          src={
            "https://i.pinimg.com/736x/ea/35/79/ea357999abbe7c57ec8860ae5b786b1c.jpg"
          }
          alt="Payment Success"
          className="w-48 h-48 mb-6 rounded-lg"
        />
        <h1 className="mb-4 text-3xl font-bold text-green-600">
          ¡Pago Completado!
        </h1>
        <p className="max-w-md text-lg text-center text-gray-700">
          Tu transacción ha sido exitosa. Gracias por tu compra. Ahora puedes
          disfrutar de tu producto o servicio. Si tienes alguna duda, no dudes
          en contactarnos.
        </p>
      </div>
    </>
  );
};

export default PaymentConfirmationPage;
