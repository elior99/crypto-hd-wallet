import React, { useState } from "react";
import { useWallet } from "@/lib/sessionContext";
const CreateWallet = ({ setSelectedComponent }) => {
  const { createWallet } = useWallet();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    const mnemonic = await createWallet(name, pass);
    setMnemonic(mnemonic);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center dark:text-black gap-10 bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] px-6 py-8 w-full max-w-md rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
        <form
          className="space-y-2 font-[sans-serif] max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold ">Create a Wallet</h1> 
          <input
            type="text"
            placeholder="Enter Wallet Name"
            className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-blue-500 rounded"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-3 bg-gray-100 w-full text-sm outline-none border-b-2 border-transparent focus:border-blue-500 rounded"
            onChange={(e) => setConfirmPass(e.target.value)}
            value={confirmPass}
          />

          <button
            type="submit"
            className="!mt-8 w-full px-4 py-2.5 mx-auto block text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        {mnemonic && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-center font-bold">Your Mnemonic Phrase</h2>
            <p className="text-center">{mnemonic}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateWallet;
