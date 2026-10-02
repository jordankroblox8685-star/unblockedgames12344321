export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Default (PlayVault)',
    title: 'PlayVault - Unblocked Games Hub',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/></svg>"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%231E8E3E' d='M44 38H4c-2.2 0-4-1.8-4-4V10c0-2.2 1.8-4 4-4h40c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4z'/><path fill='%23FFF' d='M24 16c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 16c-4.4 0-13 2.2-13 6.6V40h26v-1.4c0-4.4-8.6-6.6-13-6.6z'/></svg>"
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%234285F4' d='M30 4H12c-2.2 0-4 1.8-4 4v32c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V14L30 4z'/><path fill='%23A1C2FA' d='M30 4v10h10L30 4z'/><path fill='%23FFF' d='M16 22h16v3H16zm0 6h16v3H16zm0 6h10v3H16z'/></svg>"
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%23FFC107' d='M17 6h14l12 21H29z'/><path fill='%232196F3' d='M5 42l6-11 12 21H11z'/><path fill='%234CAF50' d='M29 27l-6 11-12-21 6-11z'/></svg>"
  },
  {
    id: 'calculator',
    name: 'Desmos Calculator',
    title: 'Desmos | Scientific Calculator',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><circle cx='24' cy='24' r='20' fill='%232B6698'/><path fill='%23FFF' d='M14 22h20v4H14zm6-8h8v20h-8z'/></svg>"
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><circle cx='24' cy='24' r='20' fill='%23E02424'/><circle cx='24' cy='24' r='8' fill='%23FFF'/></svg>"
  }
];

export function applyCloak(presetId) {
  const preset = CLOAK_PRESETS.find(p => p.id === presetId) || CLOAK_PRESETS[0];
  document.title = preset.title;

  let link = document.getElementById('dynamic-favicon');
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = preset.iconSvg;
  localStorage.setItem('playvault_cloak', presetId);
}

export function triggerPanic(redirectUrl = 'https://classroom.google.com') {
  window.location.replace(redirectUrl);
}
