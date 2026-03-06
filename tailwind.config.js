/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ── Color Variables ─────────────────────────
            colors: {
                'bg-color': 'var(--bg-color)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                'accent': 'var(--accent)',
                'accent-glow': 'var(--accent-glow)',
                'glass-bg': 'var(--glass-bg)',
                'glass-border': 'var(--glass-border)',
                // Brand palette
                'brand': {
                    50: '#eef9ff',
                    100: '#d8f0ff',
                    200: '#b9e4ff',
                    300: '#8ad3ff',
                    400: '#53b9fd',
                    500: '#2b9afa',
                    600: '#157de8',
                    700: '#0d67d5',
                    800: '#1154ac',
                    900: '#134888',
                },
            },
            // ── Font Family ─────────────────────────────
            fontFamily: {
                sans: ['Pretendard', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            // ── Custom Animations ────────────────────────
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px var(--accent-glow)' },
                    '50%': { boxShadow: '0 0 40px var(--accent-glow), 0 0 80px var(--accent-glow)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.6s ease forwards',
                'fade-in': 'fade-in 0.4s ease forwards',
                'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
                'float': 'float 4s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            // ── Spacing / Sizing ─────────────────────────
            maxWidth: {
                'content': '1280px',
            },
            borderRadius: {
                'xl2': '20px',
                'xl3': '28px',
            },
            // ── Backdrop Blur ────────────────────────────
            backdropBlur: {
                'xs': '4px',
                '3xl': '64px',
            },
            // ── Box Shadow ───────────────────────────────
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glow-sm': '0 0 16px var(--accent-glow)',
                'glow-md': '0 0 32px var(--accent-glow)',
                'glow-lg': '0 0 64px var(--accent-glow)',
            },
        },
    },
    plugins: [],
}
