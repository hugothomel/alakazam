/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/anamnesis',
        destination: 'https://webwmonnx-production.up.railway.app',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

