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
        muted: 'var(--colors-muted)',
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
            'tw-black': '#293756',
            white: '#FFFFFF',
            black: '#000000',
            muted: '#868e96',
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
            background1: '#111622',
            background2: '#151c29',
            white: '#000000',
            black: '#FFFFFF',
            muted: '#868e96',
            'tw-white': '#324267',
            'tw-black': '#d4d9dd',
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
