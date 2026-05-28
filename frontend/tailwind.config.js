export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Premium AI SaaS Palette
        'navy': {
          50: '#F3F6FB',
          100: '#E7ECF7',
          200: '#C4D7ED',
          300: '#A1C2E3',
          400: '#7EADD9',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#372BA7',
          800: '#2B1E84',
          900: '#071028'
        },
        'indigo': {
          50: '#F5F4FF',
          100: '#EBECFF',
          200: '#D7D5FF',
          300: '#C3BFFF',
          400: '#A39EFF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#2C2957'
        },
        'cyan-accent': {
          50: '#ECFDF5',
          100: '#DFFCF0',
          200: '#C0FFF0',
          300: '#A0FFED',
          400: '#DFF7FF',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63'
        },
        'slate-custom': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          150: '#EDEFF2',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.6', letterSpacing: '0.5px' }],
        'sm': ['13px', { lineHeight: '1.6', letterSpacing: '0.3px' }],
        'base': ['15px', { lineHeight: '1.7' }],
        'lg': ['16px', { lineHeight: '1.7' }],
        'xl': ['18px', { lineHeight: '1.75' }],
        '2xl': ['20px', { lineHeight: '1.8', letterSpacing: '-0.02em' }],
        '3xl': ['24px', { lineHeight: '1.8', letterSpacing: '-0.02em' }],
        '4xl': ['28px', { lineHeight: '1.85', letterSpacing: '-0.03em' }],
        '5xl': ['32px', { lineHeight: '1.9', letterSpacing: '-0.03em' }],
        '6xl': ['36px', { lineHeight: '1.9', letterSpacing: '-0.03em' }],
        '7xl': ['42px', { lineHeight: '1.95', letterSpacing: '-0.04em' }]
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px'
      },
      boxShadow: {
        'sm-soft': '0 2px 8px rgba(15, 23, 42, 0.06)',
        'md-soft': '0 4px 16px rgba(15, 23, 42, 0.08)',
        'lg-soft': '0 8px 24px rgba(15, 23, 42, 0.1)',
        'xl-soft': '0 12px 32px rgba(15, 23, 42, 0.12)',
        'elevation-1': '0 6px 20px rgba(15, 23, 42, 0.1)',
        'elevation-2': '0 12px 40px rgba(15, 23, 42, 0.15)',
        'elevation-3': '0 20px 60px rgba(15, 23, 42, 0.2)',
        'glow': '0 0 24px rgba(79, 70, 229, 0.15)',
        'glow-lg': '0 0 40px rgba(79, 70, 229, 0.25)'
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        'full': '9999px'
      },
      maxWidth: {
        'xs': '320px',
        'sm': '384px',
        'md': '448px',
        'lg': '512px',
        'xl': '576px',
        '2xl': '672px',
        '3xl': '768px',
        '4xl': '896px',
        '5xl': '1024px',
        '6xl': '1152px',
        '7xl': '1280px',
        'container': '1344px',
        'app': '1600px'
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms'
      }
    }
  },
  plugins: []
};
