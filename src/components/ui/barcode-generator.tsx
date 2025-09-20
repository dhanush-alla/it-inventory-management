
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';

interface BarcodeProps {
  value: string;
  className?: string;
  options?: {
    format?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    fontSize?: number;
    margin?: number;
    background?: string;
    lineColor?: string;
  };
}

export function BarcodeGenerator({ 
  value, 
  className,
  options = {} 
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const {
    format = 'CODE128',
    width = 2,
    height = 100,
    displayValue = true,
    fontSize = 20,
    margin = 10,
    background = '#ffffff',
    lineColor = '#000000'
  } = options;
  
  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          margin,
          background,
          lineColor
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, format, width, height, displayValue, fontSize, margin, background, lineColor]);
  
  return (
    <div className={cn("w-full flex justify-center", className)}>
      <svg ref={svgRef} className="max-w-full"></svg>
    </div>
  );
}

export default BarcodeGenerator;
