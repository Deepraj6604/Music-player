/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#fff',
        primaryLight: 'rgba(235,235,235,0.5)',
        primaryDim: 'rgb(228,228,228)'
      },
    },
    animation: {
      'avatar': "animateAvatar .5s linear infinite",
      'pulse': "animatePulse .5s infinite ease-in-out"
    },
    keyframes: {
      animateAvatar: {
        "0%": {
          transform: "scale(1)",
        },
        "50%": {
          transform: "scale(1.03)",
        },
        "100%": {
          transform: "scale(1)",
        }
      },
      animatePulse: {
        "0%": {
            opacity: 0,
        },
        "50%": {
            opacity: 1.
        },
        "100%": {
            opacity: 0,
            transform: "scale(1.2)"
        }
      }
    },
  },
  plugins: [],
}

