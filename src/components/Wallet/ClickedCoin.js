import React, { useState } from "react";
import { useWallet } from "@/lib/sessionContext";
import QRCode from "qrcode.react";
import SendForm from "./SendForm";

const ClickedCoin = ({ selectedCoin, balance, onClick }) => {
  const [selectedTab, setSelectedTab] = useState("receive");
  const { currentWallet } = useWallet();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const address = currentWallet[selectedCoin]?.address || "";

  return (
    <div className="relative p-4 border rounded-lg bg-white">
      <button
        onClick={onClick}
        className="absolute top-4 left-4 px-2 py-2 rounded-3xl bg-blue-500 text-white  flex justify-center"
      >
        <svg
          className="w-6 h-6 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
      </button>

      <h4 className="text-lg text-center font-bold ">{selectedCoin}</h4>
      <h3 className="font-semibold text-center dark:text-black mb-4">
        <span style={{ color: "gray" }}>Balance: </span>
         {balance}{" "}ETH
      </h3>

      <ul className="flex gap-4 bg-gray-100 rounded-2xl p-1 w-max mx-auto">
        <li
          className={`text-white-600 rounded-2xl font-semibold text-center text-sm py-3 px-6 tracking-wide cursor-pointer ${
            selectedTab === "receive" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabClick("receive")}
        >
          Receive
        </li>
        <li
          className={`text-white-600 rounded-2xl font-semibold text-center text-sm py-3 px-6 tracking-wide cursor-pointer ${
            selectedTab === "send" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabClick("send")}
        >
          Send
        </li>
      </ul>

      <div style={{height: "250px"}} className="mt-4 text-center text-gray-700">
        {selectedTab === "receive" && (
          <div className="mt-4">
            <div className="text-center font-semibold mb-2">
              Your {selectedCoin} receiving address:
            </div>
            <p className="text-center">{address}</p>
            <div className="mt-4 flex justify-center">
              {address && <QRCode value={address} size={128} level="H" />}
            </div>
          </div>
        )}
        {selectedTab === "send" && (
          <SendForm selectedCoin={selectedCoin} balance={balance} />
        )}
      </div>
    </div>
  );
};

export default ClickedCoin;
