import { C } from '../tokens';

const paths = {
  home: (color) => <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></>,
  search: (color) => <><circle cx="11" cy="11" r="7" fill="none" stroke={color} strokeWidth="1.7"/><path d="M16.5 16.5L21 21" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></>,
  map: (color) => <><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 4v13M15 7v13" stroke={color} strokeWidth="1.6"/></>,
  swipe: (color) => <><path d="M7 9l-4 3 4 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 9l4 3-4 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h18" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></>,
  pin: (color) => <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke={color} strokeWidth="1.7"/><circle cx="12" cy="9" r="2.5" fill="none" stroke={color} strokeWidth="1.7"/></>,
  check: (color) => <><path d="M4 12l5 5L20 6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  users: (color) => <><circle cx="9" cy="7" r="3.5" fill="none" stroke={color} strokeWidth="1.7"/><path d="M2 21v-1a7 7 0 0114 0v1" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round"/><circle cx="18" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.7"/><path d="M22 21v-1a4 4 0 00-3-3.87" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></>,
  star: (color) => <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/></>,
  chevronR: (color) => <path d="M9 5l7 7-7 7" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
  chevronL: (color) => <path d="M15 5l-7 7 7 7" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>,
  heart: (color) => <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/>,
  x: (color) => <><path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
  camera: (color) => <><rect x="2" y="6" width="20" height="15" rx="3" fill="none" stroke={color} strokeWidth="1.7"/><circle cx="12" cy="13.5" r="3.5" fill="none" stroke={color} strokeWidth="1.7"/><path d="M8 6l1.5-3h5L16 6" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/></>,
  trend: (color) => <><path d="M3 17l5-5 4 4 9-9" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7h5v5" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></>,
  school: (color) => <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/></>,
  shield: (color) => <><path d="M12 2l9 4v6c0 5-3.5 9-9 10C6.5 21 3 17 3 12V6l9-4z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/></>,
  bus: (color) => <><rect x="3" y="4" width="18" height="14" rx="3" fill="none" stroke={color} strokeWidth="1.7"/><path d="M3 9h18M9 4v5M15 4v5" stroke={color} strokeWidth="1.7"/><circle cx="7.5" cy="20" r="1.5" fill={color}/><circle cx="16.5" cy="20" r="1.5" fill={color}/><path d="M7.5 18v-2M16.5 18v-2" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></>,
  plus: (color) => <><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
  bell: (color) => <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></>,
};

export default function Icon({ name, size = 20, color = C.text, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {paths[name]?.(color) || null}
    </svg>
  );
}
