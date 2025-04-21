/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/game/:path*.br',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'br',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 