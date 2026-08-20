'use strict'

const { api, fillSessionChrome } = window.SwapLoopApi

fillSessionChrome()

const params = new URLSearchParams(location.search)
const typeFilter = params.get('type') || 'ALL'
const list = document.getElementById('station-list')
const empty = document.getElementById('stations-empty')
const err = document.getElementById('stations-error')
const tmpl = document.getElementById('station-card-template')

document.querySelectorAll('[data-filter]').forEach((el) => {
  if (el.getAttribute('data-filter') === typeFilter) {
    el.classList.add('is-active')
    el.setAttribute('aria-current', 'page')
  }
})

;(async () => {
  try {
    const q = typeFilter !== 'ALL' ? `?type=${encodeURIComponent(typeFilter)}` : ''
    const stations = await api('/stations' + q)
    if (!stations.length) {
      empty.hidden = false
      return
    }
    for (const s of stations) {
      const node = tmpl.content.cloneNode(true)
      const link = node.querySelector('a')
      const badge = node.querySelector('[data-field="availability"]')
      const eligible = Boolean(s.riderAvailability?.eligible)
      link.href = `/station.html?id=${encodeURIComponent(s.id)}`
      link.setAttribute('data-testid', `station-card-${s.id}`)
      link.setAttribute('data-station-id', s.id)
      node.querySelector('[data-field="name"]').textContent = s.name
      node.querySelector('[data-field="type"]').textContent = s.type
      node.querySelector('[data-field="status"]').textContent = s.status
      badge.textContent = s.riderAvailability?.message || 'Sign in for availability'
      badge.classList.toggle('is-warn', !eligible)
      list.appendChild(node)
    }
  } catch (ex) {
    err.textContent = ex.message
  }
})()
