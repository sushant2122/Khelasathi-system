// import flowbite from 'flowbite-react/tailwind'
/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './node_modules/flowbite/**/*.js',
    flowbite.content()
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,

    }),
    flowbite.plugin()
  ]
}

