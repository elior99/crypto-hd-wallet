import React, { useState, useEffect } from "react";
import { useWallet } from "@/lib/sessionContext";
import Coin from "./Coin";
import ClickedCoin from "./ClickedCoin";
import { toast } from "react-toastify";

const Wallet = ({ setSelectedComponent }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [password, setPassword] = useState("");
  const { currentWallet, balances, login, logout, usdRate } = useWallet();
  const [walletLoaded, setWalletLoaded] = useState(false);


  useEffect(() => {
    if (currentWallet) {
      setWalletLoaded(true);
    } else {
      setWalletLoaded(false);
    }
  }, [currentWallet]);

  // useEffect(() => {
  //   if (walletLoaded) {
  //     console.log("Wallet loaded:", currentWallet);
  //   }
  // }, [walletLoaded, currentWallet]);

  const coins = {
    Linea: balances.Linea,
    Ethereum: balances.Ethereum,
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(walletName, password);
      if (res) {
        if (!res.includes("Welcome")) toast.error(res);
        else toast.success(res);
      }
    } catch (error) {
      toast.error(
        "Failed to load wallet, look at the console for more information."
      );
      console.error("Error loading wallet:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-10">
      {walletLoaded ? (
        <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] px-6 py-8 w-full rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-xl text-center font-bold flex-1 text-gray-800">
              {currentWallet.Name}'s Wallet
            </h3>
          </div>
          <div className="mt-8 space-y-4">
            {selectedCoin ? (
              <ClickedCoin
                selectedCoin={selectedCoin}
                balance={balances[selectedCoin]}
                usdRate={usdRate}
                onClick={() => {
                  setSelectedCoin(null);
                }}
              />
            ) : (
              Object.entries(coins).map(([coinName, balance]) => (
                <Coin
                  key={coinName}
                  coinName={coinName}
                  balance={balance}
                  usdRate={usdRate}
                  onClick={() => {
                    setSelectedCoin(coinName);
                  }}
                />
              ))
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700"
              onClick={() => {
                logout();
                setSelectedComponent("Menu");
              }}
            >
              Exit Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] px-6 py-8 w-full max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4 text-center text-gray-800">
          <form
            className="max-w-md mx-auto space-y-4 font-[sans-serif] text-[#333] mt-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Wallet Name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-transparent text-white hover:text-blue-700 transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Wallet;
