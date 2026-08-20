'use strict'

const { api, requireAuth, fillSessionChrome } = window.SwapLoopApi

let reserveInFlight = false
let station = null
let me = null

function toast(message) {
  const el = document.getElementById('toast')
  el.hidden = false
  el.textContent = message
  clearTimeout(toast.tid)
  toast.tid = setTimeout(() => {
    el.hidden = true
  }, 3500)
}

function join(list) {
  return list && list.length ? list.join(' · ') : '—'
}

function serviceNames(station) {
  const map = { SWAP: 'Battery Swap Cabinet', BIKE_BAY: 'E-bike Charging Bay' }
  return (station.services || []).map((s) => map[s] || s).join(' · ') || '—'
}

function syncReserveUi(avail) {
  const reserveType = me?.batteryMode === 'INTEGRATED' ? 'CHARGING' : 'SWAP'
  const btn = document.getElementById('reserve-btn')
  const hint = document.getElementById('reserve-hint')
  const copy = document.getElementById('for-you-copy')
  const badge = document.getElementById('for-you-badge')
  btn.textContent = reserveType === 'SWAP' ? 'Reserve battery' : 'Reserve charging bay'
  badge.textContent = avail.readyLabel || (avail.eligible ? 'READY FOR YOU' : 'NOT AVAILABLE')
  const can = Boolean(me && station.status === 'ACTIVE' && avail.eligible)
  btn.disabled = !can || reserveInFlight
  if (!me) {
    hint.textContent = 'Sign in to reserve a battery or charging bay.'
    copy.textContent = 'Sign in to see packs and bays matched to your vehicle.'
  } else if (me.batteryMode === 'SWAPPABLE') {
    copy.textContent =
      'You are a swappable rider. Reserve a battery, then start and confirm the swap from Activity. Charging bays at HYBRID stations are for integrated bikes.'
    hint.textContent = avail.eligible
      ? ''
      : avail.message || 'Nothing compatible available right now.'
  } else {
    copy.textContent =
      'You have an integrated battery. Reserve a charging bay, then start charging from Activity. Live SOC is polled after start.'
    hint.textContent = avail.eligible
      ? 'Creates a CHARGING hold. Expiry is the API expiresAt value.'
      : avail.message || 'Nothing compatible available right now.'
  }
  return reserveType
}

;(async () => {
  me = await fillSessionChrome()
  const id = new URLSearchParams(location.search).get('id')
  const err = document.getElementById('station-error')
  if (!id) {
    err.textContent = 'Station not found'
    document.getElementById('station-name').textContent = 'Unknown station'
    return
  }
  try {
    station = await api('/stations/' + encodeURIComponent(id))
    document.getElementById('station-name').textContent = station.name
    document.getElementById('station-type').textContent = station.type
    document.getElementById('station-status').textContent = station.status
    document.getElementById('station-address').textContent = station.address || '—'
    document.getElementById('station-hours').textContent = station.hours || '—'
    document.getElementById('station-services').textContent = serviceNames(station)
    document.getElementById('station-battery-types').textContent = join(station.batteryTypes)
    document.getElementById('station-connectors').textContent = join(station.connectorTypes)
    document.getElementById('station-voltage').textContent = join(station.voltageClasses)
    const avail = station.riderAvailability || {}
    document.getElementById('station-availability').textContent = avail.message || '—'

    let reserveType = syncReserveUi(avail)

    document.getElementById('reserve-btn').addEventListener('click', async () => {
      if (!requireAuth() || reserveInFlight) return
      reserveInFlight = true
      syncReserveUi(station.riderAvailability || {})
      err.textContent = ''
      try {
        await api('/services', {
          method: 'POST',
          body: JSON.stringify({ type: reserveType, stationId: station.id }),
        })
        toast('Hold created — opening Activity')
        location.href = '/activity.html'
      } catch (ex) {
        err.textContent = ex.message
        if (ex.status === 409) {
          station = await api('/stations/' + encodeURIComponent(id))
          const a = station.riderAvailability || {}
          document.getElementById('station-availability').textContent = a.message || '—'
          reserveType = syncReserveUi(a)
        }
      } finally {
        reserveInFlight = false
        syncReserveUi(station.riderAvailability || {})
      }
    })
  } catch (ex) {
    err.textContent = ex.message
    document.getElementById('station-name').textContent = 'Station unavailable'
  }
})()
