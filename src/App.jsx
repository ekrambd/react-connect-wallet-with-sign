import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider, useAccount, useBalance, useSignMessage } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers'; // Import ethers from 'ethers'


// 0. Setup queryClient for react-query
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '971f219019235dbb4cb74e91e346a7cd'; // Replace with your actual projectId

// 2. Create wagmiConfig with BSC chain
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // The origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
const chains = [bsc];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create the Web3Modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional
});

const USDT_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'; // USDT contract address on BSC

// Function to display USDT balance
function USDTBalance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
        const balanceBigNumber = await usdtContract.balanceOf(address);
        const balanceInEther = ethers.utils.formatUnits(balanceBigNumber, 18); // USDT has 18 decimal places
        setBalance(balanceInEther);
      } catch (error) {
        console.error('Error fetching USDT balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  if (!isConnected) {
    return <p>Please connect your wallet.</p>;
  }

  if (loading) {
    return <p>Loading balance...</p>;
  }

  return <p>Your USDT balance: {balance}</p>;
}

// Function to handle wallet information and message signing
function WalletInfo() {
  const { address, isConnected } = useAccount(); // Get the wallet address
  const { data: balance } = useBalance({ address }); // Get the balance for the connected address
  const { signMessage, data: signedMessage, isSuccess } = useSignMessage(); // Handle message signing
  const [signedResult, setSignedResult] = useState(null);

  // Function to handle signing a message
  const handleSignMessage = () => {
    const message = 'This is a test message to sign'; // Message to sign
    signMessage({ message });
  };

  useEffect(() => {
    if (isConnected) {
      console.log('Connected Address:', address); // Log the connected address
      console.log('Balance:', balance?.formatted, balance?.symbol); // Log the balance
    }
  }, [address, balance, isConnected]);

  useEffect(() => {
    if (isSuccess && signedMessage) {
      console.log('Signed Message:', signedMessage); // Log the signed message
      setSignedResult(signedMessage); // Store the signed message
    }
  }, [isSuccess, signedMessage]);

  return (
    <div>
      {isConnected ? (
        <div>
          <p>
            Connected: {address} <br />
            Balance: {balance?.formatted} {balance?.symbol}
          </p>
          <button onClick={handleSignMessage}>Sign Message</button>
          {signedResult && (
            <p>
              Signed Message: {signedResult}
            </p>
          )}
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Login</h5>
                  <w3m-button /> {/* Web3Modal Button */}
                </div>
                <div className="card-body">
                  <Outlet /> {/* Render child routes */}
                  <USDTBalance /> {/* Display USDT balance */}
                  <WalletInfo /> {/* Display wallet info and sign message */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </QueryClientProvider>
    </WagmiProvider>
  );
}
