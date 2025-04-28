import React, { useState } from "react";
import { CreditCard, Banknote } from "lucide-react"; // icons

const FancyTransferForm = () => {
  const [transferType, setTransferType] = useState("visa");
  const [visaInfo, setVisaInfo] = useState({
    cardHolderName: "",
    cardNumber: "",
  });
  const [bankInfo, setBankInfo] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    swiftCode: "",
  });

  const handleVisaChange = (e: any) => {
    const { name, value } = e.target;
    setVisaInfo({ ...visaInfo, [name]: value });
  };

  const handleBankChange = (e: any) => {
    const { name, value } = e.target;
    setBankInfo({ ...bankInfo, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (transferType === "visa") {
      console.log("Transfer to Visa:", visaInfo);
    } else {
      console.log("Transfer to Bank:", bankInfo);
    }
  };

  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="mb-8 text-center text-3xl font-bold">Transfer Funds</h2>

      {/* Toggle Buttons */}
      <div className="mb-8 flex overflow-hidden rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => setTransferType("visa")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 transition ${
            transferType === "visa"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <CreditCard size={20} />
          Visa Card
        </button>
        <button
          type="button"
          onClick={() => setTransferType("bank")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 transition ${
            transferType === "bank"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Banknote size={20} />
          Bank Account
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="animate-fadeIn space-y-5">
        {transferType === "visa" ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardHolderName"
                value={visaInfo.cardHolderName}
                onChange={handleVisaChange}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Visa Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={visaInfo.cardNumber}
                onChange={handleVisaChange}
                required
                maxLength={16}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={bankInfo.accountHolderName}
                onChange={handleBankChange}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankInfo.accountNumber}
                onChange={handleBankChange}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={bankInfo.bankName}
                onChange={handleBankChange}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                SWIFT/BIC Code
              </label>
              <input
                type="text"
                name="swiftCode"
                value={bankInfo.swiftCode}
                onChange={handleBankChange}
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FancyTransferForm;
