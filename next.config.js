/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('node:fs')
const cp = require('node:child_process')

const { withSentryConfig } = require('@sentry/nextjs')

const locales = require('./locales/locales.json')
const buildCspRules = require('./data/cspSites')

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'interest-cohert=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: buildCspRules(
                            isProd
                                ? "'unsafe-inline'"
                                : "'unsafe-inline' 'unsafe-eval'"
                        ),
                    },
                ],
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/search',
                destination: '/search/card',
                permanent: true,
            },
        ]
    },
    images: {
        domains: ['ac.ip.outv.im', 'idoly-assets.outv.im'],
        unoptimized: true,
    },
    i18n: {
        locales,
        defaultLocale: 'zh-Hans',
    },
}

const conf =
    process.env.VERCEL_ENV === 'production'
        ? withSentryConfig(
              nextConfig,
              {
                  // Suppresses source map uploading logs during build
                  silent: true,
                  org: 'librehouse',
                  project: 'info-pride',
              },
              {
                  // For all available options, see:
                  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

                  // Upload a larger set of source maps for prettier stack traces (increases build time)
                  widenClientFileUpload: true,

                  // Transpiles SDK to be compatible with IE11 (increases bundle size)
                  transpileClientSDK: true,

                  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
                  tunnelRoute: '/monitoring',

                  // Hides source maps from generated client bundles
                  hideSourceMaps: true,

                  // Automatically tree-shake Sentry logger statements to reduce bundle size
                  disableLogger: true,
              }
          )
        : nextConfig

const generateGlobalData = () => {
    fs.writeFileSync(
        'data/build.json',
        JSON.stringify({
            rev: cp.execSync('git rev-parse HEAD').toString().trim(),
        })
    )

    return true
}

module.exports =
    generateGlobalData() &&
    (process.env.ANALYZE
        ? require('@next/bundle-analyzer')({
              enabled: true,
          })(conf)
        : conf)
