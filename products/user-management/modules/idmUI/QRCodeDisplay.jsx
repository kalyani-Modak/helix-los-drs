import { QRCodeSVG } from 'qrcode.react';
/**
 * QRCodeDisplay component renders a QR code for the provided URL.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.url - The URL to encode into the QR code.
 * @returns {JSX.Element|null} The rendered QR code or null if no URL is provided.
 */
const QRCodeDisplay = ({ url }) => {
  if (!url) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
      <QRCodeSVG
        value={url}
        size={160}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
        title="QR Code"
      />

    </div>
  );
};

export default QRCodeDisplay;
