'use strict'

const { api, requireAuth, fillSessionChrome } = window.SwapLoopApi

if (!requireAuth()) throw new Error('redirect')

fillSessionChrome()

const err = document.getElementById('scan-error')
const wc = document.getElementById('qr-wc')

wc.setAttribute('service-url', location.origin)
wc.setAttribute('scan-duration', '800')

function openFromPayload(payload) {
  const m =
    /\/stations\/([A-Za-z0-9_-]+)/.exec(payload) ||
    /^(station-[A-Za-z0-9_-]+)$/.exec(payload)
  if (!m) {
    err.textContent = 'QR payload does not match a SwapLoop station poster'
    return
  }
  const stationId = m[1]
  err.textContent = ''
  api('/stations/' + encodeURIComponent(stationId))
    .then(() => {
      location.href = `/station.html?id=${encodeURIComponent(stationId)}`
    })
    .catch((ex) => {
      err.textContent = ex.message || 'Station not found'
    })
}

window.addEventListener('qr-scan', (event) => {
  const payload = event.detail && event.detail.payload
  if (typeof payload === 'string') openFromPayload(payload)
})

document.getElementById('qr-scan-btn').addEventListener('click', () => {
  err.textContent = ''
  // Emulator only reacts to scan-request-id when old value !== null, so the
  // first setAttribute is a no-op. Public startScan() always starts a scan.
  if (typeof wc.startScan === 'function') wc.startScan()
})
