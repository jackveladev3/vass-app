module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.vue']
  },
  variants: {},
  plugins: [],
  theme: {
    extend: {
      colors: {
        grey: '#FBFBFB',
        dark: '#979797',
        primary: '#3D5170',
        secondary: '#4A4A4A',
        error: '#FF4D4F',
        highlight: '#DE6356',
        curdate: '#FBFDFF',
        curlecture: '#FFFBFB',
        button: '#5A95DA',
        material: '#0091FF'
      }
    }
  }
}
