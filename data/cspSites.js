const allowedConnectionDomains = [
    // Scripts from Next.js
    "'self'",
    // Backend for INFO PRIDE
    'idoly-backend.outv.im',
    // Vercel's Analytics
    'vitals.vercel-insights.com',
    // Sentry's reporting & performance measurement
    'o421264.ingest.sentry.io',
    // Asset server
    'ac.ip.outv.im',
    // Asset storage
    'idoly-assets.outv.im',
    'res.cloudinary.com',
]

const buildCspRules = (scriptOthers) =>
    [
        `script-src 'self' ${scriptOthers}`,
        `connect-src ${allowedConnectionDomains.join(' ')}`,
    ].join('; ')

module.exports = buildCspRules
