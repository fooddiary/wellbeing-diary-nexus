
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const SecuritySettings = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">🔒 Безопасность</h3>
      
      <div className="space-y-4">
        <Button 
          variant="outline"
          className="w-full" 
        >
          Создать резервную копию
        </Button>
        
        <div className="flex items-center justify-between">
          <span>Очистка старых фото</span>
          <Switch id="autoCleanup" />
        </div>
      </div>
    </Card>
  );
};
