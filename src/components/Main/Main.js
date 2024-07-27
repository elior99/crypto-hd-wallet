import Image from "next/image";
import Menu from "../Menu/Menu";
import CreateWallet from "../CreateWallet/CreateWallet";
import Wallet from "../Wallet/Wallet";
import RestoreWallet from "../RestoreWallet/RestoreWallet";
import bgImage from "../../../assets/BG.svg";
import { useState } from "react";

const Main = () => {
  const [selectedComponent, setSelectedComponent] = useState("Menu");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Menu":
        return <Menu setSelectedComponent={setSelectedComponent} />;
      case "Wallet":
        return <Wallet setSelectedComponent={setSelectedComponent} />;
      case "CreateWallet":
        return <CreateWallet setSelectedComponent={setSelectedComponent} />;
      case "RestoreWallet":
        return <RestoreWallet />;
      default:
        return <Menu setSelectedComponent={setSelectedComponent} />;
    }
  };

  return (
    <div style={{height: "750px"}}className="bg-white grid sm:grid-cols-2 items-center shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] relative w-full max-w-6xl max-sm:max-w-sm rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
      <div className="min-h-[580px] h-full">
        <Image
          src={bgImage}
          className="h-full w-full object-cover"
          alt="card image"
          width={500}
          height={500}
        />
      </div>
      <div className="flex flex-col w-full h-full relative p-6">
        {selectedComponent !== "Menu" && (
          <div className="top-4 left-4">
            <button
              onClick={() => {
                setSelectedComponent("Menu");
              }}
              className="px-5 py-2.5 flex items-center justify-center shrink-0 cursor-pointer text-sm font-semibold text-black min-w-[110px] hover:bg-blue-500 hover:text-white rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 fill-current mr-3"
                viewBox="0 0 55.753 55.753"
              >
                <path
                  d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                  data-original="#000000"
                />
              </svg>
              Return
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center flex-grow">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Main;
