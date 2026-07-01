import { FC } from "react";

interface HeritageMotifProps {
  className?: string;
}

export const HeritageMotif: FC<HeritageMotifProps> = ({
  className = "text-[#152F18]/5",
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}>
      {/* Repeating Pattern Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        fill="none"
        stroke="currentColor"
      >
        <pattern
          id="heritage-pattern"
          x="0"
          y="0"
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
        >
          {/* Hand-drawn spiral */}
          <path
            d="M 35,35 Q 45,22 48,35 Q 50,48 35,50 Q 20,42 32,28 Q 42,16 46,26"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          
          {/* Hand-drawn sun motif */}
          <circle cx="120" cy="45" r="9" strokeWidth="1.8" />
          <line x1="120" y1="28" x2="120" y2="35" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="120" y1="55" x2="120" y2="62" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="103" y1="45" x2="110" y2="45" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="130" y1="45" x2="137" y2="45" strokeWidth="1.8" strokeLinecap="round" />
          
          {/* Adinkra Chevron group */}
          <path d="M 40,115 L 55,130 L 70,115" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 47,122 L 55,130 L 63,122" strokeWidth="1.2" strokeLinecap="round" />

          {/* Hand-drawn eye / leaf market symbol */}
          <path d="M 105,120 C 110,108 130,108 135,120 C 130,132 110,132 105,120 Z" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="120" cy="120" r="3.5" fill="currentColor" />

          {/* Hand-drawn decorative line accents */}
          <path d="M 15,90 L 30,90" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 85,90 L 100,90" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 155,90 L 170,90" strokeWidth="1.8" strokeLinecap="round" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#heritage-pattern)" />
      </svg>

      {/* Giant Native Scribble Lines - Floating watermarks */}
      {/* 1. Large hand-drawn spiral in top right */}
      <svg className="absolute -top-16 -right-16 w-80 h-80 opacity-[0.4]" viewBox="0 0 200 200" fill="none" stroke="currentColor">
        <path
          d="M 20,100 C 50,20 180,30 170,110 C 160,180 80,170 90,110 C 100,60 150,80 130,120 C 120,140 100,130 110,110"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 2. Flowing native brush ribbon across the bottom-left */}
      <svg className="absolute -bottom-10 -left-20 w-[480px] h-40 opacity-[0.35]" viewBox="0 0 400 100" fill="none" stroke="currentColor">
        <path
          d="M 10,80 C 100,20 200,90 300,30 C 350,10 380,40 395,60"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 20,85 C 105,27 202,96 302,34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="10 8"
          opacity="0.6"
        />
      </svg>
      
      {/* 3. Hand-drawn sunburst watermark middle right */}
      <svg className="absolute top-[45%] right-10 w-24 h-24 opacity-[0.4]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="14" strokeWidth="2.5" />
        <path d="M 50,10 L 50,25 M 50,75 L 50,90 M 10,50 L 25,50 M 75,50 L 90,50 M 22,22 L 32,32 M 68,68 L 78,78 M 22,78 L 32,68 M 68,32 L 78,22" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default HeritageMotif;
