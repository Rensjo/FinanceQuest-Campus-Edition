/** @type {import('tailwindcss').Config} */
export default {
content: [
'./index.html',
'./src/**/*.{ts,tsx}',
],
darkMode: 'class',
theme: {
extend: {
colors: {
brand: {
DEFAULT: '#10b981',
500: '#10b981',
600: '#059669',
}
},
animation: {
'shimmer': 'shimmer 3s linear infinite',
},
keyframes: {
shimmer: {
'0%': { transform: 'translateX(-100%)' },
'100%': { transform: 'translateX(100%)' },
}
}
},
},
plugins: [
function({ addUtilities }) {
addUtilities({
'.scrollbar-thin': {
'scrollbar-width': 'thin',
},
'.scrollbar-track-transparent': {
'scrollbar-color': '#404040 transparent',
},
'.scrollbar-thumb-neutral-700': {
'scrollbar-color': '#404040 transparent',
},
})
}
],
}