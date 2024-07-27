import React, { createContext, useState, useEffect, useContext } from "react";
const { ethers } = require("ethers");
import CryptoJS from "crypto-js";
import { Coins } from "@/lib/data";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("Error");
  }
  return context;
};

const SECRET_KEY = "some-secure-key";

const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

const decryptText = (cipherText, key) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const SessionProvider = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usdRate, setUsdRate] = useState({
    Linea: { rateUSD: 0, balanceUSD: 0 },
    Ethereum: { rateUSD: 0, balanceUSD: 0 },
  });
  const [balances, setBalances] = useState({
    Linea: "",
    Ethereum: "",
  });
  const [logged, setLogged] = useState(false);
  let lineaProvider, ethereumProvider;

  useEffect(() => {
    loadWallet();
  }, []);

  


  const getBalanceUSD = async (coinId, balanceEth) => {
    try {
      // Fetch current ETH/USD price
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const coinUSD = data[coinId] ? data[coinId].usd : 0;

      // Calculate USD balance
      const balanceUsd = parseFloat(balanceEth) * coinUSD;

      //console.log(coinUSD, balanceUsd);
      return { coinUSD, balanceUsd };
    } catch (error) {
      console.error(`Error fetching balance for ${coinId}:`, error);
      return { coinUSD: 0, balanceUsd: 0 };
    }
  };

  useEffect(() => {
    if (currentWallet) {
      fetchBalances(lineaProvider, ethereumProvider);
      console.log(currentWallet);
    }
  }, [currentWallet]);

  useEffect(() => {
    sessionStorage.setItem("logged", logged ? "true" : "false");
  }, [logged]);

  const fetchBalances = async (lineaProvider, ethereumProvider) => {
    lineaProvider = new ethers.providers.JsonRpcProvider(Coins.Linea.provider);
    ethereumProvider = new ethers.providers.JsonRpcProvider(
      Coins.Ethereum.provider
    );
    const lineaBalance = await getBalance(
      currentWallet.Linea.address,
      lineaProvider
    );
    const ethereumBalance = await getBalance(
      currentWallet.Ethereum.address,
      ethereumProvider
    );
    setBalances({
      Linea: lineaBalance,
      Ethereum: ethereumBalance,
    });


    const { coinUSD: ethUSD, balanceUsd: ethUSDBalance } = await getBalanceUSD(
      "ethereum",
      ethereumBalance
    );
    const { coinUSD: lineaUSD, balanceUsd: lineaUSDBalance } =
      await getBalanceUSD("linea", lineaBalance);

    //console.log(lineaUSD, lineaUSDBalance, ethUSD, ethUSDBalance);



    setUsdRate({
      Linea: { rateUSD: lineaUSD, balanceUSD: lineaUSDBalance.toFixed(2) },
      Ethereum: { rateUSD: ethUSD, balanceUSD: ethUSDBalance.toFixed(2) },
    });


  };

  const getBalance = async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error);
      return "0";
    }
  };

  const createWallet = async (name, pass) => {
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic.phrase;

    const ethWallet0 = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
    const ethWallet1 = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1");

    const encryptedEth0PrivateKey = encryptPrivateKey(
      ethWallet0.privateKey,
      pass
    );
    const encryptedEth1PrivateKey = encryptPrivateKey(
      ethWallet1.privateKey,
      pass
    );

    const walletData = {
      Name: name,
      Linea: {
        address: ethWallet0.address,
        privateKey: ethWallet0.privateKey,
      },
      Ethereum: {
        address: ethWallet1.address,
        privateKey: ethWallet1.privateKey,
      },
    };

    const encryptedPass = encryptText(pass, SECRET_KEY);
    localStorage.setItem(
      `wallet-${name}`,
      encryptWalletData(
        {
          ...walletData,
          Linea: { ...walletData.Linea, privateKey: encryptedEth0PrivateKey },
          Ethereum: {
            ...walletData.Ethereum,
            privateKey: encryptedEth1PrivateKey,
          },
        },
        pass
      )
    );
    localStorage.setItem(`wallet-${name}-pass`, encryptedPass);
    setCurrentWallet(walletData);
    setLogged(true);
    return mnemonic;
  };

  const restoreWallet = async (name, pass, mnemonic) => {
    if (name == "" || pass == "") {
      throw new Error("Empty wallet name or password");
    }

    console.log("restoreWallet called with:", mnemonic);
    const cleanedMnemonic = mnemonic.trim().replace(/\u00A0/g, " ");
    if (!ethers.utils.isValidMnemonic(cleanedMnemonic)) {
      throw new Error("Invalid mnemonic");
    }

    const ethWallet0 = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
    const ethWallet1 = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1");

    const encryptedEth0PrivateKey = encryptPrivateKey(
      ethWallet0.privateKey,
      pass
    );
    const encryptedEth1PrivateKey = encryptPrivateKey(
      ethWallet1.privateKey,
      pass
    );

    const walletData = {
      Name: name,
      Linea: {
        address: ethWallet0.address,
        privateKey: ethWallet0.privateKey,
      },
      Ethereum: {
        address: ethWallet1.address,
        privateKey: ethWallet1.privateKey,
      },
    };

    const encryptedPass = encryptText(pass, SECRET_KEY);
    localStorage.setItem(
      `wallet-${name}`,
      encryptWalletData(
        {
          ...walletData,
          Linea: { ...walletData.Linea, privateKey: encryptedEth0PrivateKey },
          Ethereum: {
            ...walletData.Ethereum,
            privateKey: encryptedEth1PrivateKey,
          },
        },
        pass
      )
    );
    localStorage.setItem(`wallet-${name}-pass`, encryptedPass);
    setCurrentWallet(walletData);
    setLogged(true);
  };

  const login = (name = "", pass = "") => {
    try {
      const encryptedWallet = localStorage.getItem(`wallet-${name}`);
      const encryptedPass = localStorage.getItem(`wallet-${name}-pass`);

      if (encryptedWallet && encryptedPass) {
        const d_pass = decryptText(encryptedPass, SECRET_KEY);
        if (pass === d_pass) {
          const decryptedWallet = JSON.parse(
            decryptWallet(encryptedWallet, d_pass)
          );
          decryptedWallet.Linea.privateKey = decryptPrivateKey(
            decryptedWallet.Linea.privateKey,
            d_pass
          );
          decryptedWallet.Ethereum.privateKey = decryptPrivateKey(
            decryptedWallet.Ethereum.privateKey,
            d_pass
          );
          setCurrentWallet(decryptedWallet);
          setLogged(true);
          return `Welcome ${name}`;
        } else {
          return "Password is incorrect for wallet.";
        }
      } else {
        return "Invalid wallet, please create a new wallet or restore";
      }
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    setLogged(false);
    setCurrentWallet(null);
  };

  const encryptPrivateKey = (privateKey, pass) => {
    return CryptoJS.AES.encrypt(privateKey, pass).toString();
  };

  const decryptPrivateKey = (encryptedPrivateKey, pass) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, pass);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const encryptWalletData = (walletData, pass) => {
    return CryptoJS.AES.encrypt(JSON.stringify(walletData), pass).toString();
  };

  const decryptWallet = (encryptedWallet, pass) => {
    const bytes = CryptoJS.AES.decrypt(encryptedWallet, pass);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const getGasPriceFee = async (provider, gasLimit) => {
    try {
      const gasPrice = await provider.getGasPrice();
      const gasFee = gasPrice.mul(gasLimit);
      return { gasPrice, gasFee };
    } catch (error) {
      console.error("Error fetching gas price:", error);
      return null;
    }
  };

  const submitTransaction = async (coin, toAddress, amount) => {
    try {
      const privateKey = currentWallet[coin].privateKey;
      const fromAddress = currentWallet[coin].address;
      const wallet = new ethers.Wallet(privateKey);
      const provider = new ethers.providers.JsonRpcProvider(
        Coins[coin].provider
      );

      const gasLimit = 21000;

      const { gasPrice, gasFee } = await getGasPriceFee(provider, gasLimit);
      if (!gasPrice) {
        console.error("Failed to retrieve gas price.");
        return;
      }

      const connectedWallet = wallet.connect(provider);
      let amountWei = ethers.utils.parseEther(amount.toString());

      const tx = {
        from: fromAddress,
        to: toAddress,
        value: amountWei,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      };

      const transaction = await connectedWallet.sendTransaction(tx);

      const receipt = await transaction.wait();

      console.log(receipt.transactionHash);

      fetchBalances();

      return {
        status: "success",
        message: receipt.transactionHash,
      };
    } catch (error) {
      console.error(error);

      return {
        status: "failed",
        message: error,
      };
    }
  };

  const loadWallet = () => {
    setLoading(true);
    const loggedIn = sessionStorage.getItem("logged") === "true";
    if (loggedIn) {
      const encryptedWallet = localStorage.getItem("wallet");
      const encryptedPass = localStorage.getItem("wallet-pass");
      if (encryptedWallet && encryptedPass) {
        const pass = decryptText(encryptedPass, SECRET_KEY);
        const decryptedWallet = JSON.parse(
          decryptWallet(encryptedWallet, pass)
        );
        if (decryptedWallet) {
          decryptedWallet.Linea.privateKey = decryptPrivateKey(
            decryptedWallet.Linea.privateKey,
            pass
          );
          decryptedWallet.Ethereum.privateKey = decryptPrivateKey(
            decryptedWallet.Ethereum.privateKey,
            pass
          );
          setCurrentWallet(decryptedWallet);
          setLogged(true);
        }
      }
    }
    setLoading(false);
  };

  return (
    <WalletContext.Provider
      value={{
        currentWallet,
        balances,
        usdRate,
        createWallet,
        restoreWallet,
        login,
        logout,
        submitTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default SessionProvider;
