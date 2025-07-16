import { Link } from 'react-router-dom';
const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      
      <div className="w-28 h-28 mb-6 relative">
        <svg className="checkmark" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="mt-4 text-gray-600">Thank you for your purchase.</p>

      <Link 
        to="/my-orders" 
        className="mt-8 inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-lg text-lg transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
