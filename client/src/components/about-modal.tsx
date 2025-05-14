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
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 border-indigo-200 dark:border-indigo-800">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-bold">{t('about.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">{t('about.appInfo')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {t('about.description')}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.version')}
            </p>
          </div>
          
          <div className="p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2 text-purple-700 dark:text-purple-300">{t('about.credits')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{t('about.creator')}:</span> Ayan Roshan Umredkar
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{t('about.project')}:</span> SAP
            </p>
          </div>
          
          <div className="p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2 text-cyan-700 dark:text-cyan-300">{t('about.thankYou')}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('about.thankYouMessage')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
