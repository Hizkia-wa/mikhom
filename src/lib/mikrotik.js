// RouterOS API Client Helper with Mock Data Support
import RouterOSClient from 'routeros-client';

// In-memory mock database for offline demo/testing
let MOCK_DATA = {
  resource: {
    platform: 'MikroTik',
    boardName: 'hEX S (RB760iGS)',
    version: '7.12.1 (stable)',
    uptime: '14d 06:23:41',
    cpuLoad: 12,
    cpuCount: 4,
    freeMemory: 184549376,
    totalMemory: 268435456,
    freeHddSpace: 12480000,
    totalHddSpace: 16777216,
  },
  interfaces: [
    { id: '*1', name: 'ether1-WAN', type: 'ether', running: 'true', disabled: 'false', rxByte: 145920392, txByte: 84920492 },
    { id: '*2', name: 'ether2-LAN', type: 'ether', running: 'true', disabled: 'false', rxByte: 94820293, txByte: 139203940 },
    { id: '*3', name: 'wlan1-Hotspot', type: 'wlan', running: 'true', disabled: 'false', rxByte: 84920194, txByte: 124820492 }
  ],
  users: [
    { '.id': '*1', name: 'user01', profile: '1-JAM-5K', uptime: '45m 12s', 'bytes-in': '4520930', 'bytes-out': '18492040', comment: 'vc-101', disabled: 'false' },
    { '.id': '*2', name: 'user02', profile: '3-JAM-10K', uptime: '1h 20m', 'bytes-in': '12409300', 'bytes-out': '84920400', comment: 'vc-102', disabled: 'false' },
    { '.id': '*3', name: 'user03', profile: '1-HARI-15K', uptime: '5h 10m', 'bytes-in': '54209300', 'bytes-out': '340920400', comment: 'vc-103', disabled: 'false' },
    { '.id': '*4', name: 'vip_guest', profile: 'UNLIMITED', uptime: '2d 04h', 'bytes-in': '154209300', 'bytes-out': '940920400', comment: 'vip', disabled: 'false' },
  ],
  activeUsers: [
    { '.id': '*a1', user: 'user01', address: '192.168.88.105', 'mac-address': '7C:C2:55:A1:B2:C3', uptime: '45m 12s', 'bytes-in': '4520930', 'bytes-out': '18492040' },
    { '.id': '*a2', user: 'user02', address: '192.168.88.112', 'mac-address': 'A4:E9:75:11:22:33', uptime: '1h 20m', 'bytes-in': '12409300', 'bytes-out': '84920400' },
    { '.id': '*a3', user: 'vip_guest', address: '192.168.88.150', 'mac-address': '98:01:A7:44:55:66', uptime: '2d 04h', 'bytes-in': '154209300', 'bytes-out': '940920400' }
  ],
  profiles: [
    { '.id': '*p1', name: 'default', 'rate-limit': 'unlimited', 'shared-users': '1', price: '0', sellingPrice: '0' },
    { '.id': '*p2', name: '1-JAM-5K', 'rate-limit': '2M/2M', 'shared-users': '1', price: '4000', sellingPrice: '5000', 'on-login': '' },
    { '.id': '*p3', name: '3-JAM-10K', 'rate-limit': '3M/3M', 'shared-users': '1', price: '8000', sellingPrice: '10000', 'on-login': '' },
    { '.id': '*p4', name: '1-HARI-15K', 'rate-limit': '5M/5M', 'shared-users': '1', price: '12000', sellingPrice: '15000', 'on-login': '' },
    { '.id': '*p5', name: 'UNLIMITED', 'rate-limit': '10M/10M', 'shared-users': '2', price: '50000', sellingPrice: '60000', 'on-login': '' }
  ]
};

export async function getMikroTikClient(config) {
  const host = config?.host || process.env.MIKROTIK_HOST;
  const user = config?.user || process.env.MIKROTIK_USER;
  const password = config?.password || process.env.MIKROTIK_PASSWORD;
  const port = parseInt(config?.port || process.env.MIKROTIK_PORT || '8728');

  // If host is not provided or set to mock, return mock helper
  if (!host || host === 'mock' || host === '127.0.0.1' || host === 'localhost') {
    return { isMock: true };
  }

  try {
    const client = new RouterOSClient({
      host,
      user,
      password,
      port,
      timeout: 5000
    });
    const api = await client.connect();
    return { isMock: false, client, api };
  } catch (err) {
    console.warn('Failed to connect to MikroTik API, falling back to mock mode:', err.message);
    return { isMock: true, error: err.message };
  }
}

export async function fetchSystemResource(config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    // Simulate slight fluctuation in CPU & RAM for realistic demo
    MOCK_DATA.resource.cpuLoad = Math.min(100, Math.max(5, MOCK_DATA.resource.cpuLoad + Math.floor(Math.random() * 9 - 4)));
    return { success: true, isMock: true, data: MOCK_DATA.resource };
  }

  try {
    const res = await api.write('/system/resource/print');
    const data = res[0] || {};
    if (client) client.close();
    return {
      success: true,
      isMock: false,
      data: {
        platform: data['platform'] || 'MikroTik',
        boardName: data['board-name'] || data['architecture-name'] || 'RouterBoard',
        version: data['version'] || 'N/A',
        uptime: data['uptime'] || '0s',
        cpuLoad: parseInt(data['cpu-load'] || '0'),
        cpuCount: parseInt(data['cpu-count'] || '1'),
        freeMemory: parseInt(data['free-memory'] || '0'),
        totalMemory: parseInt(data['total-memory'] || '0'),
        freeHddSpace: parseInt(data['free-hdd-space'] || '0'),
        totalHddSpace: parseInt(data['total-hdd-space'] || '0')
      }
    };
  } catch (err) {
    return { success: false, error: err.message, data: MOCK_DATA.resource, isMock: true };
  }
}

export async function fetchTraffic(interfaceName = 'ether1-WAN', config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    const rx = Math.floor(Math.random() * 5000000) + 1000000;
    const tx = Math.floor(Math.random() * 8000000) + 2000000;
    return { success: true, isMock: true, rx, tx, timestamp: new Date().toLocaleTimeString() };
  }

  try {
    const res = await api.write('/interface/monitor-traffic', ['=interface=' + interfaceName, '=once=']);
    const data = res[0] || {};
    if (client) client.close();
    return {
      success: true,
      isMock: false,
      rx: parseInt(data['rx-bits-per-second'] || '0'),
      tx: parseInt(data['tx-bits-per-second'] || '0'),
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (err) {
    const rx = Math.floor(Math.random() * 4000000) + 500000;
    const tx = Math.floor(Math.random() * 6000000) + 1000000;
    return { success: true, isMock: true, rx, tx, timestamp: new Date().toLocaleTimeString() };
  }
}

export async function fetchUsers(config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    return { success: true, isMock: true, data: MOCK_DATA.users };
  }

  try {
    const res = await api.write('/ip/hotspot/user/print');
    if (client) client.close();
    return { success: true, isMock: false, data: res };
  } catch (err) {
    return { success: true, isMock: true, data: MOCK_DATA.users };
  }
}

export async function fetchActiveUsers(config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    return { success: true, isMock: true, data: MOCK_DATA.activeUsers };
  }

  try {
    const res = await api.write('/ip/hotspot/active/print');
    if (client) client.close();
    return { success: true, isMock: false, data: res };
  } catch (err) {
    return { success: true, isMock: true, data: MOCK_DATA.activeUsers };
  }
}

export async function fetchProfiles(config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    return { success: true, isMock: true, data: MOCK_DATA.profiles };
  }

  try {
    const res = await api.write('/ip/hotspot/user/profile/print');
    if (client) client.close();
    return { success: true, isMock: false, data: res };
  } catch (err) {
    return { success: true, isMock: true, data: MOCK_DATA.profiles };
  }
}

export async function addHotspotUser(userData, config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    const newUser = {
      '.id': '*mock_' + Date.now(),
      name: userData.name,
      password: userData.password || userData.name,
      profile: userData.profile || 'default',
      limitUptime: userData.limitUptime || '0',
      limitBytesTotal: userData.limitBytesTotal || '0',
      comment: userData.comment || 'vc-' + Math.floor(Math.random() * 900 + 100),
      uptime: '0s',
      'bytes-in': '0',
      'bytes-out': '0',
      disabled: 'false'
    };
    MOCK_DATA.users.unshift(newUser);
    return { success: true, isMock: true, user: newUser };
  }

  try {
    const params = [
      '=name=' + userData.name,
      '=password=' + (userData.password || userData.name),
      '=profile=' + (userData.profile || 'default')
    ];
    if (userData.comment) params.push('=comment=' + userData.comment);
    if (userData.limitUptime) params.push('=limit-uptime=' + userData.limitUptime);
    if (userData.limitBytesTotal) params.push('=limit-bytes-total=' + userData.limitBytesTotal);

    const res = await api.write('/ip/hotspot/user/add', params);
    if (client) client.close();
    return { success: true, isMock: false, data: res };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteHotspotUser(id, config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    MOCK_DATA.users = MOCK_DATA.users.filter(u => u['.id'] !== id && u.name !== id);
    return { success: true, isMock: true };
  }

  try {
    await api.write('/ip/hotspot/user/remove', ['=.id=' + id]);
    if (client) client.close();
    return { success: true, isMock: false };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function kickActiveUser(id, config) {
  const { isMock, api, client } = await getMikroTikClient(config);
  if (isMock) {
    MOCK_DATA.activeUsers = MOCK_DATA.activeUsers.filter(a => a['.id'] !== id && a.user !== id);
    return { success: true, isMock: true };
  }

  try {
    await api.write('/ip/hotspot/active/remove', ['=.id=' + id]);
    if (client) client.close();
    return { success: true, isMock: false };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
