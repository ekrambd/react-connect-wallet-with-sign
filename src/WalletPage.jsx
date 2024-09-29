// WalletPage.jsx
import React, { useEffect, useState } from 'react';
import { useAccount, useBalance, useSignMessage } from 'wagmi';

function WalletPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { signMessage, data: signedMessage, isSuccess } = useSignMessage();
  const [signedResult, setSignedResult] = useState(null);

  const handleSignMessage = () => {
    const message = 'This is a test message to sign';
    signMessage({ message });
  };

  useEffect(() => {
    if (isConnected) {
      console.log('Connected Address:', address);
      console.log('Balance:', balance?.formatted, balance?.symbol);
    }
  }, [address, balance, isConnected]);

  useEffect(() => {
    if (isSuccess && signedMessage) {
      console.log('Signed Message:', signedMessage);
      setSignedResult(signedMessage);
    }
  }, [isSuccess, signedMessage]);

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <p>
            Connected: {address} <br />
            Balance: {balance?.formatted} {balance?.symbol}
          </p>
          <button onClick={handleSignMessage}>Sign Message</button>
          <button>dd</button>
          {signedResult && <p>Signed Message: {signedResult}</p>}
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}

export default WalletPage;
