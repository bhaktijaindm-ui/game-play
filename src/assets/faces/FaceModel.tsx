import React, { useId, memo } from 'react';
import type { FaceRecipe, ShadeApplication } from '../types';
import { SHADES } from '../config/shades';

export interface FaceModelProps {
  model: string; // '1' - '6'
  skinTone?: string;
  makeupRecipe?: FaceRecipe;
  width: number;
  className?: string;
}

interface ModelDefinition {
  faceShapeName: string;
  baseSkinTone: string;
  shadowSkinTone: string;
  highlightSkinTone: string;
  hairColor: string;
  hairAccentColor: string;
  hairStyle: 'sleek_bob' | 'soft_waves' | 'heart_curls' | 'square_lob' | 'diamond_updo' | 'long_crown';
  jawPath: string;
  earLeft: string;
  earRight: string;
  eyebrowLeft: string;
  eyebrowRight: string;
}

const MODEL_DEFINITIONS: Record<string, ModelDefinition> = {
  // Model 1: Oval face - balanced, softly curved jawline
  '1': {
    faceShapeName: 'Oval',
    baseSkinTone: '#FDDCBF',
    shadowSkinTone: '#F5C9A6',
    highlightSkinTone: '#FFF2E5',
    hairColor: '#2B1B17',
    hairAccentColor: '#4A2F27',
    hairStyle: 'sleek_bob',
    jawPath: 'M 175,270 C 160,370 170,500 215,615 C 245,655 270,660 300,660 C 330,660 355,655 385,615 C 430,500 440,370 425,270 C 410,180 190,180 175,270 Z',
    earLeft: 'M 170,350 C 145,350 142,420 166,430',
    earRight: 'M 430,350 C 455,350 458,420 434,430',
    eyebrowLeft: 'M 176,322 C 205,302 245,308 266,325',
    eyebrowRight: 'M 424,322 C 395,302 355,308 334,325',
  },
  // Model 2: Round face - gentle curved cheeks, softer rounded chin
  '2': {
    faceShapeName: 'Round',
    baseSkinTone: '#E8BA91',
    shadowSkinTone: '#D4A67D',
    highlightSkinTone: '#F8DCBE',
    hairColor: '#211510',
    hairAccentColor: '#3A261D',
    hairStyle: 'soft_waves',
    jawPath: 'M 162,280 C 148,380 156,515 204,612 C 238,650 268,655 300,655 C 332,655 362,650 396,612 C 444,515 452,380 438,280 C 420,185 180,185 162,280 Z',
    earLeft: 'M 160,360 C 136,360 134,425 158,435',
    earRight: 'M 440,360 C 464,360 466,425 442,435',
    eyebrowLeft: 'M 176,324 C 205,306 244,310 265,327',
    eyebrowRight: 'M 424,324 C 395,306 356,310 335,327',
  },
  // Model 3: Heart face - wide brow, high sculpted cheekbones, delicate tapered chin
  '3': {
    faceShapeName: 'Heart',
    baseSkinTone: '#D4956B',
    shadowSkinTone: '#C08558',
    highlightSkinTone: '#E8B690',
    hairColor: '#1A120E',
    hairAccentColor: '#36231A',
    hairStyle: 'heart_curls',
    jawPath: 'M 165,260 C 150,360 160,470 215,595 C 255,650 280,670 300,670 C 320,670 345,650 385,595 C 440,470 450,360 435,260 C 420,175 180,175 165,260 Z',
    earLeft: 'M 162,350 C 138,350 136,415 160,425',
    earRight: 'M 438,350 C 462,350 464,415 440,425',
    eyebrowLeft: 'M 174,320 C 205,298 245,304 266,323',
    eyebrowRight: 'M 426,320 C 395,298 355,304 334,323',
  },
  // Model 4: Square-ish face - defined jawline, structured cheeks
  '4': {
    faceShapeName: 'Square',
    baseSkinTone: '#B87A4F',
    shadowSkinTone: '#A4693E',
    highlightSkinTone: '#CF996F',
    hairColor: '#120E0C',
    hairAccentColor: '#2C1D18',
    hairStyle: 'square_lob',
    jawPath: 'M 170,265 C 158,370 164,510 196,605 C 226,645 260,655 300,655 C 340,655 374,645 404,605 C 436,510 442,370 430,265 C 416,182 184,182 170,265 Z',
    earLeft: 'M 165,355 C 140,355 138,425 162,435',
    earRight: 'M 435,355 C 460,355 462,425 438,435',
    eyebrowLeft: 'M 176,320 C 206,300 246,305 268,322',
    eyebrowRight: 'M 424,320 C 394,300 354,305 332,322',
  },
  // Model 5: Diamond face - high dramatic cheekbones, sleek temples, sculpted chin
  '5': {
    faceShapeName: 'Diamond',
    baseSkinTone: '#8B5E3C',
    shadowSkinTone: '#774E2E',
    highlightSkinTone: '#A97A55',
    hairColor: '#0E0B0A',
    hairAccentColor: '#281E19',
    hairStyle: 'diamond_updo',
    jawPath: 'M 185,270 C 154,370 156,470 210,605 C 245,655 275,668 300,668 C 325,668 355,655 390,605 C 444,470 446,370 415,270 C 395,190 205,190 185,270 Z',
    earLeft: 'M 172,350 C 148,350 146,420 170,430',
    earRight: 'M 428,350 C 452,350 454,420 430,430',
    eyebrowLeft: 'M 176,318 C 208,296 248,302 268,322',
    eyebrowRight: 'M 424,318 C 392,296 352,302 332,322',
  },
  // Model 6: Long face - slender elegant silhouette, poised jaw, refined vertical balance
  '6': {
    faceShapeName: 'Long',
    baseSkinTone: '#5C3D2E',
    shadowSkinTone: '#4A3020',
    highlightSkinTone: '#775240',
    hairColor: '#080706',
    hairAccentColor: '#1E1715',
    hairStyle: 'long_crown',
    jawPath: 'M 180,250 C 168,360 172,525 215,635 C 250,675 275,680 300,680 C 325,680 350,675 385,635 C 428,525 432,360 420,250 C 405,170 195,170 180,250 Z',
    earLeft: 'M 174,355 C 150,355 148,425 172,435',
    earRight: 'M 426,355 C 450,355 452,425 428,435',
    eyebrowLeft: 'M 178,320 C 208,304 246,308 266,325',
    eyebrowRight: 'M 422,320 C 392,304 354,308 334,325',
  },
};

const SHADE_COLOR_MAP: Record<string, string> = {
  rose: '#FF5C9E',
  lavender: '#9B6BFF',
  peach: '#FF9E80',
  ruby: '#E8344E',
  gold: '#F2B84B',
  mint: '#3FCB9B',
  sky: '#4DA3FF',
  turmeric: '#F5B700',
  henna: '#A24A22',
  berry: '#9C27B0',
  crimson: '#D32F2F',
  kohl: '#1A181B',
  champagne: '#F7E7CE',
};

function resolveShadeColor(shade: string): string {
  if (SHADES && SHADES[shade]?.lightColor) {
    return SHADES[shade].lightColor;
  }
  return SHADE_COLOR_MAP[shade] || '#FF5C9E';
}

function resolveShadeBlendMode(shade: string): React.CSSProperties['mixBlendMode'] {
  const darks = ['kohl', 'crimson', 'berry', 'henna', 'ruby'];
  const lights = ['gold', 'champagne', 'mint', 'sky', 'peach'];
  if (darks.includes(shade)) return 'multiply';
  if (lights.includes(shade)) return 'screen';
  return 'normal';
}

export const FaceModel: React.FC<FaceModelProps> = memo(({
  model = '1',
  skinTone,
  makeupRecipe = { eyes: [], cheeks: [], lips: [] },
  width,
  className = '',
}) => {
  const rawId = useId();
  const idPrefix = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const modelKey = MODEL_DEFINITIONS[model] ? model : '1';
  const def = MODEL_DEFINITIONS[modelKey];

  const primarySkin = skinTone || def.baseSkinTone;
  const shadowSkin = def.shadowSkinTone;
  const highlightSkin = def.highlightSkinTone;

  // Aspect ratio 3:4 -> width: 600, height: 800
  const height = Math.round((width * 4) / 3);

  const eyesRecipe = makeupRecipe.eyes || [];
  const cheeksRecipe = makeupRecipe.cheeks || [];
  const lipsRecipe = makeupRecipe.lips || [];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none transition-all duration-300 ${className}`}
      aria-label={`Stylized ${def.faceShapeName} face model portrait`}
      role="img"
    >
      <defs>
        {/* Soft skin gradient lighting */}
        <radialGradient
          id={`skin-glow-${idPrefix}`}
          cx="48%"
          cy="42%"
          r="55%"
          fx="48%"
          fy="38%"
        >
          <stop offset="0%" stopColor={highlightSkin} stopOpacity="0.85" />
          <stop offset="60%" stopColor={primarySkin} stopOpacity="1" />
          <stop offset="100%" stopColor={shadowSkin} stopOpacity="1" />
        </radialGradient>

        {/* Neck shadow */}
        <linearGradient
          id={`neck-shadow-${idPrefix}`}
          x1="300"
          y1="580"
          x2="300"
          y2="750"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={shadowSkin} stopOpacity="0.95" />
          <stop offset="35%" stopColor={primarySkin} stopOpacity="1" />
          <stop offset="100%" stopColor={shadowSkin} stopOpacity="0.8" />
        </linearGradient>

        {/* Blush feathering gradients for Cheek Masks */}
        <radialGradient
          id={`blush-feather-left-${idPrefix}`}
          cx="205"
          cy="465"
          r="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id={`blush-feather-right-${idPrefix}`}
          cx="395"
          cy="465"
          r="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* Eye makeup feathering gradients */}
        <radialGradient
          id={`eyeshadow-left-${idPrefix}`}
          cx="220"
          cy="348"
          r="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id={`eyeshadow-right-${idPrefix}`}
          cx="380"
          cy="348"
          r="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* Lip gloss specular shine */}
        <linearGradient
          id={`lip-gloss-${idPrefix}`}
          x1="260"
          y1="540"
          x2="340"
          y2="595"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
        </linearGradient>

        {/* ================= SVG MASKS ================= */}
        {/* EYES ZONE MASK: Upper third eyelids & brow orbital area */}
        <mask id={`mask-eyes-${idPrefix}`}>
          <rect width="600" height="800" fill="#000000" />
          {/* Left Eyelid and Crease */}
          <ellipse
            cx="220"
            cy="352"
            rx="52"
            ry="28"
            fill={`url(#eyeshadow-left-${idPrefix})`}
          />
          <path
            d="M 166,358 C 172,332 214,320 264,342 C 274,354 260,366 220,366 C 182,366 168,362 166,358 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          {/* Right Eyelid and Crease */}
          <ellipse
            cx="380"
            cy="352"
            rx="52"
            ry="28"
            fill={`url(#eyeshadow-right-${idPrefix})`}
          />
          <path
            d="M 434,358 C 428,332 386,320 336,342 C 326,354 340,366 380,366 C 418,366 432,362 434,358 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
        </mask>

        {/* CHEEKS ZONE MASK: Middle third cheek apple & cheekbone contour */}
        <mask id={`mask-cheeks-${idPrefix}`}>
          <rect width="600" height="800" fill="#000000" />
          {/* Left Cheek Area */}
          <ellipse
            cx="205"
            cy="465"
            rx="66"
            ry="50"
            fill={`url(#blush-feather-left-${idPrefix})`}
          />
          {/* Right Cheek Area */}
          <ellipse
            cx="395"
            cy="465"
            rx="66"
            ry="50"
            fill={`url(#blush-feather-right-${idPrefix})`}
          />
          {/* Left Cheekbone Highlighter Sweep */}
          <ellipse
            cx="192"
            cy="428"
            rx="40"
            ry="18"
            transform="rotate(-20 192 428)"
            fill="#FFFFFF"
            fillOpacity="0.6"
          />
          {/* Right Cheekbone Highlighter Sweep */}
          <ellipse
            cx="408"
            cy="428"
            rx="40"
            ry="18"
            transform="rotate(20 408 428)"
            fill="#FFFFFF"
            fillOpacity="0.6"
          />
        </mask>

        {/* LIPS ZONE MASK: Lower third defined lips contour */}
        <mask id={`mask-lips-${idPrefix}`}>
          <rect width="600" height="800" fill="#000000" />
          {/* Upper Lip Shape with Cupid's Bow */}
          <path
            d="M 238,555 C 258,546 278,536 300,543 C 322,536 342,546 362,555 C 352,566 325,564 300,565 C 275,564 248,566 238,555 Z"
            fill="#FFFFFF"
          />
          {/* Lower Lip Shape */}
          <path
            d="M 240,556 C 262,565 284,567 300,567 C 316,567 338,565 360,556 C 352,586 332,600 300,600 C 268,600 248,586 240,556 Z"
            fill="#FFFFFF"
          />
        </mask>
      </defs>

      {/* ================= BACKGROUND HAIR / BACK ================= */}
      <g id="hair-back">
        {/* Hair silhouette framing head */}
        <path
          d="M 140,240 C 130,120 470,120 460,240 C 475,390 470,550 430,650 C 420,680 400,700 390,700 C 375,580 375,440 375,440 C 375,440 225,440 225,440 C 225,440 225,580 210,700 C 200,700 180,680 170,650 C 130,550 125,390 140,240 Z"
          fill={def.hairColor}
        />
        {/* Hair volume behind ears */}
        <ellipse cx="300" cy="230" rx="195" ry="145" fill={def.hairColor} />
      </g>

      {/* ================= NECK & SHOULDERS ================= */}
      <g id="neck-and-shoulders">
        {/* Shoulders */}
        <path
          d="M 120,800 C 140,730 200,705 235,690 L 365,690 C 400,705 460,730 480,800 Z"
          fill={primarySkin}
        />
        {/* Neck column */}
        <path
          d="M 235,560 L 235,710 C 235,725 365,725 365,710 L 365,560 Z"
          fill={`url(#neck-shadow-${idPrefix})`}
        />
        {/* Delicate clavicle / collarbone lines */}
        <path
          d="M 215,740 C 255,750 285,765 295,770"
          stroke={shadowSkin}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        <path
          d="M 385,740 C 345,750 315,765 305,770"
          stroke={shadowSkin}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </g>

      {/* ================= EARS ================= */}
      <g id="ears">
        {/* Left Ear */}
        <path
          d={def.earLeft}
          fill={primarySkin}
          stroke={shadowSkin}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 164,375 C 154,375 152,405 162,410"
          stroke={shadowSkin}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        {/* Right Ear */}
        <path
          d={def.earRight}
          fill={primarySkin}
          stroke={shadowSkin}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 436,375 C 446,375 448,405 438,410"
          stroke={shadowSkin}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </g>

      {/* ================= FACE BASE OUTLINE ================= */}
      <g id="face-base">
        <path
          d={def.jawPath}
          fill={`url(#skin-glow-${idPrefix})`}
          stroke={shadowSkin}
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        {/* Gentle jawline contour shading */}
        <path
          d="M 195,570 C 230,625 270,642 300,642 C 330,642 370,625 405,570"
          stroke={shadowSkin}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
      </g>

      {/* ================= NOSE ================= */}
      <g id="nose">
        {/* Subtle bridge shadow */}
        <path
          d="M 294,360 C 293,405 290,442 284,456"
          stroke={shadowSkin}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
        {/* Elegant nose tip & nostrils */}
        <path
          d="M 283,458 C 291,466 309,466 317,458"
          stroke={shadowSkin}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 276,455 C 274,459 281,463 285,460"
          stroke={shadowSkin}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 324,455 C 326,459 319,463 315,460"
          stroke={shadowSkin}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Soft nose tip highlight */}
        <circle cx="300" cy="454" r="4.5" fill={highlightSkin} fillOpacity="0.75" />
      </g>

      {/* ================= EYES & EYEBROWS BASE ================= */}
      <g id="eyes-base">
        {/* Eyebrows */}
        <path
          d={def.eyebrowLeft}
          stroke={def.hairColor}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d={def.eyebrowRight}
          stroke={def.hairColor}
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Left Eye Sclera (White) */}
        <path
          d="M 180,360 C 192,342 238,342 258,360 C 246,374 200,374 180,360 Z"
          fill="#FAF8F8"
          stroke={shadowSkin}
          strokeWidth="1.2"
        />
        {/* Left Iris & Pupil */}
        <circle cx="219" cy="358" r="14" fill="#3D271D" />
        <circle cx="219" cy="358" r="7.5" fill="#120B08" />
        {/* Specular sparkle highlights */}
        <circle cx="215" cy="354" r="3.2" fill="#FFFFFF" />
        <circle cx="223" cy="362" r="1.6" fill="#FFFFFF" fillOpacity="0.8" />
        {/* Upper eyelid crease */}
        <path
          d="M 180,349 C 196,339 240,339 256,349"
          stroke={shadowSkin}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        {/* Left upper lash line & winged tip */}
        <path
          d="M 174,361 C 192,342 238,342 260,359 C 265,357 268,354 270,351"
          stroke="#1F1612"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Right Eye Sclera (White) */}
        <path
          d="M 342,360 C 362,342 408,342 420,360 C 400,374 354,374 342,360 Z"
          fill="#FAF8F8"
          stroke={shadowSkin}
          strokeWidth="1.2"
        />
        {/* Right Iris & Pupil */}
        <circle cx="381" cy="358" r="14" fill="#3D271D" />
        <circle cx="381" cy="358" r="7.5" fill="#120B08" />
        {/* Specular sparkle highlights */}
        <circle cx="377" cy="354" r="3.2" fill="#FFFFFF" />
        <circle cx="385" cy="362" r="1.6" fill="#FFFFFF" fillOpacity="0.8" />
        {/* Upper eyelid crease */}
        <path
          d="M 344,349 C 360,339 404,339 420,349"
          stroke={shadowSkin}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        {/* Right upper lash line & winged tip */}
        <path
          d="M 340,359 C 362,342 408,342 426,361 C 431,357 434,354 436,351"
          stroke="#1F1612"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>

      {/* ================= NATURAL LIPS BASE ================= */}
      <g id="lips-base">
        {/* Philtrum groove */}
        <path
          d="M 295,472 L 295,534"
          stroke={shadowSkin}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
        <path
          d="M 305,472 L 305,534"
          stroke={shadowSkin}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
        {/* Natural base lips */}
        <path
          d="M 238,555 C 258,546 278,536 300,543 C 322,536 342,546 362,555 C 352,566 325,564 300,565 C 275,564 248,566 238,555 Z"
          fill={shadowSkin}
          fillOpacity="0.85"
        />
        <path
          d="M 240,556 C 262,565 284,567 300,567 C 316,567 338,565 360,556 C 352,586 332,600 300,600 C 268,600 248,586 240,556 Z"
          fill={shadowSkin}
          fillOpacity="0.95"
        />
        {/* Mouth corner dimples */}
        <circle cx="236" cy="556" r="2.2" fill={shadowSkin} />
        <circle cx="364" cy="556" r="2.2" fill={shadowSkin} />
      </g>

      {/* ================= MAKEUP ZONE 1: EYES ================= */}
      <g className="zone-eyes">
        {eyesRecipe.map((app: ShadeApplication, idx: number) => {
          const color = resolveShadeColor(app.shade);
          const blendMode = resolveShadeBlendMode(app.shade);
          const intensity = Math.min(1, Math.max(0.15, app.intensity ?? 0.82));

          return (
            <g key={`eye-layer-${app.shade}-${idx}`}>
              {/* Eye Shadow Fill over masked eyelids */}
              <rect
                x="120"
                y="280"
                width="360"
                height="150"
                fill={color}
                mask={`url(#mask-eyes-${idPrefix})`}
                style={{
                  opacity: intensity,
                  mixBlendMode: blendMode,
                  transition: 'opacity 600ms ease-out, fill 600ms ease-out',
                }}
              />
              {/* Shimmer / Satin highlight on center of eyelid */}
              <ellipse
                cx="220"
                cy="350"
                rx="18"
                ry="9"
                fill="#FFFFFF"
                style={{
                  opacity: intensity * 0.45,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 600ms ease-out',
                }}
              />
              <ellipse
                cx="380"
                cy="350"
                rx="18"
                ry="9"
                fill="#FFFFFF"
                style={{
                  opacity: intensity * 0.45,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 600ms ease-out',
                }}
              />
            </g>
          );
        })}
      </g>

      {/* ================= MAKEUP ZONE 2: CHEEKS ================= */}
      <g className="zone-cheeks">
        {cheeksRecipe.map((app: ShadeApplication, idx: number) => {
          const color = resolveShadeColor(app.shade);
          const blendMode = resolveShadeBlendMode(app.shade);
          const intensity = Math.min(1, Math.max(0.15, app.intensity ?? 0.78));

          return (
            <g key={`cheek-layer-${app.shade}-${idx}`}>
              <rect
                x="100"
                y="380"
                width="400"
                height="180"
                fill={color}
                mask={`url(#mask-cheeks-${idPrefix})`}
                style={{
                  opacity: intensity,
                  mixBlendMode: blendMode,
                  transition: 'opacity 600ms ease-out, fill 600ms ease-out',
                }}
              />
              {/* Extra luminous cheekbone reflection if gold or light shade */}
              {(app.shade === 'gold' || app.shade === 'champagne' || app.shade === 'mint') && (
                <>
                  <ellipse
                    cx="195"
                    cy="430"
                    rx="26"
                    ry="8"
                    transform="rotate(-20 195 430)"
                    fill="#FFFFFF"
                    style={{
                      opacity: intensity * 0.6,
                      mixBlendMode: 'screen',
                      transition: 'opacity 600ms ease-out',
                    }}
                  />
                  <ellipse
                    cx="405"
                    cy="430"
                    rx="26"
                    ry="8"
                    transform="rotate(20 405 430)"
                    fill="#FFFFFF"
                    style={{
                      opacity: intensity * 0.6,
                      mixBlendMode: 'screen',
                      transition: 'opacity 600ms ease-out',
                    }}
                  />
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* ================= MAKEUP ZONE 3: LIPS ================= */}
      <g className="zone-lips">
        {lipsRecipe.map((app: ShadeApplication, idx: number) => {
          const color = resolveShadeColor(app.shade);
          const blendMode = resolveShadeBlendMode(app.shade);
          const intensity = Math.min(1, Math.max(0.2, app.intensity ?? 0.88));

          return (
            <g key={`lip-layer-${app.shade}-${idx}`}>
              {/* Base Lipstick Coat */}
              <rect
                x="220"
                y="520"
                width="160"
                height="100"
                fill={color}
                mask={`url(#mask-lips-${idPrefix})`}
                style={{
                  opacity: intensity,
                  mixBlendMode: blendMode,
                  transition: 'opacity 600ms ease-out, fill 600ms ease-out',
                }}
              />
              {/* Glossy / Satin specular shine on center lower lip */}
              <ellipse
                cx="300"
                cy="574"
                rx="24"
                ry="8"
                fill="#FFFFFF"
                mask={`url(#mask-lips-${idPrefix})`}
                style={{
                  opacity: intensity * 0.5,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 600ms ease-out',
                }}
              />
              <path
                d="M 288,571 C 294,569 306,569 312,571"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  opacity: intensity * 0.75,
                  transition: 'opacity 600ms ease-out',
                }}
              />
            </g>
          );
        })}
      </g>

      {/* ================= FOREGROUND HAIR STYLING ================= */}
      <g id="hair-front">
        {/* Left side sweep bangs */}
        <path
          d="M 160,240 C 200,200 270,210 290,265 C 250,230 200,235 160,270 Z"
          fill={def.hairColor}
        />
        {/* Right side hair framing temples */}
        <path
          d="M 440,240 C 400,200 330,210 310,265 C 350,230 400,235 440,270 Z"
          fill={def.hairColor}
        />
        {/* Hair root parting line & accent sheen */}
        <path
          d="M 296,170 C 298,200 300,230 302,250"
          stroke={def.hairAccentColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </g>
    </svg>
  );
});

export default FaceModel;
