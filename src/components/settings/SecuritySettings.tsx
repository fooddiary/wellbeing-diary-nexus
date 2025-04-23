
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { CleanupPhotosDialog } from "@/components/CleanupPhotosDialog";

export const SecuritySettings = () => {
  const [autoCleanup, setAutoCleanup] = useState(false);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  
  const handleBackup = () => {
    toast.success("Резервная копия создана успешно");
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">🔒 Безопасность</h3>
      
      <div className="space-y-4">
        <Button 
          variant="outline"
          className="w-full" 
          onClick={handleBackup}
        >
          Создать резервную копию
        </Button>
        
        <div className="flex items-center justify-between">
          <span>Очистка старых фото</span>
          <Switch 
            id="autoCleanup"
            checked={autoCleanup}
            onCheckedChange={setAutoCleanup}
          />
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowCleanupDialog(true)}
        >
          Очистить неиспользуемые фото
        </Button>
      </div>

      <CleanupPhotosDialog 
        open={showCleanupDialog} 
        onOpenChange={(open) => setShowCleanupDialog(open)} 
      />
    </Card>
  );
};
