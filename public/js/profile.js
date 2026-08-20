'use strict'

const { api, setToken, requireAuth, fillSessionChrome } = window.SwapLoopApi

if (!requireAuth()) throw new Error('redirect')

function paint(me) {
  document.getElementById('profile-display-name').textContent = me.displayName
  document.getElementById('profile-email').textContent = me.email
  document.getElementById('profile-role').textContent = me.role
  document.getElementById('profile-status').textContent = me.status
  document.getElementById('profile-battery-mode').textContent = me.batteryMode
  document.getElementById('profile-battery-type').textContent = me.batteryType || '—'
  document.getElementById('profile-connector-type').textContent = me.connectorType || '—'
  document.getElementById('profile-voltage-class').textContent = me.voltageClass
  document.getElementById('profile-current-battery').textContent = me.currentBatteryId || '—'
  document.getElementById('row-battery-type').hidden = me.batteryMode !== 'SWAPPABLE'
  document.getElementById('row-connector').hidden = me.batteryMode !== 'INTEGRATED'
  document.getElementById('edit-name').value = me.displayName
}

;(async () => {
  const me = await fillSessionChrome()
  if (!me) return
  paint(me)

  document.getElementById('profile-edit').addEventListener('click', () => {
    document.getElementById('edit-box').hidden = false
  })
  document.getElementById('edit-cancel').addEventListener('click', () => {
    document.getElementById('edit-box').hidden = true
  })
  document.getElementById('edit-save').addEventListener('click', async () => {
    const err = document.getElementById('edit-error')
    err.textContent = ''
    try {
      const updated = await api('/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName: document.getElementById('edit-name').value.trim() }),
      })
      paint(updated)
      await fillSessionChrome()
      document.getElementById('edit-box').hidden = true
    } catch (ex) {
      err.textContent = ex.message
    }
  })

  document.getElementById('as-chen').addEventListener('click', async (e) => {
    e.preventDefault()
    setToken('')
    try {
      const { token: t } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'chen.wei@swaploop.test',
          password: 'password123',
        }),
      })
      setToken(t)
      location.reload()
    } catch (ex) {
      document.getElementById('edit-error').textContent = ex.message
    }
  })
})()
