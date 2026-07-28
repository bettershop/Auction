const CONSENT_COOKIE = 'cookie_consent'
const CONSENT_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
}
const OPEN_SETTINGS_EVENT = 'laike-cookie-consent:open'

const ESSENTIAL_COOKIES = new Set([
  CONSENT_COOKIE,
  'currentLang',
  'pc_user',
  'userId',
  'payData',
  'cz_sNo',
])

const OPTIONAL_COOKIES = new Set([
  'autoToken',
  'versionUpdate',
])

const LEGACY_SENSITIVE_COOKIES = ['account', 'password']

function normalizeConsentStatus(value) {
  return value === 'accept' || value === 'reject' ? value : ''
}

export default function ({ app }, inject) {
  const cookieStore = app.$cookies
  const originalGet = cookieStore.get.bind(cookieStore)
  const originalSet = cookieStore.set.bind(cookieStore)
  const originalRemove = cookieStore.remove.bind(cookieStore)

  function getConsentStatus() {
    return normalizeConsentStatus(originalGet(CONSENT_COOKIE))
  }

  function isEssentialCookie(name) {
    return ESSENTIAL_COOKIES.has(name)
  }

  function isBlockedCookie(name) {
    if (isEssentialCookie(name)) {
      return false
    }

    if (LEGACY_SENSITIVE_COOKIES.includes(name)) {
      return true
    }

    if (!OPTIONAL_COOKIES.has(name)) {
      return false
    }

    return getConsentStatus() !== 'accept'
  }

  function removeCookie(name, options) {
    return originalRemove(name, options || { path: '/' })
  }

  function cleanupRejectedCookies() {
    OPTIONAL_COOKIES.forEach((name) => {
      removeCookie(name)
    })
  }

  function cleanupLegacySensitiveCookies() {
    LEGACY_SENSITIVE_COOKIES.forEach((name) => {
      removeCookie(name)
    })
  }

  function setConsentStatus(value) {
    const status = normalizeConsentStatus(value)

    if (!status) {
      return false
    }

    originalSet(CONSENT_COOKIE, status, CONSENT_OPTIONS)

    if (status === 'reject') {
      cleanupRejectedCookies()
    }

    cleanupLegacySensitiveCookies()
    return true
  }

  function canUseOptionalCookies() {
    return getConsentStatus() === 'accept'
  }

  function openSettings() {
    if (!process.client) {
      return
    }

    let event

    if (typeof Event === 'function') {
      event = new Event(OPEN_SETTINGS_EVENT)
    } else {
      event = document.createEvent('Event')
      event.initEvent(OPEN_SETTINGS_EVENT, false, false)
    }

    window.dispatchEvent(event)
  }

  cookieStore.set = function patchedSet(name, value, options) {
    if (name === CONSENT_COOKIE) {
      return setConsentStatus(value)
    }

    if (isBlockedCookie(name)) {
      return false
    }

    return originalSet(name, value, options)
  }

  const cookieConsent = {
    consentCookieName: CONSENT_COOKIE,
    openSettingsEvent: OPEN_SETTINGS_EVENT,
    getStatus: getConsentStatus,
    shouldShowBanner() {
      return !getConsentStatus()
    },
    canUseOptionalCookies,
    canSetCookie(name) {
      return !isBlockedCookie(name)
    },
    isEssentialCookie,
    setStatus: setConsentStatus,
    cleanupRejectedCookies,
    cleanupLegacySensitiveCookies,
    openSettings,
  }

  if (process.client) {
    if (!canUseOptionalCookies()) {
      cleanupRejectedCookies()
    }

    cleanupLegacySensitiveCookies()
  }

  inject('cookieConsent', cookieConsent)
}
