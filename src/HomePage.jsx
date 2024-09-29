// HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';

function HomePage() {
  const { isConnected } = useAccount();
  const { signMessage, data: signedMessage, isSuccess } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const navigate = useNavigate();

  const handleSignMessage = () => {
    const message = 'This is a test message to sign';
    setIsSigning(true);
    signMessage({ message });
  };

  React.useEffect(() => {
    if (isSuccess && signedMessage) {
      // Redirect to WalletPage after signing is successful
      navigate('/wallet');
    }
  }, [isSuccess, signedMessage, navigate]);

  return (
    <div>
      <h1>Connect your wallet</h1>
      <w3m-button />
      {isConnected && (
        <div>
          <button onClick={handleSignMessage} disabled={isSigning}>
            {isSigning ? 'Signing...' : 'Sign Message'}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
