'use strict'

;(function (global) {
  const API_BASE = global.SWAPLOOP_API_BASE || '/api/v1'

  function token() {
    return localStorage.getItem('swaploop_token') || ''
  }

  function setToken(value) {
    if (value) localStorage.setItem('swaploop_token', value)
    else localStorage.removeItem('swaploop_token')
  }

  async function request(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {})
    const t = token()
    if (t) headers.Authorization = `Bearer ${t}`
    const res = await fetch(API_BASE + path, { ...options, headers })
    let body = null
    const text = await res.text()
    if (text) {
      try {
        body = JSON.parse(text)
      } catch {
        body = { message: text }
      }
    }
    if (!res.ok) {
      const err = new Error((body && body.message) || res.statusText || 'Request failed')
      err.status = res.status
      err.body = body
      throw err
    }
    return body
  }

  function requireAuth() {
    if (!token()) {
      location.href = '/login.html'
      return false
    }
    return true
  }

  function vehicleLabel(me) {
    if (!me) return ''
    if (me.batteryMode === 'SWAPPABLE') return me.batteryType || '—'
    return me.connectorType || '—'
  }

  function markCurrentNav() {
    const file = location.pathname.split('/').pop() || 'index.html'
    document.querySelectorAll('.bottom-nav a[href], .nav a[href]').forEach((a) => {
      const href = a.getAttribute('href') || ''
      const target = href.split('?')[0].split('/').pop()
      if (target && target === file) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })
  }

  async function fillSessionChrome() {
    markCurrentNav()
    const chip = document.querySelector('[data-testid="user-chip"]')
    const label = document.querySelector('[data-testid="session-label"]')
    const logoutBtn = document.querySelector('[data-testid="logout-btn"]')
    const loginLink = document.querySelector('[data-testid="nav-login"]')
    const authOnly = document.querySelectorAll('[data-auth="required"]')
    const guestOnly = document.querySelectorAll('[data-auth="guest"]')

    const signedIn = Boolean(token())
    authOnly.forEach((el) => {
      el.hidden = !signedIn
    })
    guestOnly.forEach((el) => {
      el.hidden = signedIn
    })
    if (loginLink) loginLink.hidden = signedIn

    function bindLogout(btn) {
      if (!btn) return
      btn.hidden = !signedIn
      btn.onclick = () => {
        setToken('')
        location.href = '/login.html'
      }
    }
    bindLogout(logoutBtn)

    if (!signedIn) {
      if (chip) {
        chip.hidden = true
        chip.textContent = ''
      }
      if (label) label.hidden = true
      return null
    }

    try {
      const me = await request('/me')
      const text = `${me.displayName} · ${vehicleLabel(me)}`
      if (chip) {
        chip.hidden = false
        chip.textContent = text
      }
      if (label) {
        label.hidden = false
        label.textContent = text
      }
      return me
    } catch {
      setToken('')
      if (chip) {
        chip.hidden = true
        chip.textContent = ''
      }
      if (label) label.hidden = true
      if (logoutBtn) logoutBtn.hidden = true
      if (loginLink) loginLink.hidden = false
      authOnly.forEach((el) => {
        el.hidden = true
      })
      guestOnly.forEach((el) => {
        el.hidden = false
      })
      return null
    }
  }

  global.SwapLoopApi = {
    api: request,
    token,
    setToken,
    requireAuth,
    fillSessionChrome,
    vehicleLabel,
    API_BASE,
  }
})(window)
