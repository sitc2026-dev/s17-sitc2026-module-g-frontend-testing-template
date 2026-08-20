'use strict'

const { api, setToken } = window.SwapLoopApi

const modeInput = document.getElementById('reg-mode')
const step1 = document.getElementById('reg-step1')
const step2 = document.getElementById('reg-step2')
const err = document.getElementById('reg-error')
let draft = null
let linkTimer = null

function setMode(mode) {
  modeInput.value = mode
  document.querySelectorAll('.mode-toggle button').forEach((btn) => {
    btn.classList.toggle('is-on', btn.getAttribute('data-mode') === mode)
  })
  const sw = mode === 'SWAPPABLE'
  document.getElementById('reg-swappable').hidden = !sw
  document.getElementById('reg-integrated').hidden = sw
}

document.querySelectorAll('.mode-toggle button').forEach((btn) => {
  btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode')))
})
setMode('SWAPPABLE')

function showStep(n) {
  const on2 = n === 2
  step1.hidden = on2
  step2.hidden = !on2
  document.getElementById('step-ind-1').className = on2 ? 'step done' : 'step current'
  document.getElementById('step-ind-2').className = on2 ? 'step current' : 'step'
  document.getElementById('step-ind-1-label').textContent = on2 ? 'Step 1 · done' : 'Step 1 · current'
  document.getElementById('step-ind-2-label').textContent = on2 ? 'Step 2 · current' : 'Step 2'
  document.getElementById('reg-heading').textContent = on2 ? 'Link Alipay' : 'Register'
  document.getElementById('reg-kicker').textContent = on2
    ? 'Simulated Alipay link · pay-as-you-go'
    : 'Create a rider account'
  document.getElementById('reg-lede').textContent = on2
    ? 'Step 2 of 2. This is a mock link — no live payment API. Wait for the simulated success, then create the account.'
    : 'Step 1 of 2. Vehicle fields change with battery mode. Voltage class is derived later — do not send it here.'
}

function finishLink() {
  document.getElementById('alipay-status').textContent = 'Alipay linked'
  document.getElementById('reg-create').disabled = false
}

function startLink() {
  clearTimeout(linkTimer)
  document.getElementById('reg-create').disabled = true
  document.getElementById('alipay-status').textContent =
    'Linking Alipay… this usually takes a few seconds.'
  linkTimer = setTimeout(finishLink, 1800)
}

document.getElementById('reg-next').addEventListener('click', () => {
  const batteryMode = modeInput.value
  const batteryType = document.getElementById('reg-battery-type').value
  const connectorType = document.getElementById('reg-connector-type').value
  err.textContent = ''
  if (batteryMode === 'SWAPPABLE' && !batteryType) {
    err.textContent = 'batteryType is required for SWAPPABLE'
    return
  }
  if (batteryMode === 'INTEGRATED' && !connectorType) {
    err.textContent = 'connectorType is required for INTEGRATED'
    return
  }
  const email = document.getElementById('reg-email').value.trim()
  const password = document.getElementById('reg-password').value
  const displayName = document.getElementById('reg-name').value.trim()
  if (!email || !password || !displayName) {
    err.textContent = 'Email, password, and display name are required'
    return
  }
  draft = {
    email,
    password,
    displayName,
    batteryMode,
    batteryType: batteryMode === 'SWAPPABLE' ? batteryType : undefined,
    connectorType: batteryMode === 'INTEGRATED' ? connectorType : undefined,
  }
  showStep(2)
  startLink()
})

document.getElementById('reg-back').addEventListener('click', (e) => {
  e.preventDefault()
  clearTimeout(linkTimer)
  showStep(1)
})

document.getElementById('reg-create').addEventListener('click', async () => {
  try {
    const { token: t } = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(draft),
    })
    setToken(t)
    location.href = '/stations.html'
  } catch (ex) {
    err.textContent = ex.message
    showStep(1)
  }
})
