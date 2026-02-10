
import React from 'react';
import { ProfileData } from '../types';

interface VCardButtonProps {
  profile: ProfileData;
}

const VCardButton: React.FC<VCardButtonProps> = ({ profile }) => {
  const downloadVCard = () => {
    // Haptic feedback for tactile feel
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
    }

    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.name}`,
      `ORG:Edenic.Co`,
      `TITLE:${profile.title}`,
      `TEL;TYPE=CELL:${profile.phone}`,
      `EMAIL:${profile.email}`,
      `URL:${profile.website}`,
      `ADR:;;${profile.address}`,
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-6 pb-2 w-full">
        <button
        onClick={downloadVCard}
        className="group relative w-full py-4 rounded-[1.25rem] bg-[#002855] text-white font-semibold text-[17px] tracking-tight shadow-[0_8px_20px_-6px_rgba(0,40,85,0.4)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-center gap-3 relative z-10">
            <svg className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C8.58 8.28 10.13 7 12 7c2.21 0 4 1.79 4 4h.5c1.38 0 2.5 1.12 2.5 2.5S17.88 16 16.5 16z"/>
            </svg>
            <span className="opacity-95">Let's Connect!</span>
        </div>
        </button>
        <div className="text-center mt-4">
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium opacity-60">Designed by <span className="font-serif font-bold text-[#002855]">Edenic.Co</span></p>
        </div>
    </div>
  );
};

export default VCardButton;
