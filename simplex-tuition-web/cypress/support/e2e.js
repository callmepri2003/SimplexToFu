import './commands'
import '@testing-library/cypress/add-commands'

// Never send test traffic to the real GA4 property or Meta Pixel: fake leads
// would be counted as qualify_lead / Lead conversions and skew channel data.
beforeEach(() => {
  cy.intercept({ hostname: /(^|\.)googletagmanager\.com$/ }, { statusCode: 204, body: '' })
  cy.intercept({ hostname: /(^|\.)google-analytics\.com$/ }, { statusCode: 204, body: '' })
  cy.intercept({ hostname: /(^|\.)connect\.facebook\.net$/ }, { statusCode: 204, body: '' })
  cy.intercept({ hostname: /(^|\.)facebook\.com$/, pathname: /^\/tr/ }, { statusCode: 204, body: '' })
})
