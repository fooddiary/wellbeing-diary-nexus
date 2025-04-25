
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Droplet } from "lucide-react";

interface WaterAmountControlProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

export const WaterAmountControl = ({ amount, onAmountChange }: WaterAmountControlProps) => {
  const adjustAmount = (change: number) => {
    onAmountChange(Math.max(50, Math.min(2000, amount + change)));
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Объем воды: {amount} мл</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustAmount(-50)}
            disabled={amount <= 50}
          >
            -
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustAmount(50)}
            disabled={amount >= 2000}
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Slider 
          min={50} 
          max={2000} 
          step={50} 
          value={[amount]} 
          onValueChange={(values) => onAmountChange(values[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>50 мл</span>
          <span>2000 мл</span>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => onAmountChange(100)}
            className="flex-1"
          >
            <Droplet className="h-4 w-4 mr-2" />
            100 мл
          </Button>
          <Button 
            variant="outline"
            onClick={() => onAmountChange(250)}
            className="flex-1"
          >
            <Droplet className="h-4 w-4 mr-2" />
            250 мл
          </Button>
          <Button 
            variant="outline"
            onClick={() => onAmountChange(500)}
            className="flex-1"
          >
            <Droplet className="h-4 w-4 mr-2" />
            500 мл
          </Button>
        </div>
      </div>
    </div>
  );
};
