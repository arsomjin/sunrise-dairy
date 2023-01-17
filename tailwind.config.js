const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        custom: 'var(--font-size-custom)',
      },
      colors: {
        primary: 'var(--colors-primary)',
        secondary: 'var(--colors-secondary)',
        success: 'var(--colors-success)',
        warning: 'var(--colors-warning)',
        danger: 'var(--colors-danger)',
        black: 'var(--colors-black)',
        white: 'var(--colors-white)',
        background1: 'var(--colors-background1)',
        background2: 'var(--colors-background2)',
        'tw-white': 'var(--colors-tw-white)',
        'tw-black': 'var(--colors-tw-black)',
        'scrollbar-background': 'var(--colors-scrollbar-background)',
        'scrollbar-thumb': 'var(--colors-scrollbar-thumb)',
      },
      variables: {
        DEFAULT: {
          colors: {
            primary: '#21c7a3',
            secondary: '#397af2',
            success: '#17c671',
            danger: '#c4183c',
            warning: '#ffb400',
            background1: '#eff1f6',
            background2: '#F9FAFC',
            'tw-white': '#F9FAFC',
            'tw-black': '#324267',
            white: '#FFFFFF',
            black: '#000000',
            'scrollbar-background': '#397af2',
            'scrollbar-thumb': '#21c7a3',
          },
          font_size_custom: '1.7rem',
        },
        '.card': {
          font_size_custom: '2rem',
        },
      },
      darkVariables: {
        DEFAULT: {
          colors: {
            primary: '#21c7a3',
            secondary: '#397af2',
            success: '#17c671',
            warning: '#ffb400',
            danger: '#c4183c',
            background1: '#131927',
            background2: '#2f2e38',
            white: '#000000',
            black: '#FFFFFF',
            'tw-white': '#324267',
            'tw-black': '#a9b3bc',
            'scrollbar-background': '#397af2',
            'scrollbar-thumb': '#21c7a3',
          },
          font_size_custom: '1rem',
        },
        '.card': {
          font_size_custom: '1.3rem',
        },
      },
    },
  },
  variants: {},
  plugins: [
    require('@mertasan/tailwindcss-variables')({
      darkToRoot: true,
    }),
  ],
};
