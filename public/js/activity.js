'use strict'

const { api, setToken, requireAuth, fillSessionChrome } = window.SwapLoopApi

if (!requireAuth()) {
  /* redirect */
} else {
  let countdownTimer = null
  let chargeTimer = null
  let activeService = null
  let expiresAt = null

  fillSessionChrome()

  function clearTimers() {
    clearInterval(countdownTimer)
    clearInterval(chargeTimer)
    countdownTimer = null
    chargeTimer = null
  }

  function setHidden(id, hidden) {
    const el = document.getElementById(id)
    if (!el) return
    el.hidden = hidden
  }

  function syncActions(s) {
    const reserved = s.status === 'RESERVED'
    const swapStarted = s.type === 'SWAP' && s.status === 'STARTED'
    const readyCollect = s.status === 'READY_FOR_COLLECTION'
    setHidden('action-start', !reserved)
    setHidden('action-confirm', !swapStarted)
    setHidden('action-collect', !readyCollect)
    setHidden('action-cancel', !(reserved || swapStarted))
    document.getElementById('action-start').textContent =
      s.type === 'SWAP' ? 'Start swapping' : 'Start charging'
  }

  function setLede(s) {
    const el = document.getElementById('activity-lede')
    if (!s) {
      el.textContent = 'No active service right now.'
      return
    }
    if (s.type === 'SWAP' && s.status === 'RESERVED') {
      el.textContent =
        'Active SWAP hold. Start swapping at the Battery Swap Cabinet. No extra QR is required for the handoff.'
    } else if (s.type === 'CHARGING' && s.status === 'CHARGING') {
      el.textContent =
        'Charging in progress. Live status is polled about once per second. There is no Mark ready control — the backend advances to collect.'
    } else if (s.type === 'CHARGING' && s.status === 'RESERVED') {
      el.textContent = 'Active CHARGING hold. Start charging before the hold expires.'
    } else {
      el.textContent = 'Active service — follow the controls below.'
    }
  }

  function tickCountdown() {
    const box = document.getElementById('active-countdown')
    if (!expiresAt) return
    const secs = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000))
    box.hidden = false
    document.getElementById('countdown-secs').textContent = `${String(secs).padStart(2, '0')} s`
    document.getElementById('countdown-iso').textContent = `expiresAt ${expiresAt}`
    if (secs <= 0) {
      clearTimers()
      loadActivity()
    }
  }

  function minsLeft(endsAt) {
    if (!endsAt) return '—'
    const m = Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 60000))
    return `${m} min`
  }

  async function loadActivity() {
    const err = document.getElementById('activity-error')
    clearTimers()
    try {
      const data = await api('/me/activity')
      const activeEl = document.getElementById('activity-active')
      const empty = document.getElementById('activity-empty')
      const recentEl = document.getElementById('activity-recent')
      activeService = data.active
      expiresAt = data.active?.expiresAt || null
      setLede(data.active)

      if (!data.active) {
        activeEl.hidden = true
        empty.hidden = false
      } else {
        empty.hidden = true
        activeEl.hidden = false
        const s = data.active
        document.getElementById('active-type').textContent = s.type
        document.getElementById('active-status').textContent = s.status
        document.getElementById('active-station').textContent = s.stationName || s.stationId
        document.getElementById('active-unit').textContent = s.unitLabel || ''

        syncActions(s)

        const live = document.getElementById('charging-live')
        if (s.status === 'RESERVED') {
          tickCountdown()
          countdownTimer = setInterval(tickCountdown, 1000)
          live.hidden = true
        } else {
          document.getElementById('active-countdown').hidden = true
        }

        if (s.type === 'CHARGING' && s.status === 'CHARGING') {
          live.hidden = false
          const paint = (st) => {
            document.getElementById('m-soc').textContent = `${st.soc}%`
            document.getElementById('m-power').textContent = `${st.powerKw} kW`
            document.getElementById('m-temp').textContent = `${st.temperatureC} °C`
            document.getElementById('m-ends').textContent = minsLeft(st.endsAt)
            document.getElementById('m-ends-iso').textContent = st.endsAt
              ? `endsAt ${st.endsAt}`
              : ''
            document.getElementById('charging-poll-hint').textContent = st.sampledAt
              ? `Polling… last sample ${st.sampledAt}`
              : 'Polling…'
          }
          if (s.charging) paint({ ...s.charging, status: s.status })
          chargeTimer = setInterval(async () => {
            try {
              const st = await api(`/services/${s.id}/charging-status`)
              paint(st)
              if (st.status === 'READY_FOR_COLLECTION') {
                clearTimers()
                await loadActivity()
              }
            } catch (ex) {
              err.textContent = ex.message
            }
          }, 1000)
        } else if (s.status !== 'RESERVED') {
          live.hidden = true
        }
      }

      recentEl.replaceChildren()
      const tmpl = document.getElementById('recent-template')
      for (const r of data.recent || []) {
        const node = tmpl.content.cloneNode(true)
        const root = node.querySelector('[data-testid="recent-service"]')
        root.setAttribute('data-testid', `recent-service-${r.id}`)
        node.querySelector('[data-field="status"]').textContent = r.status
        node.querySelector('[data-field="type"]').textContent = r.type
        node.querySelector('[data-field="station"]').textContent = r.stationName || r.stationId
        const meta = []
        if (r.confirmedAt || r.createdAt) meta.push(r.confirmedAt || r.createdAt)
        node.querySelector('[data-field="meta"]').textContent = meta.length
          ? ` · ${meta.join(' · ')}`
          : ''
        if (r.priceYuan != null) {
          node.querySelector('[data-field="price-wrap"]').hidden = false
          node.querySelector('[data-field="price"]').textContent = `CNY ${Number(r.priceYuan).toFixed(2)}`
        }
        recentEl.appendChild(node)
      }
    } catch (ex) {
      if (ex.status === 401 || ex.status === 403) {
        setToken('')
        location.href = '/login.html'
        return
      }
      err.textContent = ex.message
    }
  }

  async function act(path) {
    const err = document.getElementById('activity-error')
    if (!activeService) return
    try {
      const done = await api(`/services/${activeService.id}/${path}`, { method: 'POST' })
      if (path === 'confirm' || path === 'collect') {
        sessionStorage.setItem('swaploop_receipt', JSON.stringify(done))
        location.href = '/receipt.html'
        return
      }
      await loadActivity()
    } catch (ex) {
      err.textContent = ex.message
    }
  }

  document.getElementById('action-start').addEventListener('click', () => act('start'))
  document.getElementById('action-confirm').addEventListener('click', () => act('confirm'))
  document.getElementById('action-collect').addEventListener('click', () => act('collect'))
  document.getElementById('action-cancel').addEventListener('click', () => act('cancel'))

  loadActivity()
}
