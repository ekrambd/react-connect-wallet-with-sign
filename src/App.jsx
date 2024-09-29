import React, { useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider, useAccount, useBalance, useSignMessage } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '971f219019235dbb4cb74e91e346a7cd'; // Replace with your actual projectId

// 2. Create wagmiConfig
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // The origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// 3. Use BSC Mainnet chain
const chains = [bsc];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 4. Create the Web3Modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional, can be omitted if not needed
});

function WalletInfo() {
  const { address, isConnected } = useAccount(); // Get the wallet address
  const { data: balance } = useBalance({ address }); // Get the balance for the connected address
  const { signMessage, data: signedMessage, isSuccess } = useSignMessage(); // Use data and isSuccess to capture the signed message
  const [signedResult, setSignedResult] = useState(null);

  // Function to handle signing a message after wallet connection
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

  // Capture the signed message once signing is successful
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
          {/* Button to trigger signing a message after wallet connection */}
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

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <h1>Welcome to AppKit</h1>
          {/* Web3Modal Button */}
          <w3m-button />
          {/* Display Wallet Information */}
          <WalletInfo />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;