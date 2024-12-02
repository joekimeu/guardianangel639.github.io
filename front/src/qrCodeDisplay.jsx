import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

const QRCodeDisplay = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    // Fetch the QR code data from the server
    fetch('http://localhost:8081/totp/register', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        // Set the QR code URL received from the server
        setQrCodeUrl(data.qrCodeUrl);
      })
      .catch((error) => console.error('Error fetching QR code:', error));
  }, []);

  return (
    <div>
      <h1>Scan this QR Code</h1>
      {qrCodeUrl ? (
        <QRCode value={qrCodeUrl} size={512} />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;