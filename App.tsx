
import React, { useState, useEffect, useRef } from 'react';
import { ProfileData } from './types';
import VCardButton from './components/VCardButton';
import { generateProfessionalBio } from './services/geminiService';

// Custom SVG Insights Data
const SVG_INSIGHTS = [
  {
    text: "In 2026 St Vincent & the Grenadines owners win by upgrading in place—stronger, cooler, smarter homes with efficient appliances and rentable spaces that match growing tourism and remote‑work demand.",
    source: "World Bank",
    url: "https://www.worldbank.org/en/news/feature/2026/01/20/building-back-better-and-stronger-in-saint-vincent-and-the-grenadines"
  },
  {
    text: "Beat rising 2026 costs in SVG by investing in hurricane‑ready roofs, energy‑saving systems, and modern finishes that attract higher‑paying guests and long‑term tenants.",
    source: "Tourism Analytics",
    url: "https://tourismanalytics.com/expertinsights/four-major-hotel-development-projects-for-st-vincent-and-the-grenadines"
  },
  {
    text: "Instead of chasing risky rate hikes, SVG owners in 2026 are “stay and upgrade”—adding smarter cooling, better insulation, and income‑ready studios to grow wealth at home.",
    source: "Adzboard",
    url: "https://adzboard.vc/st-vincent-the-grenadines-unveils-ec2-billion-tourism-boom-with-four-major-resort-projects/"
  },
  {
    text: "In 2026, the smartest SVG properties blend strength and style: hurricane‑smart structure, low‑maintenance exteriors, and flexible spaces that switch from family use to rental income.",
    source: "World Bank Blogs",
    url: "https://blogs.worldbank.org/en/latinamerica/caribbean-clean-energy-resilient-hub"
  },
  {
    text: "With big tourism projects coming, 2026 is the year to turn your SVG home into an asset—eco‑smart upgrades and rentable annexes that cash in on future visitor demand.",
    source: "Apex Capital",
    url: "https://apexcapital.partners/luxury-caribbean-real-estate-what-will-impact-demand-in-2026/"
  },
  {
    text: "SVG owners who upgrade in 2026 to cooler, well‑ventilated, solar‑ready homes are protecting themselves from rising energy prices while making their properties stand out in the market.",
    source: "Samsung",
    url: "https://www.samsung.com/latin_en/home-appliances/ai-energy-saving/"
  },
  {
    text: "From Calliaqua to North Leeward, 2026 buyers are watching build quality—solid foundations, good drainage, and storm‑smart roofs are now key reasons they choose one property over another.",
    source: "St Vincent Times",
    url: "https://www.stvincenttimes.com/govt-slashes-projects-galore-in-2026-budget/"
  }
];

// Edenic Brand Colors
const BRAND = {
  NAVY: '#002855',
  GREEN: '#00A651',
  WHITE: '#FFFFFF'
};

// Extracted ActionButton for Performance & Reusability
const ActionButton = ({ icon, label, onClick, href, delay }: { icon: React.ReactNode, label: string, onClick?: () => void, href?: string, delay: number }) => {
    const handlePress = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(15);
        }
        if (onClick) onClick();
    };

    const Wrapper = href ? 'a' : 'button';
    const props = href ? { href, target: "_blank", rel: "noreferrer", onClick: handlePress } : { onClick: handlePress };
    
    return (
      <Wrapper 
        {...props}
        className="ios-btn flex flex-col items-center justify-center aspect-square rounded-3xl text-[#002855] group relative overflow-hidden active:scale-95 transition-transform duration-200"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="relative z-10 text-[#002855] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <span className="relative z-10 text-[10px] font-bold mt-2 text-[#002855] opacity-80 group-hover:opacity-100 transition-opacity tracking-wide">{label}</span>
      </Wrapper>
    );
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "George J. Kruger",
    title: "Builder",
    email: "edenic.co@outlook.com",
    phone: "1[784] 531-1165",
    website: "www.edenic.com",
    address: "Biabou, Charlotte, St. Vincent & The Grenadines, W.I",
    linkedin: "https://www.linkedin.com/in/george-kruger-a9a88117b/",
    instagram: "https://www.instagram.com/edenic784/?hl=en",
    facebook: "https://www.facebook.com/Edenic.co/?ref=NONE_xav_ig_profile_page_web#",
    bio: "Loading professional bio..."
  });

  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrTab, setQrTab] = useState<'card' | 'instagram'>('card');
  
  // Insight Rotation State
  const [insightIndex, setInsightIndex] = useState(0);
  const [fadeInsight, setFadeInsight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const bio = await generateProfessionalBio(profile.name, profile.title);
      setProfile(prev => ({ ...prev, bio }));
      setLoading(false);
    };
    fetchData();
  }, []);

  // Automatic Insight Rotation with Pause support
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setFadeInsight(false); // Start fade out
      setTimeout(() => {
        setInsightIndex((prev) => (prev + 1) % SVG_INSIGHTS.length);
        setFadeInsight(true); // Start fade in
      }, 300); // Wait for fade out to finish
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const cardUrl = window.location.href;
  const qrColor = "002855";
  const cardQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(cardUrl)}&bgcolor=ffffff&color=${qrColor}&margin=10`;
  const instaQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profile.instagram)}&bgcolor=ffffff&color=${qrColor}&margin=10`;

  const handleQRToggle = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
    }
    setShowQR(true);
    setQrTab('card');
  };

  const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Edenic Digital Card',
                text: `Connect with ${profile.name} - ${profile.title}`,
                url: window.location.href,
            });
        } catch (error) {
            console.log('Error sharing:', error);
            handleQRToggle(); // Fallback
        }
    } else {
        handleQRToggle(); // Fallback
    }
  };

  const currentInsight = SVG_INSIGHTS[insightIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Orbs */}
      <div className="blob bg-[#00A651] w-[500px] h-[500px] rounded-full top-[-100px] left-[-100px] opacity-[0.15] animate-blob mix-blend-screen"></div>
      <div className="blob bg-[#002855] w-[500px] h-[500px] rounded-full bottom-[-100px] right-[-100px] opacity-[0.3] animate-blob animation-delay-2000 mix-blend-screen"></div>
      <div className="blob bg-white w-[300px] h-[300px] rounded-full top-[40%] left-[40%] opacity-[0.05] animate-blob animation-delay-4000 mix-blend-overlay"></div>

      {/* Main Card Container */}
      <div className="w-full max-w-[390px] relative z-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-12">
        
        {/* Profile Header Card */}
        <div className="glass-panel p-8 pb-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
            
            {/* Top Brand Bar */}
            <div className="w-full flex justify-between items-start mb-2">
                 {/* Logo Icon Only */}
                <div className="flex items-center gap-2">
                     <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4L4 16H8V32H32V16H36L20 4Z" stroke={BRAND.NAVY} strokeWidth="3" fill="none"/>
                        <path d="M20 28C14 28 12 24 12 20C12 16 16 14 20 14C24 14 28 16 28 20C28 24 26 28 20 28Z" fill={BRAND.GREEN}/>
                     </svg>
                     <span className="font-serif font-black text-xl text-[#002855] tracking-wide">Edenic.Co</span>
                </div>

                {/* QR Toggle */}
                <button 
                    onClick={handleQRToggle}
                    className="w-10 h-10 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-[#002855] hover:bg-white transition-all shadow-sm active:scale-90"
                    aria-label="Show QR Code"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                </button>
            </div>

            {/* Avatar */}
            <div className="mt-4 mb-5 relative">
                <div className="w-32 h-32 rounded-full p-1.5 bg-white shadow-xl relative z-10">
                    <img 
                        src="https://picsum.photos/seed/george/400/400" 
                        alt={`${profile.name} Profile`} 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>

            <h1 className="text-3xl font-extrabold text-[#002855] tracking-tight leading-tight">{profile.name}</h1>
            <p className="text-sm font-bold text-[#00A651] uppercase tracking-[0.15em] mt-1.5 mb-2">{profile.title}</p>
            <p className="text-[13px] font-serif italic text-[#002855] font-medium mt-1">Your property, Our priority!</p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-4">
             <ActionButton 
                delay={100}
                href={`tel:${profile.phone}`}
                label="Call"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
             />
             <ActionButton 
                delay={200}
                href={`mailto:${profile.email}`}
                label="Email"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
             />
             <ActionButton 
                delay={300}
                href={profile.instagram}
                label="Insta"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
             />
             <ActionButton 
                delay={400}
                onClick={handleShare}
                label="Share"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
             />
        </div>

        {/* Widgets Stack */}
        <div className="flex flex-col gap-6">
            
            {/* Bio Widget */}
            <div className="glass-panel p-6 rounded-3xl relative">
                <div className="flex items-center gap-2 mb-4 border-b border-[#002855]/10 pb-2">
                     <span className="text-[11px] font-bold text-[#002855] uppercase tracking-widest">About</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#00A651]"></div>
                </div>
                {loading ? (
                    <div className="space-y-2.5 opacity-50 animate-pulse">
                        <div className="h-3 bg-slate-300 rounded w-full"></div>
                        <div className="h-3 bg-slate-300 rounded w-4/5"></div>
                        <div className="h-3 bg-slate-300 rounded w-3/5"></div>
                    </div>
                ) : (
                    <p className="text-[14px] leading-relaxed text-[#002855] font-medium font-sans">
                        {profile.bio}
                    </p>
                )}
            </div>

            {/* SVG Insights Widget - Pauses on Hover/Touch */}
             <div 
                className="glass-panel p-6 rounded-3xl relative overflow-hidden group min-h-[160px] flex flex-col justify-between"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <svg className="w-20 h-20 text-[#00A651]" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                </div>
                
                <div className="flex items-center gap-2 mb-3 relative z-10 border-b border-[#002855]/10 pb-2">
                    <span className="text-[11px] font-bold text-[#002855] uppercase tracking-widest">SVG Insights</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00A651]"></div>
                </div>
                
                <div className={`transition-opacity duration-300 relative z-10 ${fadeInsight ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-[13px] text-[#002855] leading-relaxed font-semibold">
                        {currentInsight.text}
                    </p>
                    {/* Source Link */}
                    <div className="mt-4 text-right">
                         <a href={currentInsight.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#00A651] hover:text-[#002855] font-bold tracking-wide hover:underline transition-colors">
                            SOURCE: {currentInsight.source.toUpperCase()}
                         </a>
                    </div>
                </div>

                {/* Progress Indicators (Dots) */}
                <div className="flex gap-1.5 mt-2 absolute bottom-6 left-6 opacity-40">
                     {SVG_INSIGHTS.map((_, i) => (
                         <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-300 ${i === insightIndex ? 'bg-[#002855]' : 'bg-[#00A651]'}`}></div>
                     ))}
                </div>
            </div>

            {/* Review Widget */}
            <a 
              href="https://www.facebook.com/Edenic.co/reviews/?id=100094013441596&sk=reviews" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => navigator.vibrate?.(10)}
              className="glass-panel p-5 rounded-3xl flex items-center justify-between group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all"
            >
                {/* Background Decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                   <svg className="w-32 h-32 text-[#002855]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform duration-300">
                        {/* Facebook-ish Star Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-[#002855]">Leave a Review</span>
                        <span className="text-[10px] font-medium text-[#002855] opacity-60">Help us grow with your feedback</span>
                    </div>
                </div>

                <div className="relative z-10 w-8 h-8 rounded-full bg-[#002855] flex items-center justify-center text-white shadow-md group-hover:bg-[#00A651] transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
            </a>
            
            {/* Location & Socials Row */}
            <div className="flex gap-6 items-stretch">
                 <div className="glass-panel p-5 rounded-3xl flex-1 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#002855]/5 to-transparent rounded-bl-[2rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <svg className="w-3 h-3 text-[#00A651]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span className="text-[10px] font-bold text-[#002855] uppercase tracking-widest opacity-60">Office</span>
                    </div>
                    <p className="text-[13px] text-[#002855] font-bold leading-tight">Biabou, St. Vincent</p>
                 </div>
                 
                 {/* Social Dock - iPhone App Icon Style */}
                 <div className="glass-panel p-2.5 rounded-3xl flex items-center justify-center gap-2.5">
                    {/* Instagram */}
                    <a href={profile.instagram} target="_blank" rel="noreferrer" 
                       onClick={() => navigator.vibrate?.(10)}
                       className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-[16px] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:scale-105 relative overflow-hidden group/icon ring-1 ring-black/5"
                    >
                      <svg className="w-6 h-6 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>

                    {/* LinkedIn */}
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" 
                       onClick={() => navigator.vibrate?.(10)}
                       className="w-12 h-12 bg-[#0077b5] rounded-[16px] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:scale-105 ring-1 ring-black/5"
                    >
                        <svg className="w-5 h-5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>

                    {/* Facebook */}
                    <a href={profile.facebook} target="_blank" rel="noreferrer" 
                       onClick={() => navigator.vibrate?.(10)}
                       className="w-12 h-12 bg-[#1877F2] rounded-[16px] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:scale-105 ring-1 ring-black/5"
                    >
                        <svg className="w-6 h-6 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.667 4.53-4.667 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                 </div>
            </div>

        </div>

        {/* Footer Action */}
        <VCardButton profile={profile} />

      </div>

      {/* Modern QR Overlay */}
      {showQR && (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-end md:justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowQR(false)}
        >
            <div 
                className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 pb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-8"></div>
                
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8">
                    <button 
                        onClick={() => setQrTab('card')}
                        className={`flex-1 py-3 rounded-xl text-[12px] font-bold transition-all duration-300 shadow-sm ${qrTab === 'card' ? 'bg-white text-[#002855]' : 'text-slate-500 bg-transparent shadow-none'}`}
                    >
                        CONTACT
                    </button>
                    <button 
                        onClick={() => setQrTab('instagram')}
                        className={`flex-1 py-3 rounded-xl text-[12px] font-bold transition-all duration-300 shadow-sm ${qrTab === 'instagram' ? 'bg-white text-[#002855]' : 'text-slate-500 bg-transparent shadow-none'}`}
                    >
                        INSTAGRAM
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-100 mb-6">
                         <img 
                            src={qrTab === 'card' ? cardQrUrl : instaQrUrl} 
                            alt="QR Code" 
                            className="w-56 h-56 rounded-xl"
                         />
                    </div>
                    <p className="text-slate-500 text-sm font-medium text-center max-w-[200px]">
                        Scan to {qrTab === 'card' ? 'save contact details' : 'follow us on Instagram'}
                    </p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;
