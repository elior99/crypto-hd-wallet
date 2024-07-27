import React, { useEffect, useState } from "react";
import { useWallet } from "@/lib/sessionContext";
const { ethers } = require("ethers");
import { toast } from "react-toastify";

const SendForm = ({ selectedCoin, balance }) => {
  const [coinAmount, setCoinAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { submitTransaction, usdRate } = useWallet();

  console.log(usdRate);
  // Update USD amount when coin amount changes
  useEffect(() => {
    if (coinAmount && usdRate[selectedCoin]) {
      const rate = usdRate[selectedCoin].rateUSD;
      const newUsdAmount = (parseFloat(coinAmount) * rate);
      setUsdAmount(newUsdAmount);
    } else {
      setUsdAmount("");
    }
  }, [coinAmount, usdRate, selectedCoin]);

  // Update coin amount when USD amount changes
  useEffect(() => {
    if (usdAmount && usdRate[selectedCoin]) {
      const rate = usdRate[selectedCoin].rateUSD;
      const newCoinAmount = (parseFloat(usdAmount) / rate);
      setCoinAmount(newCoinAmount);
    } else {
      setCoinAmount("");
    }
  }, [usdAmount, usdRate, selectedCoin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitTransaction(
        selectedCoin,
        receiverAddress,
        coinAmount
      );
      if (result.status === "success") {
        toast.success(
          "Transaction successful!\n" + "Transaction hash:" + result.message,
          {
            autoClose: false,
            closeOnClick: false,
          }
        );
        console.log(result.message);
      } else {
        toast.error("Error: " + result.message.reason, {
          autoClose: false,
          closeOnClick: false,
        });
        console.log(result.message.reason);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="font-[sans-serif] m-6 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="grid sm:grid-cols-2 gap-10">
        <div className="relative flex items-center sm:col-span-2">
          <label className="text-[13px] bg-white border text-black absolute px-2 top-[-10px] left-[18px]">
            Receiver address
          </label>
          <input
            type="text"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Enter receiver address"
            className="px-4 py-3.5 bg-gray-100 text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
          />
        </div>

        <div className="relative flex items-center">
          <label className="text-[13px] border bg-white text-black absolute px-2 top-[-10px] left-[18px]">
            Coin Amount
          </label>
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            placeholder="Enter amount"
            step={0.00000001} // Adjust step based on coin precision
            min="0"
            className="px-4 py-3.5 bg-gray-100 text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
          />
        </div>

        <div className="relative flex items-center sm:col-span-1">
          <label className="text-[13px] border bg-white text-black absolute px-2 top-[-10px] left-[18px]">
            USD Amount
          </label>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            className="px-4 py-3.5 bg-gray-100 text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`mt-8 px-6 py-2.5 text-sm rounded transition-all ${
          loading
            ? "bg-blue-500 text-white opacity-70 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Sending Transaction..." : "Submit Transaction"}
      </button>
    </form>
  );
};

export default SendForm;
