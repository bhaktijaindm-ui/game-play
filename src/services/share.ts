import type { FaceRecipe, ShadeId } from '../types';

const SHADE_COLORS: Record<string, string> = {
  rose: '#f43f5e',
  lavender: '#a855f7',
  peach: '#fb923c',
  ruby: '#be123c',
  gold: '#eab308',
  mint: '#10b981',
  sky: '#0284c7',
  turmeric: '#f59e0b',
  henna: '#059669',
  berry: '#9333ea',
  crimson: '#dc2626',
  kohl: '#18181b',
  champagne: '#fde047',
};

/**
 * Checks whether the Web Share API is available on the current device.
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares an image canvas using Web Share API with a fallback to direct PNG download.
 */
export async function shareImage(
  canvas: HTMLCanvasElement,
  title: string,
  text: string
): Promise<void> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95);
  });

  if (!blob) {
    throw new Error('Failed to export canvas to image blob.');
  }

  const file = new File([blob], `glam-blocks-${Date.now()}.png`, { type: 'image/png' });

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title,
        text,
        files: [file],
      });
      return;
    } catch (shareErr) {
      // User cancelled share dialog or share failed; proceed to download fallback if not user abort
      if ((shareErr as Error)?.name === 'AbortError') {
        return;
      }
      console.warn('Native share failed, downloading image instead:', shareErr);
    }
  }

  // Fallback: trigger download in browser
  const link = document.createElement('a');
  link.download = `glam-blocks-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Draws a stylized cosmetic face portrait onto canvas.
 */
function drawFacePortrait(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  recipe?: FaceRecipe
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Face Oval
  ctx.beginPath();
  ctx.ellipse(0, 0, 110, 150, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fde2d2'; // Natural foundation tone
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#e2a98f';
  ctx.stroke();

  // Eyebrows
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#5a3825';
  ctx.beginPath();
  ctx.arc(-42, -50, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(42, -50, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // Eye Sockets
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-42, -30, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(42, -30, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Irises
  ctx.fillStyle = '#3f2518';
  ctx.beginPath();
  ctx.arc(-42, -30, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(42, -30, 9, 0, Math.PI * 2);
  ctx.fill();

  // Eye Highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-45, -34, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(39, -34, 3, 0, Math.PI * 2);
  ctx.fill();

  // Eyelashes
  ctx.strokeStyle = '#1e1410';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-60, -32);
  ctx.quadraticCurveTo(-42, -45, -24, -32);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(24, -32);
  ctx.quadraticCurveTo(42, -45, 60, -32);
  ctx.stroke();

  // Nose Bridge & Tip
  ctx.strokeStyle = '#d7977b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(2, 20);
  ctx.quadraticCurveTo(-8, 28, 0, 30);
  ctx.stroke();

  // Cheeks Blush (Base or Recipe)
  if (recipe && recipe.cheeks.length > 0) {
    recipe.cheeks.forEach((app) => {
      const color = SHADE_COLORS[app.shade] || '#f43f5e';
      ctx.save();
      const op = app.opacity ?? app.intensity ?? 0.7;
      ctx.globalAlpha = Math.min(0.7, op * 0.85);

      const gradL = ctx.createRadialGradient(-60, 25, 5, -60, 25, 40);
      gradL.addColorStop(0, color);
      gradL.addColorStop(1, 'transparent');
      ctx.fillStyle = gradL;
      ctx.beginPath();
      ctx.arc(-60, 25, 40, 0, Math.PI * 2);
      ctx.fill();

      const gradR = ctx.createRadialGradient(60, 25, 5, 60, 25, 40);
      gradR.addColorStop(0, color);
      gradR.addColorStop(1, 'transparent');
      ctx.fillStyle = gradR;
      ctx.beginPath();
      ctx.arc(60, 25, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  } else {
    // Natural subtle cheek hint
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.beginPath();
    ctx.arc(-55, 25, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(55, 25, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes Eyeshadow (Recipe)
  if (recipe && recipe.eyes.length > 0) {
    recipe.eyes.forEach((app) => {
      const color = SHADE_COLORS[app.shade] || '#a855f7';
      ctx.save();
      const op = app.opacity ?? app.intensity ?? 0.7;
      ctx.globalAlpha = Math.min(0.85, op * 0.9);

      // Left lid shadow
      const gradEL = ctx.createRadialGradient(-42, -35, 5, -42, -35, 28);
      gradEL.addColorStop(0, color);
      gradEL.addColorStop(1, 'transparent');
      ctx.fillStyle = gradEL;
      ctx.beginPath();
      ctx.ellipse(-42, -35, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right lid shadow
      const gradER = ctx.createRadialGradient(42, -35, 5, 42, -35, 28);
      gradER.addColorStop(0, color);
      gradER.addColorStop(1, 'transparent');
      ctx.fillStyle = gradER;
      ctx.beginPath();
      ctx.ellipse(42, -35, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  // Lips (Base or Recipe)
  let lipFill = '#e3848b'; // Natural lip
  if (recipe && recipe.lips.length > 0) {
    const lastLip = recipe.lips[recipe.lips.length - 1];
    lipFill = SHADE_COLORS[lastLip.shade] || '#e11d48';
  }

  ctx.save();
  ctx.fillStyle = lipFill;
  ctx.beginPath();
  // Upper Lip
  ctx.moveTo(-32, 70);
  ctx.quadraticCurveTo(-15, 60, 0, 65);
  ctx.quadraticCurveTo(15, 60, 32, 70);
  ctx.quadraticCurveTo(0, 76, -32, 70);
  ctx.fill();

  // Lower Lip
  ctx.beginPath();
  ctx.moveTo(-32, 70);
  ctx.quadraticCurveTo(0, 92, 32, 70);
  ctx.quadraticCurveTo(0, 76, -32, 70);
  ctx.fill();

  // Lip Gloss Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 78, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * Generates a high-resolution beauty look card canvas ready for social sharing.
 * Sizes supported:
 * - 'stories': 1080 x 1920
 * - 'post': 1080 x 1080
 */
export async function generateLookCard(
  faceRecipe: FaceRecipe,
  _faceModel: string,
  score: number,
  playerName: string,
  size: 'stories' | 'post' = 'post',
  hideName: boolean = false
): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = size === 'stories' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available.');
  }

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#fff5f8');
  bgGrad.addColorStop(0.5, '#fce7f3');
  bgGrad.addColorStop(1, '#fbcfe8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Glam Blobs & Glows
  ctx.fillStyle = 'rgba(230, 23, 127, 0.08)';
  ctx.beginPath();
  ctx.arc(150, 200, 350, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(168, 85, 247, 0.08)';
  ctx.beginPath();
  ctx.arc(width - 150, height - 250, 380, 0, Math.PI * 2);
  ctx.fill();

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#E6177F';
  ctx.font = 'bold 54px "Fredoka", sans-serif';
  ctx.fillText('✨ GLAM BLOCKS ✨', width / 2, size === 'stories' ? 160 : 110);

  ctx.fillStyle = '#6b7280';
  ctx.font = '500 28px "Poppins", sans-serif';
  const artistText = hideName ? 'The Gulab Mahal Salon • Glam Look' : `Masterpiece by ${playerName || 'Glam Artist'}`;
  ctx.fillText(
    artistText,
    width / 2,
    size === 'stories' ? 220 : 160
  );

  // Score Badge
  const badgeY = size === 'stories' ? 280 : 210;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 180, badgeY, 360, 60, 30);
  ctx.fill();
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#db2777';
  ctx.font = 'bold 26px "Fredoka", sans-serif';
  ctx.fillText(`SCORE: ${score.toLocaleString()}`, width / 2, badgeY + 40);

  // Before & After Container
  const portraitsCenterY = size === 'stories' ? 760 : 560;
  const portraitScale = size === 'stories' ? 1.45 : 1.25;

  // Before Card Box
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(230, 23, 127, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  const boxW = 440;
  const boxH = 540;
  const leftX = width / 2 - boxW - 30;
  const rightX = width / 2 + 30;
  const boxY = portraitsCenterY - boxH / 2;

  // Draw Before Card
  ctx.beginPath();
  ctx.roundRect(leftX, boxY, boxW, boxH, 24);
  ctx.fill();

  // Draw After Card
  ctx.beginPath();
  ctx.roundRect(rightX, boxY, boxW, boxH, 24);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Badges for Before / After
  ctx.fillStyle = '#9ca3af';
  ctx.font = 'bold 24px "Fredoka", sans-serif';
  ctx.fillText('NATURAL (BEFORE)', leftX + boxW / 2, boxY + 45);

  ctx.fillStyle = '#E6177F';
  ctx.fillText('GLAMOUR (AFTER)', rightX + boxW / 2, boxY + 45);

  // Draw Faces
  drawFacePortrait(ctx, leftX + boxW / 2, portraitsCenterY + 30, portraitScale);
  drawFacePortrait(ctx, rightX + boxW / 2, portraitsCenterY + 30, portraitScale, faceRecipe);

  // Shade Palette Swatches
  const shadesY = size === 'stories' ? 1380 : 900;
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 24px "Fredoka", sans-serif';
  ctx.fillText('COLOR RECIPE PALETTE', width / 2, shadesY);

  const activeShades: ShadeId[] = Array.from(
    new Set([
      ...faceRecipe.eyes.map((s) => s.shade),
      ...faceRecipe.cheeks.map((s) => s.shade),
      ...faceRecipe.lips.map((s) => s.shade),
    ])
  );

  const displayShades = activeShades.length > 0 ? activeShades : (['rose', 'ruby', 'peach', 'gold'] as ShadeId[]);
  const startX = width / 2 - (displayShades.length * 70) / 2 + 35;

  displayShades.forEach((shade, i) => {
    const sx = startX + i * 70;
    const sy = shadesY + 50;

    ctx.fillStyle = SHADE_COLORS[shade];
    ctx.beginPath();
    ctx.arc(sx, sy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  // Footer Tagline
  const footerY = size === 'stories' ? 1780 : 1020;
  ctx.fillStyle = '#E6177F';
  ctx.font = 'bold 24px "Fredoka", sans-serif';
  ctx.fillText('Play Glam Blocks Free • #GlamBlocks', width / 2, footerY);

  return canvas;
}
