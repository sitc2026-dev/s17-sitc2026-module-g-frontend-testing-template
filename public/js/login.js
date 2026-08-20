'use strict'

const { api, setToken } = window.SwapLoopApi

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const err = document.getElementById('login-error')
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  err.textContent = ''
  if (!email) {
    err.textContent = 'Email is required'
    return
  }
  try {
    const { token: t } = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(t)
    location.href = '/stations.html'
  } catch (ex) {
    err.textContent = ex.message
  }
})
