// components/WithdrawModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import TransferForm from "./TransferForm";

import React from "react";
import Decimal from "decimal.js";

type Props = {};

const BankAccountForm = ({ setBankInfoCb }: { setBankInfoCb?: any }) => {
  const [bankInfo, setBankInfo] = useState({
    accountHolderName: "Nguyen Van A",
    accountNumber: "123456789123",
    bankName: "Tien Phong Commercial Joint Stock Bank (TP Bank)",
    //bankRoutingNumber: "", // Used for domestic transfers (US)
    swiftCode: "TPBVVNVX", // Used for international transfers
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setBankInfo({
      ...bankInfo,
      [name]: value,
    });

    setBankInfoCb({
      ...bankInfo,
      [name]: value,
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">
        Enter Bank Account Information
      </h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="accountHolderName"
            className="block text-sm font-medium text-gray-700"
          >
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountHolderName"
            name="accountHolderName"
            value={bankInfo.accountHolderName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={bankInfo.accountNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-gray-700"
          >
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={bankInfo.bankName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            required
          />
        </div>
        {/* <div className="mb-4">
      <label
        htmlFor="bankRoutingNumber"
        className="block text-sm font-medium text-gray-700"
      >
        Bank Routing Number (for US domestic transfers)
      </label>
      <input
        type="text"
        id="bankRoutingNumber"
        name="bankRoutingNumber"
        value={transferInfo.bankRoutingNumber}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
        placeholder="9-digit Routing Number"
      />
    </div> */}
        <div className="mb-4">
          <label
            htmlFor="swiftCode"
            className="block text-sm font-medium text-gray-700"
          >
            SWIFT/BIC Code (for international transfers)
          </label>
          <input
            type="text"
            id="swiftCode"
            name="swiftCode"
            value={bankInfo.swiftCode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            placeholder="SWIFT/BIC Code"
          />
        </div>
      </form>
    </div>
  );
};

const VisaForm = (props: Props) => {
  const [visaInfo, setVisaInfo] = useState({
    cardHolderName: "Nguyen Van A",
    cardNumber: "123456789123",
  });

  const handleVisaChange = (e: any) => {
    const { name, value } = e.target;
    setVisaInfo({ ...visaInfo, [name]: value });
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Enter Visa Information</h2>
      <div className="mb-4">
        <label
          htmlFor="swifcardHolderNametCode"
          className="block text-sm font-medium text-gray-700"
        >
          Cardholder Name
        </label>

        <input
          id="cardHolderName"
          type="text"
          name="cardHolderName"
          value={visaInfo.cardHolderName}
          onChange={handleVisaChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Visa Card Number
        </label>

        <input
          id="cardNumber"
          type="text"
          name="cardNumber"
          value={visaInfo.cardNumber}
          onChange={handleVisaChange}
          required
          maxLength={16}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
        />
      </div>
    </div>
  );
};

export function WithdrawModal({
  open,
  onClose,
  onSubmit,
  availableBalance,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
  availableBalance: number;
}) {
  if (!availableBalance) return null;

  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("BANK");

  const [visaInfo, setVisaInfo] = useState({
    cardHolderName: "",
    cardNumber: "",
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolderName: "Nguyen Van A",
    accountNumber: "123456789123",
    bankName: "Tien Phong Commercial Joint Stock Bank (TP Bank)",
    //bankRoutingNumber: "", // Used for domestic transfers (US)
    swiftCode: "TPBVVNVX", // Used for international transfers
  });

  const handleConfirm = () => {
    if (amount <= 0 || amount > availableBalance) {
      toast.error("Invalid amount");
      return;
    }

    const form = {
      amount,
      method,
      metatdata: bankInfo,
    };

    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">
              Amount (Max: ${new Decimal(availableBalance).toFixed(2)})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min={1}
              max={availableBalance}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Withdraw Method</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="BANK">Bank Transfer</option>
              {/* <option value="visa">Visa Card</option> */}

              {/* <option value="paypal">Paypal</option>
              <option value="stripe">Stripe</option> */}
            </select>
          </div>
        </div>

        <div className="rounded-md border bg-white p-6">
          {method === "BANK" && <BankAccountForm setBankInfoCb={setBankInfo} />}
          {method === "visa" && <VisaForm />}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawModal;
