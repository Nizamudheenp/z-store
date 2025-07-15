import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="mt-4">Thank you for your purchase.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
