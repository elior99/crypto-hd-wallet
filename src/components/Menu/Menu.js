import React from "react";

const Menu = ({ setSelectedComponent }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] px-6 py-8 w-full max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
      <h1 className="dark:text-black text-center mb-4 font-bold">
        Select Action
      </h1>
      <div className="flex flex-col space-y-4">
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-transparent text-white hover:text-blue-700 transition-all duration-300"
          onClick={() => setSelectedComponent("Wallet")}
        >
          Open Wallet
        </button>
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-transparent text-white hover:text-blue-700 transition-all duration-300"
          onClick={() => setSelectedComponent("CreateWallet")}
        >
          Create Wallet
        </button>
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-transparent text-white hover:text-blue-700 transition-all duration-300"
          onClick={() => setSelectedComponent("RestoreWallet")}
        >
          Restore Wallet
        </button>
      </div>
    </div>
  );
};

export default Menu;
