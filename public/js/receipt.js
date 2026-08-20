'use strict'

const { requireAuth, fillSessionChrome } = window.SwapLoopApi

if (!requireAuth()) throw new Error('redirect')

;(async () => {
  await fillSessionChrome()
  let service = null
  try {
    service = JSON.parse(sessionStorage.getItem('swaploop_receipt') || 'null')
  } catch {
    service = null
  }
  if (!service) {
    location.href = '/activity.html'
    return
  }
  const doneWord = service.type === 'SWAP' ? 'Swap confirmed' : 'Charging collected'
  document.getElementById('receipt-banner-text').textContent =
    `${doneWord}. This service is now in Recent.`
  document.getElementById('receipt-amount').textContent =
    `CNY ${Number(service.priceYuan).toFixed(2)}`
  document.getElementById('receipt-code').textContent = service.priceCode || '—'
  document.getElementById('receipt-service').textContent =
    `${service.type} · ${service.status}`
  document.getElementById('receipt-station').textContent =
    service.stationName || service.stationId
  document.getElementById('receipt-when').textContent =
    service.confirmedAt || service.createdAt || '—'
})()
