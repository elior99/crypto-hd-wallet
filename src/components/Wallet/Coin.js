import { useEffect } from "react";
import Image from "next/image";
import ethIcon from "../../../assets/eth-icon.svg";
import lineaIcon from "../../../assets/linea-icon.svg";

export default function Coin({ coinName, balance, usdRate, onClick }) {


  const getIcon = () => {
    switch (coinName) {
      case "Ethereum":
        return ethIcon;
      case "Linea":
        return lineaIcon;
      default:
        return null;
    }
  };



  return (
    <div
      className="flex items-center cursor-pointer shadow-[0_2px_6px_-1px_rgba(0,0,0,0.3)] rounded-lg w-full p-4"
      onClick={onClick}
    >
      <Image
        src={getIcon()} // Set the source based on the coinName
        className="w-10 h-10 rounded-full"
        alt={`${coinName} icon`}
      />
      <div className="ml-4 flex-1 flex justify-between items-center">
        <p className="text-sm text-gray-800 font-semibold">{coinName}</p>
        <p className="text-sm text-gray-800 font-semibold mr-2">
          {usdRate && usdRate[coinName]?.balanceUSD !== undefined ? (
            <>
              {balance} <span className="text-gray-500">ETH</span> ($
              {usdRate[coinName].balanceUSD})
            </>
          ) : (
            <>
              {balance} <span className="text-gray-500">ETH</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
