import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export const generateTicketId = () => {
  // Generate a unique 8-character ticket ID with prefix
  return `CCT-${nanoid(8).toUpperCase()}`;
};

export const generateQRCode = async (ticketId: string, registrationData: any) => {
  const qrData = {
    ticketId,
    name: registrationData.name,
    email: registrationData.email,
    game: registrationData.game,
    timestamp: new Date().toISOString()
  };
  
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};