export const STYLES = ['block', 'corporate'] as const;
export const TONES = ['toss', 'minimal', 'dark', 'kakao'] as const;

export type Style = (typeof STYLES)[number];
export type Tone = (typeof TONES)[number];

const STYLE_KEY = 'portfolio-style';
const TONE_KEY = 'portfolio-tone';

export function getSelection(): { style: Style; tone: Tone } {
  if (typeof window === 'undefined') return { style: 'block', tone: 'toss' };
  const style = (localStorage.getItem(STYLE_KEY) as Style) || 'block';
  const tone = (localStorage.getItem(TONE_KEY) as Tone) || 'toss';
  return { style, tone };
}

export function setSelection(style: Style, tone: Tone) {
  localStorage.setItem(STYLE_KEY, style);
  localStorage.setItem(TONE_KEY, tone);
}
