
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { cn } from '@/lib/utils';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export function QRCodeGenerator({
  value,
  size = 200,
  className,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'L',
  includeMargin = true
}: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;

    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: includeMargin ? 4 : 0,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: level,
        });
        setQRCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [value, size, bgColor, fgColor, level, includeMargin]);

  if (!value) {
    return null;
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <img
        src={qrCodeDataUrl}
        alt={`QR Code for ${value}`}
        width={size}
        height={size}
      />
    </div>
  );
}

export default QRCodeGenerator;
