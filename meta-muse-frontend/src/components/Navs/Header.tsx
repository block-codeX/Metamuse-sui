import React, { useEffect, useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { setConnectedWallet } from '@/redux/slice/user-slice';
import Button from '../Form/Button';

const Header: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const [address, setAddress] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ validUser?: boolean } | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    // Check if window.ethereum is available
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      console.warn("MetaMask is not installed. Please consider installing it to use wallet features.");
    }

    // Retrieve user from localStorage safely
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(user);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  // Check wallet connection status on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          dispatch(setConnectedWallet(accounts[0]));
        }
      }
    };
    checkWalletConnection();
  }, [dispatch, web3]);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await web3.eth.requestAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          dispatch(setConnectedWallet(accounts[0]));
        }
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    dispatch(setConnectedWallet(null));
    console.log("Wallet disconnected.");
  };

  const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black text-white top-0">
      <div className="flex items-center space-x-4">
        <Link href="/"><img src="/asset/logo.svg" alt="logo" className="h-[50px]" /></Link>
        <Link href="/ongoing-projects" className="flex items-center px-6 py-1 text-center outline-none rounded-[50px] border-[3px] border-[#D42C2CB2] h-[50px]">
          Studio
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex bg-none border-[1px] border-white items-center px-4 rounded-full">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1 bg-gray-800 rounded text-white bg-transparent border-none outline-none"
          />
          <Search className="text-white" />
        </div>

        {/* Display wallet address, connect button, or disconnect button */}
        {address ? (
          <div className="flex items-center ml-4 space-x-2">
            <span>{formattedAddress}</span>
            <button 
              onClick={disconnectWallet} 
              className="text-white border border-white px-4 py-2 rounded-full">
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button 
            onClick={connectWallet} 
            className="ml-4 text-white border border-white px-4 py-2 rounded-full">
            Connect Wallet
          </button>
        )}

        {/* Dropdown Menu */}
        {!currentUser?.validUser ? (
          <div onClick={toggleDropdown} className="relative">
            <Menu className="text-white cursor-pointer" />
            {dropdownVisible && (
              <div className="flex flex-col absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg p-4 z-50">
                <Link href="/auth/sign-up" className="w-full py-2 text-center border border-[#D42C2CB2] rounded-full mb-2 text-[#D42C2CB2]">
                  Sign-up
                </Link>
                <Link href="/auth/sign-in" className="w-full py-2 text-center border border-[#D42C2CB2] rounded-full text-[#D42C2CB2]">
                  Log-in
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Button 
            label='Logout' 
            className='w-[100px] bg-[#D42C2CB2] text-white' 
            onClick={() => { 
              localStorage.clear();  
              window.location.reload();
            }} 
          />
        )}
      </div>
    </header>
  );
};

export default Header;
