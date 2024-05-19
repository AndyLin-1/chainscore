// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing-page',
        permanent: true, 
      },
    ];
  },
};
