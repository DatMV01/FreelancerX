import React, { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react'; // icons

const FancyTransferForm = () => {
  const [transferType, setTransferType] = useState('visa');
  const [visaInfo, setVisaInfo] = useState({
    cardHolderName: '',
    cardNumber: '',
  });
  const [bankInfo, setBankInfo] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
  });

  const handleVisaChange = (e) => {
    const { name, value } = e.target;
    setVisaInfo({ ...visaInfo, [name]: value });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankInfo({ ...bankInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transferType === 'visa') {
      console.log('Transfer to Visa:', visaInfo);
    } else {
      console.log('Transfer to Bank:', bankInfo);
    }
  };

  return (
     <div className="rounded-md border bg-white p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Transfer Funds</h2>

      {/* Toggle Buttons */}
      <div className="flex mb-8 rounded-lg overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setTransferType('visa')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition ${
            transferType === 'visa' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <CreditCard size={20} />
          Visa Card
        </button>
        <button
          type="button"
          onClick={() => setTransferType('bank')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition ${
            transferType === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Banknote size={20} />
          Bank Account
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
        {transferType === 'visa' ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={visaInfo.cardHolderName}
                onChange={handleVisaChange}
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visa Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={visaInfo.cardNumber}
                onChange={handleVisaChange}
                required
                maxLength={16}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={bankInfo.accountHolderName}
                onChange={handleBankChange}
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={bankInfo.accountNumber}
                onChange={handleBankChange}
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={bankInfo.bankName}
                onChange={handleBankChange}
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SWIFT/BIC Code</label>
              <input
                type="text"
                name="swiftCode"
                value={bankInfo.swiftCode}
                onChange={handleBankChange}
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FancyTransferForm;
