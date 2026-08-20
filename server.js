'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const PORT = Number(process.env.PORT || 3000)
const PUBLIC_DIR = path.join(__dirname, 'public')
const HOLD_SECONDS = Number(process.env.HOLD_SECONDS || 10)
const CHARGE_SECONDS = Number(process.env.CHARGE_SECONDS || 15)

/**
 * In-memory Module C–compatible mock for Module G Cypress assessment.
 * Also stubs Station Service GET /api/qr/current for the QR emulator.
 * Reset with DELETE /api/v1/__reset
 */

function shanghaiIso(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const g = (type) => parts.find((p) => p.type === type).value
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour')}:${g('minute')}:${g('second')}.${ms}+08:00`
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function seedState() {
  return {
    users: [
      {
        id: 'user-lin',
        email: 'lin.xiaoyu@swaploop.test',
        password: 'password123',
        displayName: 'Lin Xiaoyu',
        role: 'RIDER',
        status: 'ACTIVE',
        batteryMode: 'SWAPPABLE',
        batteryType: 'SL-48',
        connectorType: null,
        voltageClass: '48V',
        currentBatteryId: 'BAT-48-1042',
      },
      {
        id: 'user-chen',
        email: 'chen.wei@swaploop.test',
        password: 'password123',
        displayName: 'Chen Hao',
        role: 'RIDER',
        status: 'ACTIVE',
        batteryMode: 'INTEGRATED',
        batteryType: null,
        connectorType: 'GB-AC-48',
        voltageClass: '48V',
        currentBatteryId: null,
      },
      {
        id: 'user-sun',
        email: 'sun.hao@swaploop.test',
        password: 'password123',
        displayName: 'Sun Hao',
        role: 'RIDER',
        status: 'SUSPENDED',
        batteryMode: 'SWAPPABLE',
        batteryType: 'SL-48',
        connectorType: null,
        voltageClass: '48V',
        currentBatteryId: null,
      },
    ],
    tokens: /** @type {Record<string, string>} */ ({}),
    stations: [
      {
        id: 'station-001',
        name: 'Jing’an Temple Station',
        type: 'HYBRID',
        status: 'ACTIVE',
        address: 'Nanjing West Road, Jing’an, Shanghai',
        hours: '06:00–24:00 +08:00',
        lat: 31.223,
        lng: 121.445,
        services: ['SWAP', 'BIKE_BAY'],
        batteryTypes: ['SL-48', 'SL-60'],
        connectorTypes: ['GB-AC-48', 'GB-AC-60'],
        voltageClasses: ['48V', '60V'],
        readySwapByType: { 'SL-48': 3, 'SL-60': 1 },
        readyBikeByConnector: { 'GB-AC-48': 2, 'GB-AC-60': 1 },
        slotLabel: { SWAP: 'Battery Slot B3', CHARGING: 'Bay 2' },
      },
      {
        id: 'station-002',
        name: 'Zhangjiang Science City',
        type: 'SWAP',
        status: 'ACTIVE',
        address: 'Zhangheng Road, Pudong, Shanghai',
        hours: '00:00–24:00 +08:00',
        lat: 31.2,
        lng: 121.6,
        services: ['SWAP'],
        batteryTypes: ['SL-48', 'SL-60'],
        connectorTypes: [],
        voltageClasses: ['48V', '60V'],
        readySwapByType: { 'SL-48': 2, 'SL-60': 1 },
        readyBikeByConnector: {},
        slotLabel: { SWAP: 'Battery Slot A1', CHARGING: null },
      },
      {
        id: 'station-003',
        name: 'Xuhui Riverside Charging',
        type: 'CHARGING',
        status: 'ACTIVE',
        address: 'Longteng Avenue, Xuhui, Shanghai',
        hours: '07:00–22:00 +08:00',
        lat: 31.19,
        lng: 121.47,
        services: ['BIKE_BAY'],
        batteryTypes: [],
        connectorTypes: ['GB-AC-48', 'GB-AC-60'],
        voltageClasses: ['48V', '60V'],
        readySwapByType: {},
        readyBikeByConnector: { 'GB-AC-48': 4, 'GB-AC-60': 1 },
        slotLabel: { SWAP: null, CHARGING: 'Bay 4' },
      },
      {
        id: 'station-005',
        name: 'Last-charge Safety Fixture',
        type: 'SWAP',
        status: 'ACTIVE',
        address: 'Fixture Lane, Competition Site',
        hours: '06:00–22:00 +08:00',
        lat: 31.21,
        lng: 121.48,
        services: ['SWAP'],
        batteryTypes: ['SL-48'],
        connectorTypes: [],
        voltageClasses: ['48V'],
        /** Only pack is sustained-heat fixture battery-007 — reserves always 409 for SL-48 */
        readySwapByType: { 'SL-48': 1 },
        readyBikeByConnector: {},
        slotLabel: { SWAP: 'Battery Slot H1', CHARGING: null },
        forceSwapConflict: true,
      },
    ],
    services: /** @type {any[]} */ ([]),
    forceConflictOnce: false,
    qrPayload: 'https://app.swaploop.test/stations/station-001',
  }
}

let state = seedState()

function sendJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function contentType(filePath) {
  switch (path.extname(filePath)) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

function serveStatic(req, res, pathname) {
  let relative = pathname === '/' ? '/index.html' : pathname
  relative = decodeURIComponent(relative)
  const filePath = path.normalize(path.join(PUBLIC_DIR, relative))
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) })
    res.end(data)
  })
}

function bearerUser(req) {
  const h = req.headers.authorization || ''
  const m = /^Bearer\s+(.+)$/i.exec(h)
  if (!m) return null
  const userId = state.tokens[m[1]]
  if (!userId) return null
  return state.users.find((u) => u.id === userId) || null
}

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    status: u.status,
    batteryMode: u.batteryMode,
    batteryType: u.batteryType,
    connectorType: u.connectorType,
    voltageClass: u.voltageClass,
    currentBatteryId: u.currentBatteryId,
  }
}

function riderAvailability(station, user) {
  if (!user) {
    return { eligible: false, readyCount: 0, message: 'Sign in to see rider availability' }
  }
    if (user.batteryMode === 'SWAPPABLE') {
    const ready = station.readySwapByType[user.batteryType] || 0
    const ok = station.services.includes('SWAP') && ready > 0 && station.status === 'ACTIVE'
    return {
      eligible: ok,
      service: 'SWAP',
      readyCount: ready,
      readyLabel: ok ? 'READY FOR YOU' : 'NOT AVAILABLE',
      message: ok
        ? `An ${user.batteryType} pack is in a Battery Slot.`
        : 'No ready battery for your profile',
    }
  }
  const ready = station.readyBikeByConnector[user.connectorType] || 0
  const ok = station.services.includes('BIKE_BAY') && ready > 0 && station.status === 'ACTIVE'
  return {
    eligible: ok,
    service: 'BIKE_BAY',
    readyCount: ready,
    readyLabel: ok ? 'READY FOR YOU' : 'NOT AVAILABLE',
    message: ok
      ? `A ${user.connectorType} E-bike Charging Bay is free.`
      : 'No ready charging bay for your profile',
  }
}

function activeFor(userId) {
  return state.services.find(
    (s) =>
      s.userId === userId &&
      !['CONFIRMED', 'COLLECTED', 'CANCELLED', 'EXPIRED'].includes(s.status),
  )
}

function priceFor(type, user) {
  if (type === 'SWAP') {
    const code =
      user && user.batteryType === 'SL-60' ? 'PAYG-SWAP-SL60' : 'PAYG-SWAP-SL48'
    return { priceYuan: 6, priceCode: code }
  }
  return { priceYuan: 8, priceCode: 'PAYG-CHARGE-GBAC48' }
}

function serviceLabel(station, type, user) {
  const slot = (station.slotLabel && station.slotLabel[type]) || null
  if (type === 'SWAP') {
    return slot ? `${slot} · ${user.batteryType}` : user.batteryType
  }
  return slot || user.connectorType
}

async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  /* Station Service stub for <swaploop-qr-emulator> */
  if (pathname === '/api/qr/current') {
    if (req.method === 'GET') {
      if (!state.qrPayload) {
        sendJson(res, 404, { message: 'No QR code is currently selected.' })
        return
      }
      sendJson(res, 200, { payload: state.qrPayload })
      return
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await readBody(req)
      if (!body.payload || typeof body.payload !== 'string') {
        sendJson(res, 422, { message: 'payload required' })
        return
      }
      state.qrPayload = body.payload
      sendJson(res, 200, { payload: state.qrPayload })
      return
    }
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', service: 'module-g-mock-c' })
    return
  }

  if (req.method === 'DELETE' && pathname === '/api/v1/__reset') {
    state = seedState()
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method === 'POST' && pathname === '/api/v1/__force-conflict') {
    state.forceConflictOnce = true
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/login') {
    const body = await readBody(req)
    const user = state.users.find((u) => u.email === body.email)
    if (!user || user.password !== body.password) {
      sendJson(res, 401, { message: 'Invalid email or password' })
      return
    }
    if (user.status === 'SUSPENDED') {
      sendJson(res, 403, { message: 'Account suspended' })
      return
    }
    const token = uid('tok')
    state.tokens[token] = user.id
    sendJson(res, 200, { token })
    return
  }

  if (req.method === 'POST' && pathname === '/api/v1/auth/register') {
    const body = await readBody(req)
    if (!body.email || !body.password || !body.displayName || !body.batteryMode) {
      sendJson(res, 422, { message: 'Missing required fields' })
      return
    }
    if (body.batteryMode === 'SWAPPABLE' && !body.batteryType) {
      sendJson(res, 422, { message: 'batteryType is required for SWAPPABLE' })
      return
    }
    if (body.batteryMode === 'INTEGRATED' && !body.connectorType) {
      sendJson(res, 422, { message: 'connectorType is required for INTEGRATED' })
      return
    }
    if (state.users.some((u) => u.email === body.email)) {
      sendJson(res, 409, { message: 'Email already registered' })
      return
    }
    const user = {
      id: uid('user'),
      email: body.email,
      password: body.password,
      displayName: body.displayName,
      role: 'RIDER',
      status: 'ACTIVE',
      batteryMode: body.batteryMode,
      batteryType: body.batteryMode === 'SWAPPABLE' ? body.batteryType : null,
      connectorType: body.batteryMode === 'INTEGRATED' ? body.connectorType : null,
      voltageClass: (body.batteryType || body.connectorType || '').includes('60')
        ? '60V'
        : '48V',
      currentBatteryId: null,
    }
    state.users.push(user)
    const token = uid('tok')
    state.tokens[token] = user.id
    sendJson(res, 201, { token })
    return
  }

  if (pathname === '/api/v1/me' && req.method === 'GET') {
    const user = bearerUser(req)
    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' })
      return
    }
    sendJson(res, 200, publicUser(user))
    return
  }

  if (pathname === '/api/v1/me' && req.method === 'PATCH') {
    const user = bearerUser(req)
    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' })
      return
    }
    const body = await readBody(req)
    if (body.displayName) user.displayName = body.displayName
    if (body.batteryMode === 'SWAPPABLE') {
      user.batteryMode = 'SWAPPABLE'
      user.batteryType = body.batteryType
      user.connectorType = null
      user.voltageClass = body.batteryType === 'SL-60' ? '60V' : '48V'
    }
    if (body.batteryMode === 'INTEGRATED') {
      user.batteryMode = 'INTEGRATED'
      user.connectorType = body.connectorType
      user.batteryType = null
      user.voltageClass = String(body.connectorType || '').includes('60') ? '60V' : '48V'
    }
    sendJson(res, 200, publicUser(user))
    return
  }

  if (pathname === '/api/v1/me/activity' && req.method === 'GET') {
    const user = bearerUser(req)
    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' })
      return
    }
    const mine = state.services.filter((s) => s.userId === user.id)
    const active = activeFor(user.id) || null
    const recent = mine
      .filter((s) => ['CONFIRMED', 'COLLECTED', 'CANCELLED', 'EXPIRED'].includes(s.status))
      .slice(-10)
      .reverse()
    sendJson(res, 200, { active, recent })
    return
  }

  if (pathname === '/api/v1/stations' && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const type = url.searchParams.get('type')
    const user = bearerUser(req)
    let list = state.stations.slice()
    if (type && type !== 'ALL') {
      list = list.filter((s) => s.type === type)
    }
    sendJson(
      res,
      200,
      list.map((s) => ({
        ...s,
        riderAvailability: riderAvailability(s, user),
      })),
    )
    return
  }

  const stationMatch = /^\/api\/v1\/stations\/([^/]+)$/.exec(pathname)
  if (stationMatch && req.method === 'GET') {
    const station = state.stations.find((s) => s.id === stationMatch[1])
    if (!station) {
      sendJson(res, 404, { message: 'Station not found' })
      return
    }
    const user = bearerUser(req)
    sendJson(res, 200, {
      ...station,
      riderAvailability: riderAvailability(station, user),
    })
    return
  }

  if (pathname === '/api/v1/services' && req.method === 'POST') {
    const user = bearerUser(req)
    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' })
      return
    }
    const body = await readBody(req)
    const station = state.stations.find((s) => s.id === body.stationId)
    if (!station) {
      sendJson(res, 404, { message: 'Station not found' })
      return
    }
    const existing = activeFor(user.id)
    if (existing) {
      if (existing.stationId !== station.id) {
        sendJson(res, 409, {
          message: 'You already have an active service at another station',
          activeServiceId: existing.id,
        })
        return
      }
      sendJson(res, 200, existing)
      return
    }
    if (station.forceSwapConflict && body.type === 'SWAP' && user.batteryMode === 'SWAPPABLE') {
      station.readySwapByType[user.batteryType] = 0
      sendJson(res, 409, { message: 'The selected battery is not available anymore' })
      return
    }
    if (state.forceConflictOnce && user.batteryMode === 'SWAPPABLE') {
      state.forceConflictOnce = false
      station.readySwapByType[user.batteryType] = 0
      sendJson(res, 409, { message: 'The selected battery is not available anymore' })
      return
    }
    const type = body.type
    if (type === 'SWAP' && user.batteryMode !== 'SWAPPABLE') {
      sendJson(res, 422, { message: 'Rider not eligible for swap' })
      return
    }
    if (type === 'CHARGING' && user.batteryMode !== 'INTEGRATED') {
      sendJson(res, 422, { message: 'Rider not eligible for charging' })
      return
    }
    const avail = riderAvailability(station, user)
    if (!avail.eligible) {
      sendJson(res, 409, {
        message:
          type === 'SWAP'
            ? 'The selected battery is not available anymore'
            : 'The selected charging bay is not available anymore',
      })
      return
    }
    const expiresAt = new Date(Date.now() + HOLD_SECONDS * 1000)
    const service = {
      id: uid('svc'),
      userId: user.id,
      stationId: station.id,
      stationName: station.name,
      type,
      status: 'RESERVED',
      createdAt: shanghaiIso(),
      expiresAt: shanghaiIso(expiresAt),
      unitLabel: serviceLabel(station, type, user),
      priceYuan: null,
      priceCode: null,
      confirmedAt: null,
      charging: type === 'CHARGING' ? { soc: 20, powerKw: 0, temperatureC: 28, endsAt: null } : null,
    }
    state.services.push(service)
    sendJson(res, 201, service)
    return
  }

  const serviceMatch =
    /^\/api\/v1\/services\/([^/]+)(?:\/(start|confirm|collect|cancel|charging-status))?$/.exec(
      pathname,
    )
  if (serviceMatch) {
    const service = state.services.find((s) => s.id === serviceMatch[1])
    const action = serviceMatch[2] || null
    const user = bearerUser(req)
    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' })
      return
    }
    if (!service || service.userId !== user.id) {
      sendJson(res, 404, { message: 'Service not found' })
      return
    }

    if (!action && req.method === 'GET') {
      sendJson(res, 200, service)
      return
    }

    if (action === 'start' && req.method === 'POST') {
      if (service.status !== 'RESERVED') {
        sendJson(res, 409, { message: 'Service not reserved' })
        return
      }
      if (new Date(service.expiresAt).getTime() < Date.now()) {
        service.status = 'EXPIRED'
        sendJson(res, 409, { message: 'Hold expired' })
        return
      }
      if (service.type === 'SWAP') {
        service.status = 'STARTED'
      } else {
        service.status = 'CHARGING'
        const ends = new Date(Date.now() + CHARGE_SECONDS * 1000)
        service.charging = {
          soc: 35,
          powerKw: 1.8,
          temperatureC: 34,
          endsAt: shanghaiIso(ends),
          startedAt: shanghaiIso(),
        }
      }
      sendJson(res, 200, service)
      return
    }

    if (action === 'charging-status' && req.method === 'GET') {
      if (service.type !== 'CHARGING') {
        sendJson(res, 422, { message: 'Not a charging service' })
        return
      }
      if (service.status === 'CHARGING' && service.charging) {
        const ends = service.charging.endsAt ? new Date(service.charging.endsAt) : null
        if (ends && Date.now() >= ends.getTime()) {
          service.status = 'READY_FOR_COLLECTION'
          service.charging.soc = 100
          service.charging.powerKw = 0
        } else if (ends) {
          const total = CHARGE_SECONDS * 1000
          const left = Math.max(0, ends.getTime() - Date.now())
          const progress = 1 - left / total
          service.charging.soc = Math.min(99, Math.round(35 + progress * 65))
          service.charging.powerKw = 1.8
          service.charging.temperatureC = 34
          service.charging.sampledAt = shanghaiIso()
        }
      }
      sendJson(res, 200, {
        status: service.status,
        ...service.charging,
      })
      return
    }

    if (action === 'confirm' && req.method === 'POST') {
      if (service.status !== 'STARTED') {
        sendJson(res, 409, { message: 'Service not started' })
        return
      }
      const price = priceFor('SWAP', user)
      service.status = 'CONFIRMED'
      service.priceYuan = price.priceYuan
      service.priceCode = price.priceCode
      service.confirmedAt = shanghaiIso()
      sendJson(res, 200, service)
      return
    }

    if (action === 'collect' && req.method === 'POST') {
      if (service.status !== 'READY_FOR_COLLECTION') {
        sendJson(res, 409, { message: 'Bike not ready for collection' })
        return
      }
      const price = priceFor('CHARGING', user)
      service.status = 'COLLECTED'
      service.priceYuan = price.priceYuan
      service.priceCode = price.priceCode
      service.confirmedAt = shanghaiIso()
      sendJson(res, 200, service)
      return
    }

    if (action === 'cancel' && req.method === 'POST') {
      if (!['RESERVED', 'STARTED'].includes(service.status)) {
        sendJson(res, 409, { message: 'Cannot cancel in current status' })
        return
      }
      if (service.type === 'CHARGING' && service.status !== 'RESERVED') {
        sendJson(res, 409, { message: 'Cancel only while reserved for charging' })
        return
      }
      service.status = 'CANCELLED'
      sendJson(res, 200, service)
      return
    }
  }

  sendJson(res, 404, { message: 'Not found' })
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const pathname = url.pathname
    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname)
      return
    }
    serveStatic(req, res, pathname)
  } catch (err) {
    sendJson(res, 500, { message: 'Internal error', detail: String(err && err.message) })
  }
})

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} busy. Try: PORT=3080 node server.js`)
    process.exit(1)
  }
  throw err
})

const HOST = process.env.HOST || '0.0.0.0'
server.listen(PORT, HOST, () => {
  console.log(`Module G rider app + mock API`)
  console.log(`  Open http://127.0.0.1:${PORT}/login.html`)
  console.log(`  QR tester http://127.0.0.1:${PORT}/qr-code-emulator.html`)
})
