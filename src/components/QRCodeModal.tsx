'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  secretCode: string;
}

export default function QRCodeModal({ 
  isOpen, 
  onClose, 
  eventName, 
  secretCode 
}: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && secretCode && typeof window !== 'undefined' && window.location) {
      const url = `${window.location.origin}/join-event?secretcode=${secretCode}`;
      setInviteUrl(url);
      generateQRCode(url);
    }
  }, [isOpen, secretCode]);

  const generateQRCode = async (url: string) => {
    try {
      // Ensure we're on the client side
      if (typeof window === 'undefined') {
        console.error('QR code generation attempted on server side');
        return;
      }

      // Validate URL format
      try {
        new URL(url);
        console.log('URL is valid:', url);
      } catch (urlError) {
        console.error('Invalid URL format:', url, urlError);
        return;
      }

      // Dynamic import to avoid SSR issues
      const QRCode = (await import('qrcode')).default;
      
      console.log('Generating QR code for URL:', url);
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      console.error('URL that failed:', url);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Invite to {eventName}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Share this QR code or URL with people you want to invite to this event.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code for event invite" 
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* URL with Copy Button */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Invite URL
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-600 break-all font-mono">
                  {inviteUrl || 'Loading...'}
                </p>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="flex-shrink-0"
                disabled={!inviteUrl}
              >
                {copySuccess ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share the QR code for easy mobile scanning</li>
              <li>• Copy and share the URL for direct access</li>
              <li>• Anyone with the link can join the event</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 