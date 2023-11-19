/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // content: [],
  theme: {
    extend: {
      borderWidth: {
        3: "3px", // You can adjust the size as needed
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   theme: {
//     extend: {
//       borderWidth: {
//         3: "3px", // You can adjust the size as needed
//       },
//     },
//   },
//   variants: {},
//   plugins: [],
// };
