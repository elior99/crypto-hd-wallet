import React, { useState } from "react";
import { useWallet } from "@/lib/sessionContext";
import { toast } from "react-toastify";

const RestoreWallet = ({ setSelectedComponent }) => {
  const { restoreWallet } = useWallet();
  const [walletName, setWalletName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restoreWallet(walletName, password, mnemonic);
    } catch (error) {
      toast.error(`Failed to restore wallet: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center dark:text-black gap-5 bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] px-6 py-8 w-full max-w-md rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
      <form
        className="space-y-4 font-[sans-serif] max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center font-bold text-xl">Restore Wallet</h1>
        <p className="text-center font-semibold">
          Restore your wallet by using a mnemonic phrase.
        </p>

        <input
          type="text"
          placeholder="Wallet Name"
          className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-blue-500 rounded"
          onChange={(e) => setWalletName(e.target.value)} // Set wallet name
          value={walletName}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-blue-500 rounded"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <textarea
          placeholder="Enter Mnemonic Phrase"
          className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-blue-500 rounded"
          onChange={(e) => setMnemonic(e.target.value)} // Set mnemonic
          value={mnemonic}
          rows={4}
        />

        <button
          type="submit"
          className="!mt-8 px-4 py-2.5 mx-auto block text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restore Wallet
        </button>
      </form>
    </div>
  );
};

export default RestoreWallet;
