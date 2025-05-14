import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { InfoIcon, XIcon } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-primary" />
            {t('about.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h4 className="font-medium mb-2">{t('about.appInfo')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {t('about.description')}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.version')}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t('about.credits')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.creator')}: Ayan Roshan Umredkar
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.project')}: SAP
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t('about.thankYou')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.thankYouMessage')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>{t('common.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
