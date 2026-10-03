/* ═══════════════════════════════════════════════════════════════
   Network Learn Atlas — Interactive Demos Engine
   Each topic card gets a "Try It" demo that students can interact with
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────── Helper Utilities ──────────────── */
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function createDemo(parentId, html) {
        const card = document.getElementById(parentId);
        if (!card) return null;
        const body = card.querySelector('.topic-body');
        if (!body) return null;
        const demo = document.createElement('div');
        demo.className = 'demo-box';
        demo.innerHTML = `<div class="demo-header"><span class="demo-badge">🔬 Interactive Demo</span></div>${html}`;
        body.appendChild(demo);
        return demo;
    }

    function animatePacket(container, packetEl, path, duration = 600) {
        return new Promise(resolve => {
            if (!container || !packetEl) { resolve(); return; }
            const steps = path.length;
            let i = 0;
            function step() {
                if (i >= steps) { resolve(); return; }
                const node = container.querySelector(path[i]);
                if (node) {
                    const cRect = container.getBoundingClientRect();
                    const nRect = node.getBoundingClientRect();
                    packetEl.style.left = (nRect.left - cRect.left + nRect.width / 2 - 14) + 'px';
                    packetEl.style.top = (nRect.top - cRect.top + nRect.height / 2 - 14) + 'px';
                    packetEl.style.opacity = '1';
                    node.classList.add('demo-node-active');
                    setTimeout(() => node.classList.remove('demo-node-active'), duration - 100);
                }
                i++;
                setTimeout(step, duration);
            }
            step();
        });
    }

    /* ═══════════════════════════════════════════════════
       1. NETWORKING DEMOS
       ═══════════════════════════════════════════════════ */

    /* ── LAN / WAN ── */
    createDemo('lan-wan', `
        <p class="demo-desc">Click <strong>Send Data</strong> to watch a packet travel from a home device through the LAN, across the WAN, and into a remote office.</p>
        <div class="demo-network-path" id="lan-wan-sim">
            <div class="demo-node demo-n-device" data-n="0">💻<span>Laptop</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-switch" data-n="1">🔀<span>Switch</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-n="2">🌐<span>Router</span></div>
            <div class="demo-arrow demo-arrow-wan">⇢ WAN ⇢</div>
            <div class="demo-node demo-n-router" data-n="3">🌐<span>Router</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-switch" data-n="4">🔀<span>Switch</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-device" data-n="5">🖥️<span>Server</span></div>
            <div class="demo-packet" id="lan-wan-pkt">📦</div>
        </div>
        <div class="demo-log" id="lan-wan-log"></div>
        <button class="demo-btn" id="lan-wan-btn">▶ Send Data</button>
    `);

    const lanWanBtn = document.getElementById('lan-wan-btn');
    if (lanWanBtn) {
        lanWanBtn.addEventListener('click', async function () {
            this.disabled = true;
            const sim = document.getElementById('lan-wan-sim');
            const pkt = document.getElementById('lan-wan-pkt');
            const log = document.getElementById('lan-wan-log');
            log.innerHTML = '';
            const steps = [
                { sel: '[data-n="0"]', msg: '📦 Laptop prepares the data frame on the LAN' },
                { sel: '[data-n="1"]', msg: '🔀 Switch forwards frame using MAC address table' },
                { sel: '[data-n="2"]', msg: '🌐 Router examines IP and routes to WAN' },
                { sel: '[data-n="3"]', msg: '🌐 Remote router receives packet from WAN' },
                { sel: '[data-n="4"]', msg: '🔀 Remote switch delivers frame to correct port' },
                { sel: '[data-n="5"]', msg: '🖥️ Server receives the data!' },
            ];
            for (const s of steps) {
                await animatePacket(sim, pkt, [s.sel], 700);
                log.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(300);
            }
            pkt.style.opacity = '0';
            this.disabled = false;
        });
    }

    /* ── Hub / Switch / Router ── */
    createDemo('hub-switch-router', `
        <p class="demo-desc">Select a device type and click <strong>Send Frame</strong> to see how traffic is handled differently.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="hsr-type" value="hub" checked> Hub</label>
            <label class="demo-radio"><input type="radio" name="hsr-type" value="switch"> Switch</label>
            <label class="demo-radio"><input type="radio" name="hsr-type" value="router"> Router</label>
        </div>
        <div class="demo-hsr-grid" id="hsr-sim">
            <div class="demo-node demo-n-device hsr-src" data-h="src">💻<span>Source</span></div>
            <div class="demo-hsr-center" data-h="center" id="hsr-center">📡 Hub</div>
            <div class="demo-node demo-n-device hsr-dst" data-h="d1">🖥️<span>PC-A</span></div>
            <div class="demo-node demo-n-device hsr-dst" data-h="d2">🖨️<span>Printer</span></div>
            <div class="demo-node demo-n-device hsr-dst" data-h="d3">📱<span>Phone</span></div>
            <div class="demo-node demo-n-device hsr-dst" data-h="target">💻<span>Target</span></div>
        </div>
        <div class="demo-log" id="hsr-log"></div>
        <button class="demo-btn" id="hsr-btn">▶ Send Frame</button>
    `);

    document.querySelectorAll('input[name="hsr-type"]').forEach(r => {
        r.addEventListener('change', () => {
            const c = document.getElementById('hsr-center');
            if (r.value === 'hub') c.textContent = '📡 Hub';
            else if (r.value === 'switch') c.textContent = '🔀 Switch';
            else c.textContent = '🌐 Router';
        });
    });

    const hsrBtn = document.getElementById('hsr-btn');
    if (hsrBtn) {
        hsrBtn.addEventListener('click', async function () {
            this.disabled = true;
            const type = document.querySelector('input[name="hsr-type"]:checked').value;
            const log = document.getElementById('hsr-log');
            const sim = document.getElementById('hsr-sim');
            const allDst = sim.querySelectorAll('.hsr-dst');
            log.innerHTML = '';
            
            // Reset
            allDst.forEach(d => { d.classList.remove('demo-node-active', 'demo-node-reject', 'demo-node-accept'); });
            sim.querySelector('[data-h="src"]').classList.add('demo-node-active');
            log.innerHTML += `<div class="demo-log-line">📦 Source sends a frame destined for Target</div>`;
            await sleep(600);
            
            sim.querySelector('[data-h="center"]').classList.add('demo-node-active');
            
            if (type === 'hub') {
                log.innerHTML += `<div class="demo-log-line">📡 Hub repeats frame to ALL ports (no intelligence)</div>`;
                await sleep(500);
                allDst.forEach(d => d.classList.add('demo-node-active'));
                log.innerHTML += `<div class="demo-log-line">⚠️ Every device receives the frame — wasteful!</div>`;
                await sleep(600);
                allDst.forEach(d => {
                    if (d.getAttribute('data-h') !== 'target') d.classList.add('demo-node-reject');
                    else d.classList.add('demo-node-accept');
                });
                log.innerHTML += `<div class="demo-log-line">✅ Only Target accepts; others discard</div>`;
            } else if (type === 'switch') {
                log.innerHTML += `<div class="demo-log-line">🔀 Switch checks MAC table → knows Target is on port 4</div>`;
                await sleep(500);
                const target = sim.querySelector('[data-h="target"]');
                target.classList.add('demo-node-active', 'demo-node-accept');
                log.innerHTML += `<div class="demo-log-line">✅ Frame sent ONLY to Target's port — efficient!</div>`;
            } else {
                log.innerHTML += `<div class="demo-log-line">🌐 Router reads destination IP address</div>`;
                await sleep(500);
                log.innerHTML += `<div class="demo-log-line">🌐 Looks up routing table → forwards to correct network</div>`;
                await sleep(500);
                const target = sim.querySelector('[data-h="target"]');
                target.classList.add('demo-node-active', 'demo-node-accept');
                log.innerHTML += `<div class="demo-log-line">✅ Packet routed to Target on the destination network</div>`;
            }
            
            await sleep(1200);
            allDst.forEach(d => { d.classList.remove('demo-node-active', 'demo-node-reject', 'demo-node-accept'); });
            sim.querySelector('[data-h="src"]').classList.remove('demo-node-active');
            sim.querySelector('[data-h="center"]').classList.remove('demo-node-active');
            this.disabled = false;
        });
    }

    /* ── MAC Address ── */
    createDemo('mac', `
        <p class="demo-desc">See how a switch builds its MAC address table. Click a device to send a frame and watch the table grow.</p>
        <div class="demo-mac-layout">
            <div class="demo-mac-devices" id="mac-devices">
                <button class="demo-mac-dev" data-mac="AA:BB:CC:11:22:33" data-port="1">💻 PC-A<br><small>AA:BB:CC:11:22:33</small></button>
                <button class="demo-mac-dev" data-mac="DD:EE:FF:44:55:66" data-port="2">🖥️ PC-B<br><small>DD:EE:FF:44:55:66</small></button>
                <button class="demo-mac-dev" data-mac="11:22:33:AA:BB:CC" data-port="3">🖨️ Printer<br><small>11:22:33:AA:BB:CC</small></button>
            </div>
            <div class="demo-mac-table">
                <h4>🔀 Switch MAC Table</h4>
                <table>
                    <thead><tr><th>MAC Address</th><th>Port</th></tr></thead>
                    <tbody id="mac-table-body"><tr><td colspan="2" class="demo-empty">Table empty — click a device!</td></tr></tbody>
                </table>
            </div>
        </div>
        <button class="demo-btn demo-btn-sm" id="mac-reset">↺ Reset Table</button>
    `);

    const macTable = {};
    document.querySelectorAll('.demo-mac-dev').forEach(btn => {
        btn.addEventListener('click', function () {
            const mac = this.dataset.mac;
            const port = this.dataset.port;
            macTable[mac] = port;
            const tbody = document.getElementById('mac-table-body');
            tbody.innerHTML = '';
            for (const [m, p] of Object.entries(macTable)) {
                tbody.innerHTML += `<tr><td><code>${m}</code></td><td>Port ${p}</td></tr>`;
            }
            this.classList.add('demo-node-accept');
            setTimeout(() => this.classList.remove('demo-node-accept'), 600);
        });
    });
    const macReset = document.getElementById('mac-reset');
    if (macReset) {
        macReset.addEventListener('click', () => {
            for (const k in macTable) delete macTable[k];
            document.getElementById('mac-table-body').innerHTML = '<tr><td colspan="2" class="demo-empty">Table empty — click a device!</td></tr>';
        });
    }

    /* ── IPv4 / IPv6 ── */
    createDemo('ipv4-ipv6', `
        <p class="demo-desc">Analyze an <strong>IPv4</strong> (Internet Protocol version 4) address to see its binary breakdown, or explore <strong>IPv6</strong> (Internet Protocol version 6) format below.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="ip-version" value="v4" checked> IPv4 Analyzer</label>
            <label class="demo-radio"><input type="radio" name="ip-version" value="v6"> IPv6 Explorer</label>
        </div>
        <div id="ipv4-section">
            <div class="demo-ip-input">
                <input type="text" id="ipv4-input" value="192.168.1.24" placeholder="e.g. 192.168.1.24" class="demo-input">
                <button class="demo-btn demo-btn-sm" id="ipv4-parse">Analyze</button>
            </div>
            <div class="demo-ip-result" id="ipv4-result"></div>
        </div>
        <div id="ipv6-section" style="display:none">
            <div class="demo-ip-input">
                <input type="text" id="ipv6-input" value="2001:0db8:85a3:0000:0000:8a2e:0370:7334" placeholder="e.g. 2001:db8::1" class="demo-input" style="min-width:320px">
                <button class="demo-btn demo-btn-sm" id="ipv6-parse">Analyze</button>
            </div>
            <div class="demo-ip-result" id="ipv6-result"></div>
            <div class="demo-proxy-notes" style="margin-top:0.8rem">
                <p><strong>Why IPv6?</strong> IPv4 has only ~4.3 billion addresses (2³² = 4,294,967,296). The world ran out!</p>
                <p><strong>IPv6 gives us</strong> 2¹²⁸ = 340 undecillion addresses — enough for every grain of sand on Earth.</p>
                <p><strong>Format:</strong> 8 groups of 4 hex digits separated by colons. Leading zeros can be omitted. Consecutive zero groups can be replaced with <code>::</code></p>
                <p><strong>Example:</strong> <code>2001:0db8:0000:0000:0000:0000:0000:0001</code> → <code>2001:db8::1</code></p>
            </div>
        </div>
    `);

    // IPv6 section toggle
    document.querySelectorAll('input[name="ip-version"]').forEach(r => {
        r.addEventListener('change', () => {
            document.getElementById('ipv4-section').style.display = r.value === 'v4' ? '' : 'none';
            document.getElementById('ipv6-section').style.display = r.value === 'v6' ? '' : 'none';
        });
    });

    // IPv6 parser
    const ipv6Btn = document.getElementById('ipv6-parse');
    if (ipv6Btn) {
        ipv6Btn.addEventListener('click', () => {
            const val = document.getElementById('ipv6-input').value.trim();
            const res = document.getElementById('ipv6-result');
            // Expand :: notation
            let full = val;
            if (full.includes('::')) {
                const sides = full.split('::');
                const left = sides[0] ? sides[0].split(':') : [];
                const right = sides[1] ? sides[1].split(':') : [];
                const missing = 8 - left.length - right.length;
                const mid = Array(missing).fill('0000');
                full = [...left, ...mid, ...right].join(':');
            }
            const groups = full.split(':');
            if (groups.length !== 8 || groups.some(g => !/^[0-9a-fA-F]{1,4}$/.test(g))) {
                res.innerHTML = '<p class="demo-error">Invalid IPv6 address. Use format like 2001:db8::1</p>';
                return;
            }
            const expanded = groups.map(g => g.padStart(4, '0'));
            const totalBits = expanded.map(g => parseInt(g, 16).toString(2).padStart(16, '0'));

            let scope = '🌍 Global Unicast (internet-routable)';
            const firstGroup = expanded[0].toLowerCase();
            if (firstGroup === '0000' && expanded.slice(1, 7).every(g => g === '0000') && expanded[7] === '0001') scope = '🔄 Loopback (::1)';
            else if (firstGroup.startsWith('fe8')) scope = '🔗 Link-local (fe80::/10)';
            else if (firstGroup.startsWith('fc') || firstGroup.startsWith('fd')) scope = '🔒 Unique Local (fc00::/7 — like private IPv4)';
            else if (firstGroup.startsWith('ff')) scope = '📡 Multicast (ff00::/8)';

            let octetsHtml = '';
            expanded.forEach((g, i) => {
                octetsHtml += '<div class="demo-ip-octet" style="min-width:70px">' +
                    '<span class="demo-octet-dec">' + g + '</span>' +
                    '<span class="demo-octet-bin" style="font-size:0.6rem">' + totalBits[i].slice(0,8) + '<br>' + totalBits[i].slice(8) + '</span>' +
                    '</div>';
                if (i < 7) octetsHtml += '<div class="demo-ip-dot">:</div>';
            });

            res.innerHTML = '<div class="demo-ip-grid" style="flex-wrap:wrap">' + octetsHtml + '</div>' +
                '<p><strong>Full expanded:</strong> <code>' + expanded.join(':') + '</code></p>' +
                '<p><strong>Compressed:</strong> <code>' + val + '</code></p>' +
                '<p><strong>Scope:</strong> ' + scope + '</p>' +
                '<p><strong>Total bits:</strong> 128 (vs IPv4\'s 32 bits — that\'s 2⁹⁶ times more addresses!)</p>';
        });
    }

    const ipv4Btn = document.getElementById('ipv4-parse');
    if (ipv4Btn) {
        ipv4Btn.addEventListener('click', () => {
            const val = document.getElementById('ipv4-input').value.trim();
            const parts = val.split('.');
            const res = document.getElementById('ipv4-result');
            if (parts.length !== 4 || parts.some(p => isNaN(p) || +p < 0 || +p > 255)) {
                res.innerHTML = '<p class="demo-error">Invalid IPv4 address. Use format like 192.168.1.24</p>';
                return;
            }
            const bins = parts.map(p => (+p).toString(2).padStart(8, '0'));
            const first = +parts[0];
            let cls = 'Class A (1.0.0.0 – 126.255.255.255)';
            if (first >= 128 && first <= 191) cls = 'Class B (128.0.0.0 – 191.255.255.255)';
            else if (first >= 192 && first <= 223) cls = 'Class C (192.0.0.0 – 223.255.255.255)';
            else if (first >= 224 && first <= 239) cls = 'Class D — Multicast';
            else if (first >= 240) cls = 'Class E — Reserved';

            let scope = 'Public (internet-routable)';
            if ((first === 10) || (first === 172 && +parts[1] >= 16 && +parts[1] <= 31) || (first === 192 && +parts[1] === 168)) {
                scope = 'Private (RFC 1918)';
            } else if (first === 127) {
                scope = 'Loopback';
            }

            res.innerHTML = `
                <div class="demo-ip-grid">
                    <div class="demo-ip-octet"><span class="demo-octet-dec">${parts[0]}</span><span class="demo-octet-bin">${bins[0]}</span></div>
                    <div class="demo-ip-dot">.</div>
                    <div class="demo-ip-octet"><span class="demo-octet-dec">${parts[1]}</span><span class="demo-octet-bin">${bins[1]}</span></div>
                    <div class="demo-ip-dot">.</div>
                    <div class="demo-ip-octet"><span class="demo-octet-dec">${parts[2]}</span><span class="demo-octet-bin">${bins[2]}</span></div>
                    <div class="demo-ip-dot">.</div>
                    <div class="demo-ip-octet"><span class="demo-octet-dec">${parts[3]}</span><span class="demo-octet-bin">${bins[3]}</span></div>
                </div>
                <p><strong>Class:</strong> ${cls}</p>
                <p><strong>Scope:</strong> ${scope}</p>
                <p><strong>Full binary:</strong> <code>${bins.join('.')}</code></p>
                <p><strong>Total bits:</strong> 32 (2³² = 4,294,967,296 possible addresses — the world has run out!)</p>
            `;
        });
    }

    /* ── Public / Private IP ── */
    createDemo('public-private-ip', `
        <p class="demo-desc">Enter any IP to check if it's public or private. Try these examples:</p>
        <div class="demo-controls">
            <button class="demo-btn demo-btn-xs demo-example-ip" data-ip="8.8.8.8">🌍 8.8.8.8 (Google DNS)</button>
            <button class="demo-btn demo-btn-xs demo-example-ip" data-ip="142.250.190.46">🌍 142.250.190.46 (Google)</button>
            <button class="demo-btn demo-btn-xs demo-example-ip" data-ip="192.168.1.1">🔒 192.168.1.1</button>
            <button class="demo-btn demo-btn-xs demo-example-ip" data-ip="10.0.0.5">🔒 10.0.0.5</button>
            <button class="demo-btn demo-btn-xs demo-example-ip" data-ip="127.0.0.1">🔄 127.0.0.1</button>
        </div>
        <div class="demo-ip-input">
            <input type="text" id="pub-priv-input" value="142.250.190.46" placeholder="e.g. 142.250.190.46" class="demo-input">
            <button class="demo-btn demo-btn-sm" id="pub-priv-btn">Check</button>
        </div>
        <div id="pub-priv-result" class="demo-ip-result"></div>
    `);

    document.querySelectorAll('.demo-example-ip').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('pub-priv-input').value = this.dataset.ip;
            document.getElementById('pub-priv-btn').click();
        });
    });

    const ppBtn = document.getElementById('pub-priv-btn');
    if (ppBtn) {
        ppBtn.addEventListener('click', () => {
            const val = document.getElementById('pub-priv-input').value.trim();
            const parts = val.split('.').map(Number);
            const res = document.getElementById('pub-priv-result');
            if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
                res.innerHTML = '<p class="demo-error">Invalid IPv4 address</p>';
                return;
            }
            const [a, b] = parts;
            let type = '🌍 Public — routable on the internet';
            let cls = 'demo-pub';
            if (a === 10) { type = '🔒 Private — 10.0.0.0/8 range (large enterprises)'; cls = 'demo-priv'; }
            else if (a === 172 && b >= 16 && b <= 31) { type = '🔒 Private — 172.16.0.0/12 range (medium networks)'; cls = 'demo-priv'; }
            else if (a === 192 && b === 168) { type = '🔒 Private — 192.168.0.0/16 range (home/small office)'; cls = 'demo-priv'; }
            else if (a === 127) { type = '🔄 Loopback — reserved for localhost'; cls = 'demo-loop'; }
            else if (a === 169 && b === 254) { type = '⚠️ Link-local — APIPA / no DHCP'; cls = 'demo-link'; }
            res.innerHTML = `<div class="demo-ip-badge ${cls}">${type}</div><p>Address: <code>${val}</code></p>`;
        });
    }

    /* ── Static / Dynamic IP ── */
    createDemo('static-dynamic-ip', `
        <p class="demo-desc">See the difference: static IPs stay fixed, dynamic IPs change with each DHCP lease.</p>
        <div class="demo-static-dyn">
            <div class="demo-sd-col">
                <h4>Static IP (Server)</h4>
                <div class="demo-sd-display" id="static-ip-display">192.168.1.10</div>
                <button class="demo-btn demo-btn-sm" id="static-refresh">Restart Server</button>
            </div>
            <div class="demo-sd-col">
                <h4>Dynamic IP (Laptop)</h4>
                <div class="demo-sd-display" id="dynamic-ip-display">192.168.1.---</div>
                <button class="demo-btn demo-btn-sm" id="dynamic-refresh">Reconnect to Wi-Fi</button>
            </div>
        </div>
        <div class="demo-log" id="sd-log"></div>
    `);

    const staticBtn = document.getElementById('static-refresh');
    const dynBtn = document.getElementById('dynamic-refresh');
    if (staticBtn) {
        staticBtn.addEventListener('click', () => {
            document.getElementById('static-ip-display').textContent = '192.168.1.10';
            const log = document.getElementById('sd-log');
            log.innerHTML += `<div class="demo-log-line">🔧 Server restarted → IP is still <strong>192.168.1.10</strong> (static/reserved)</div>`;
            log.scrollTop = log.scrollHeight;
        });
    }
    if (dynBtn) {
        dynBtn.addEventListener('click', () => {
            const host = Math.floor(Math.random() * 200) + 50;
            document.getElementById('dynamic-ip-display').textContent = `192.168.1.${host}`;
            const log = document.getElementById('sd-log');
            log.innerHTML += `<div class="demo-log-line">📡 Laptop reconnected → DHCP assigned <strong>192.168.1.${host}</strong> (dynamic)</div>`;
            log.scrollTop = log.scrollHeight;
        });
    }

    /* ── Subnet Calculator ── */
    createDemo('subnet', `
        <p class="demo-desc">Enter a CIDR notation to calculate subnet details.</p>
        <div class="demo-ip-input">
            <input type="text" id="subnet-input" value="192.168.10.0/24" placeholder="e.g. 192.168.10.0/24" class="demo-input">
            <button class="demo-btn demo-btn-sm" id="subnet-calc">Calculate</button>
        </div>
        <div id="subnet-result" class="demo-ip-result"></div>
    `);

    const subBtn = document.getElementById('subnet-calc');
    if (subBtn) {
        subBtn.addEventListener('click', () => {
            const val = document.getElementById('subnet-input').value.trim();
            const res = document.getElementById('subnet-result');
            const m = val.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
            if (!m) { res.innerHTML = '<p class="demo-error">Use CIDR format: 192.168.10.0/24</p>'; return; }
            const prefix = parseInt(m[2]);
            if (prefix < 0 || prefix > 32) { res.innerHTML = '<p class="demo-error">Prefix must be 0-32</p>'; return; }
            const totalAddrs = Math.pow(2, 32 - prefix);
            const usable = prefix <= 30 ? totalAddrs - 2 : totalAddrs;
            const maskBin = '1'.repeat(prefix) + '0'.repeat(32 - prefix);
            const mask = [maskBin.slice(0,8), maskBin.slice(8,16), maskBin.slice(16,24), maskBin.slice(24,32)].map(b => parseInt(b, 2)).join('.');
            
            const ipParts = m[1].split('.').map(Number);
            const ipNum = (ipParts[0] << 24 | ipParts[1] << 16 | ipParts[2] << 8 | ipParts[3]) >>> 0;
            const maskNum = (0xFFFFFFFF << (32 - prefix)) >>> 0;
            const netNum = (ipNum & maskNum) >>> 0;
            const bcastNum = (netNum | ~maskNum) >>> 0;
            const network = [(netNum >>> 24) & 0xFF, (netNum >>> 16) & 0xFF, (netNum >>> 8) & 0xFF, netNum & 0xFF].join('.');
            const broadcast = [(bcastNum >>> 24) & 0xFF, (bcastNum >>> 16) & 0xFF, (bcastNum >>> 8) & 0xFF, bcastNum & 0xFF].join('.');

            // Visual mask bar
            const netBits = '█'.repeat(prefix);
            const hostBits = '░'.repeat(32 - prefix);

            res.innerHTML = `
                <div class="demo-subnet-visual">
                    <div class="demo-subnet-bar">
                        <span class="demo-subnet-net" title="Network bits">${netBits}</span><span class="demo-subnet-host" title="Host bits">${hostBits}</span>
                    </div>
                    <div class="demo-subnet-labels"><span>${prefix} network bits</span><span>${32 - prefix} host bits</span></div>
                </div>
                <table>
                    <tr><td><strong>Network</strong></td><td><code>${network}</code></td></tr>
                    <tr><td><strong>Subnet Mask</strong></td><td><code>${mask}</code></td></tr>
                    <tr><td><strong>Broadcast</strong></td><td><code>${broadcast}</code></td></tr>
                    <tr><td><strong>Total Addresses</strong></td><td>${totalAddrs.toLocaleString()}</td></tr>
                    <tr><td><strong>Usable Hosts</strong></td><td>${usable.toLocaleString()}</td></tr>
                </table>
            `;
        });
    }

    /* ── DHCP DORA ── */
    createDemo('dhcp', `
        <p class="demo-desc">Watch the DHCP DORA handshake in action. A new device joins the network and gets configured automatically.</p>
        <div class="demo-dhcp-flow" id="dhcp-sim">
            <div class="demo-dhcp-col">
                <div class="demo-node demo-n-device">💻<span>New Device</span></div>
            </div>
            <div class="demo-dhcp-messages" id="dhcp-msgs"></div>
            <div class="demo-dhcp-col">
                <div class="demo-node demo-n-router">🖧<span>DHCP Server</span></div>
            </div>
        </div>
        <div class="demo-log" id="dhcp-log"></div>
        <button class="demo-btn" id="dhcp-btn">▶ Start DORA</button>
    `);

    const dhcpBtn = document.getElementById('dhcp-btn');
    if (dhcpBtn) {
        dhcpBtn.addEventListener('click', async function () {
            this.disabled = true;
            const msgs = document.getElementById('dhcp-msgs');
            const log = document.getElementById('dhcp-log');
            msgs.innerHTML = '';
            log.innerHTML = '';
            const ip = `192.168.1.${Math.floor(Math.random() * 200) + 20}`;
            const steps = [
                { dir: 'right', label: 'DISCOVER', color: '#f5a65b', msg: `📡 Client broadcasts: "I need an IP address!"` },
                { dir: 'left', label: 'OFFER', color: '#0b7a75', msg: `📋 Server offers: "${ip}" with a 24-hour lease` },
                { dir: 'right', label: 'REQUEST', color: '#f5a65b', msg: `✋ Client requests: "I'll take ${ip} please"` },
                { dir: 'left', label: 'ACK', color: '#0b7a75', msg: `✅ Server confirms: "${ip}" is yours for 24 hours` },
            ];
            for (const s of steps) {
                const arrow = document.createElement('div');
                arrow.className = `demo-dhcp-arrow demo-dhcp-${s.dir}`;
                arrow.innerHTML = `<span style="background:${s.color}">${s.label}</span>`;
                msgs.appendChild(arrow);
                log.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(900);
            }
            log.innerHTML += `<div class="demo-log-line"><strong>🎉 Device is now configured with IP: ${ip}, Gateway: 192.168.1.1, DNS: 8.8.8.8</strong></div>`;
            log.scrollTop = log.scrollHeight;
            this.disabled = false;
        });
    }

    /* ── DNS Resolution ── */
    createDemo('dns', `
        <p class="demo-desc">Type a domain name and watch DNS resolution step by step.</p>
        <div class="demo-ip-input">
            <input type="text" id="dns-input" value="www.example.com" placeholder="e.g. www.example.com" class="demo-input">
            <button class="demo-btn demo-btn-sm" id="dns-btn">▶ Resolve</button>
        </div>
        <div class="demo-network-path" id="dns-sim" style="position:relative">
            <div class="demo-node demo-n-device" data-ds="0">💻<span>Your Browser</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-switch" data-ds="1">📋<span>Local Cache</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-ds="2">🏢<span>Recursive Resolver</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-ds="3">🌍<span>Root Server</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-switch" data-ds="4">🏷️<span>TLD Server</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-ds="5">📖<span>Authoritative</span></div>
            <div class="demo-packet" id="dns-pkt">🔎</div>
        </div>
        <div class="demo-log" id="dns-log"></div>
    `);

    const dnsBtn = document.getElementById('dns-btn');
    if (dnsBtn) {
        dnsBtn.addEventListener('click', async function () {
            this.disabled = true;
            const domain = document.getElementById('dns-input').value.trim() || 'example.com';
            const tld = domain.split('.').pop();
            const ip = `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            const log = document.getElementById('dns-log');
            const sim = document.getElementById('dns-sim');
            const pkt = document.getElementById('dns-pkt');
            log.innerHTML = '';
            sim.querySelectorAll('.demo-node').forEach(s => s.classList.remove('demo-node-active'));

            const steps = [
                { sel: '[data-ds="0"]', msg: `🔎 Browser asks: "What is the IP for ${domain}?"` },
                { sel: '[data-ds="1"]', msg: `📋 Checking local cache... Not found!` },
                { sel: '[data-ds="2"]', msg: `🏢 Asking recursive resolver (e.g. 8.8.8.8)...` },
                { sel: '[data-ds="3"]', msg: `🌍 Root server: "Try the .${tld} TLD server"` },
                { sel: '[data-ds="4"]', msg: `🏷️ .${tld} TLD server: "Authoritative server for ${domain} is ns1.${domain}"` },
                { sel: '[data-ds="5"]', msg: `📖 Authoritative server: "${domain} → ${ip}"` },
            ];
            for (const s of steps) {
                await animatePacket(sim, pkt, [s.sel], 700);
                log.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(200);
            }
            log.innerHTML += `<div class="demo-log-line"><strong>✅ Resolved: ${domain} → ${ip}</strong></div>`;
            log.scrollTop = log.scrollHeight;
            pkt.style.opacity = '0';
            await sleep(1000);
            sim.querySelectorAll('.demo-node').forEach(s => s.classList.remove('demo-node-active'));
            this.disabled = false;
        });
    }


    /* ═══════════════════════════════════════════════════
       2. PROTOCOL DEMOS
       ═══════════════════════════════════════════════════ */

    /* ── TCP / UDP ── */
    createDemo('tcp-udp', `
        <p class="demo-desc">Compare TCP (reliable, ordered) vs UDP (fast, best-effort). Watch packets travel and see what happens when one is lost!</p>
        <div class="demo-tcp-udp-container">
            <div class="demo-proto-lane" id="tcp-lane">
                <h4>TCP — Reliable Delivery</h4>
                <div class="demo-proto-track">
                    <div class="demo-node demo-n-device">💻</div>
                    <div class="demo-proto-packets" id="tcp-packets"></div>
                    <div class="demo-node demo-n-device">🖥️</div>
                </div>
                <div class="demo-log demo-log-sm" id="tcp-log"></div>
            </div>
            <div class="demo-proto-lane" id="udp-lane">
                <h4>UDP — Fast Delivery</h4>
                <div class="demo-proto-track">
                    <div class="demo-node demo-n-device">💻</div>
                    <div class="demo-proto-packets" id="udp-packets"></div>
                    <div class="demo-node demo-n-device">🖥️</div>
                </div>
                <div class="demo-log demo-log-sm" id="udp-log"></div>
            </div>
        </div>
        <button class="demo-btn" id="tcp-udp-btn">▶ Send 5 Packets</button>
    `);

    const tcpUdpBtn = document.getElementById('tcp-udp-btn');
    if (tcpUdpBtn) {
        tcpUdpBtn.addEventListener('click', async function () {
            this.disabled = true;
            const tcpPkts = document.getElementById('tcp-packets');
            const udpPkts = document.getElementById('udp-packets');
            const tcpLog = document.getElementById('tcp-log');
            const udpLog = document.getElementById('udp-log');
            tcpPkts.innerHTML = '';
            udpPkts.innerHTML = '';
            tcpLog.innerHTML = '';
            udpLog.innerHTML = '';

            const lostPkt = Math.floor(Math.random() * 5);

            // TCP
            tcpLog.innerHTML += `<div class="demo-log-line">🤝 SYN → SYN-ACK → ACK (connection established)</div>`;
            await sleep(500);
            for (let i = 0; i < 5; i++) {
                const p = document.createElement('span');
                p.className = 'demo-pkt';
                p.textContent = `#${i + 1}`;
                tcpPkts.appendChild(p);
                await sleep(200);
                if (i === lostPkt) {
                    p.classList.add('demo-pkt-lost');
                    tcpLog.innerHTML += `<div class="demo-log-line">❌ Packet #${i + 1} lost! Waiting for ACK...</div>`;
                    await sleep(600);
                    tcpLog.innerHTML += `<div class="demo-log-line">🔄 Retransmitting packet #${i + 1}...</div>`;
                    await sleep(400);
                    p.classList.remove('demo-pkt-lost');
                    p.classList.add('demo-pkt-ok');
                    tcpLog.innerHTML += `<div class="demo-log-line">✅ Packet #${i + 1} retransmitted and ACK received</div>`;
                } else {
                    p.classList.add('demo-pkt-ok');
                    tcpLog.innerHTML += `<div class="demo-log-line">✅ Packet #${i + 1} delivered, ACK received</div>`;
                }
                tcpLog.scrollTop = tcpLog.scrollHeight;
                await sleep(300);
            }
            tcpLog.innerHTML += `<div class="demo-log-line"><strong>📦 All 5 packets delivered in order!</strong></div>`;

            // UDP
            for (let i = 0; i < 5; i++) {
                const p = document.createElement('span');
                p.className = 'demo-pkt';
                p.textContent = `#${i + 1}`;
                udpPkts.appendChild(p);
                await sleep(120);
                if (i === lostPkt) {
                    p.classList.add('demo-pkt-lost');
                    udpLog.innerHTML += `<div class="demo-log-line">❌ Packet #${i + 1} lost! No retransmission.</div>`;
                } else {
                    p.classList.add('demo-pkt-ok');
                    udpLog.innerHTML += `<div class="demo-log-line">📨 Packet #${i + 1} sent (no ACK)</div>`;
                }
                udpLog.scrollTop = udpLog.scrollHeight;
            }
            udpLog.innerHTML += `<div class="demo-log-line"><strong>⚡ Faster but packet #${lostPkt + 1} is gone forever!</strong></div>`;
            udpLog.scrollTop = udpLog.scrollHeight;
            this.disabled = false;
        });
    }

    /* ── HTTP / HTTPS ── */
    createDemo('http-https', `
        <p class="demo-desc">Build an <strong>HTTP</strong> (HyperText Transfer Protocol) request and see the response. Toggle <strong>HTTPS</strong> (HTTP Secure) to see how encryption protects data.</p>
        <div class="demo-http-builder">
            <div class="demo-controls">
                <select id="http-method" class="demo-select">
                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                </select>
                <input type="text" id="http-url" value="/api/products/42" class="demo-input" placeholder="/path">
                <label class="demo-radio"><input type="checkbox" id="http-secure"> 🔒 HTTPS</label>
            </div>
            <button class="demo-btn demo-btn-sm" id="http-send">▶ Send Request</button>
        </div>
        <div id="http-explain" class="demo-proxy-notes" style="display:none">
            <h4>🔒 What does HTTPS add?</h4>
            <p><strong>TLS (Transport Layer Security)</strong> wraps the HTTP connection in encryption so no one in between can read the data.</p>
            <p><strong>Cipher: TLS_AES_256_GCM_SHA384</strong> means:</p>
            <ul style="margin:0.3rem 0;padding-left:1.2rem">
                <li><strong>TLS</strong> — the encryption protocol</li>
                <li><strong>AES_256</strong> — AES (Advanced Encryption Standard) with a 256-bit key for encrypting data</li>
                <li><strong>GCM</strong> — Galois/Counter Mode, ensures data integrity (no tampering)</li>
                <li><strong>SHA384</strong> — SHA (Secure Hash Algorithm) 384-bit for verifying message authenticity</li>
            </ul>
            <p>Together they ensure: <strong>confidentiality</strong> (can't read), <strong>integrity</strong> (can't modify), and <strong>authentication</strong> (verified server identity).</p>
        </div>
        <div class="demo-http-panels" id="http-panels">
            <div class="demo-http-panel">
                <h4>📤 Request</h4>
                <pre id="http-req-display"></pre>
            </div>
            <div class="demo-http-panel">
                <h4>📥 Response</h4>
                <pre id="http-res-display"></pre>
            </div>
        </div>
    `);

    const httpSend = document.getElementById('http-send');
    if (httpSend) {
        httpSend.addEventListener('click', () => {
            const method = document.getElementById('http-method').value;
            const url = document.getElementById('http-url').value || '/';
            const secure = document.getElementById('http-secure').checked;
            const proto = secure ? 'HTTPS' : 'HTTP';
            const reqDisplay = document.getElementById('http-req-display');
            const resDisplay = document.getElementById('http-res-display');
            const explainBox = document.getElementById('http-explain');

            explainBox.style.display = secure ? '' : 'none';

            let reqText = `${method} ${url} HTTP/1.1\nHost: shop.example.com\nAccept: application/json\nUser-Agent: StudentBrowser/1.0`;
            if (secure) reqText += `\n\n🔒 Connection encrypted via TLS 1.3\n   Cipher Suite: TLS_AES_256_GCM_SHA384\n   Certificate: *.shop.example.com (valid)\n   Key Exchange: X25519 (ECDHE)`;
            if (method === 'POST' || method === 'PUT') reqText += `\nContent-Type: application/json\n\n{"name": "Widget", "price": 9.99}`;

            reqDisplay.textContent = reqText;

            const statuses = {
                'GET': '200 OK',
                'POST': '201 Created',
                'PUT': '200 OK',
                'DELETE': '204 No Content'
            };
            let resText = `HTTP/1.1 ${statuses[method]}\nContent-Type: application/json\nServer: nginx/1.24\nDate: ${new Date().toUTCString()}`;
            if (secure) resText += `\nStrict-Transport-Security: max-age=31536000\n\n🔒 An attacker sniffing the network sees:\n   ██████████████████████████████\n   (encrypted gibberish — not your data!)`;
            if (method !== 'DELETE' && !secure) resText += `\n\n{"id": 42, "name": "Widget", "price": 9.99}\n\n⚠️ Without HTTPS, anyone on the network\n   can read this response in plain text!`;
            if (method !== 'DELETE' && secure) resText += `\n\n{"id": 42, "name": "Widget", "price": 9.99}`;

            resDisplay.textContent = resText;
        });
    }

    /* ── TLS Handshake ── */
    createDemo('tls', `
        <p class="demo-desc">Watch the <strong>TLS</strong> (Transport Layer Security) 1.3 handshake establish a secure, encrypted connection between client and server.</p>
        <div class="demo-proxy-notes">
            <p><strong>Why TLS?</strong> Without it, data travels as readable text. Anyone on the same Wi-Fi, ISP, or network path could read passwords, credit cards, and personal data.</p>
            <p><strong>What TLS does:</strong> 🔐 Encrypts data so only sender/receiver can read it · 🛡️ Verifies the server is who it claims (via certificates) · ✅ Detects if data was tampered with</p>
        </div>
        <div class="demo-dhcp-flow" id="tls-sim">
            <div class="demo-dhcp-col"><div class="demo-node demo-n-device">💻<span>Client<br>(Browser)</span></div></div>
            <div class="demo-dhcp-messages" id="tls-msgs"></div>
            <div class="demo-dhcp-col"><div class="demo-node demo-n-router">🖥️<span>Server<br>(Website)</span></div></div>
        </div>
        <div class="demo-log" id="tls-log"></div>
        <button class="demo-btn" id="tls-btn">▶ Start TLS Handshake</button>
    `);

    const tlsBtn = document.getElementById('tls-btn');
    if (tlsBtn) {
        tlsBtn.addEventListener('click', async function () {
            this.disabled = true;
            const msgs = document.getElementById('tls-msgs');
            const log = document.getElementById('tls-log');
            msgs.innerHTML = '';
            log.innerHTML = '';
            const steps = [
                { dir: 'right', label: 'ClientHello', color: '#f5a65b', msg: '📤 Step 1: Client says "I support TLS 1.3, here are my cipher options and a random number"' },
                { dir: 'left', label: 'ServerHello + Cert', color: '#0b7a75', msg: '📥 Step 2: Server says "Let\'s use TLS_AES_256_GCM_SHA384" and sends its SSL certificate (proof of identity)' },
                { dir: 'right', label: 'Verify + Keys', color: '#f5a65b', msg: '🔑 Step 3: Client verifies certificate against trusted CAs (Certificate Authorities), then both compute shared session keys' },
                { dir: 'left', label: 'Finished ✅', color: '#0b7a75', msg: '✅ Step 4: Server confirms. Both sides now have identical encryption keys. Connection is secure!' },
            ];
            for (const s of steps) {
                const arrow = document.createElement('div');
                arrow.className = `demo-dhcp-arrow demo-dhcp-${s.dir}`;
                arrow.innerHTML = `<span style="background:${s.color}">${s.label}</span>`;
                msgs.appendChild(arrow);
                log.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(1100);
            }
            log.innerHTML += `<div class="demo-log-line"><strong>🔒 Secure channel established! Every byte from now on is encrypted.</strong></div>`;
            log.innerHTML += `<div class="demo-log-line">💡 This entire handshake happens in ~50-100ms — faster than a blink!</div>`;
            log.scrollTop = log.scrollHeight;
            this.disabled = false;
        });
    }

    /* ── FTP ── */
    createDemo('ftp', `
        <p class="demo-desc">See how <strong>FTP</strong> (File Transfer Protocol) transfers files over the network using <strong>two separate TCP connections</strong> — one for commands, one for actual file data.</p>
        <div class="demo-proxy-notes">
            <p><strong>Why two channels?</strong> The control channel (port 21) stays open for commands like login, list files, and delete. The data channel (port 20) opens <em>only when a file is being transferred</em>, then closes. This separation lets you browse directories while a large file uploads.</p>
            <p><strong>Network path:</strong> Your FTP client connects to the server over TCP/IP — the file bytes travel through the same routers and switches as any other network traffic, but on a dedicated data connection.</p>
        </div>
        <div class="demo-ftp-viz" id="ftp-sim">
            <div class="demo-node demo-n-device">💻<span>FTP Client<br>(Your PC)</span></div>
            <div class="demo-ftp-channels">
                <div class="demo-ftp-chan" id="ftp-ctrl">
                    <span class="demo-ftp-label">Port 21 — Control Channel (commands & responses)</span>
                    <div class="demo-ftp-stream" id="ftp-ctrl-stream"></div>
                </div>
                <div class="demo-ftp-chan" id="ftp-data">
                    <span class="demo-ftp-label">Port 20 — Data Channel (file bytes travel here)</span>
                    <div class="demo-ftp-stream" id="ftp-data-stream"></div>
                </div>
            </div>
            <div class="demo-node demo-n-router">🖥️<span>FTP Server<br>(Remote)</span></div>
        </div>
        <div class="demo-log" id="ftp-log"></div>
        <button class="demo-btn" id="ftp-btn">▶ Upload File</button>
    `);

    const ftpBtn = document.getElementById('ftp-btn');
    if (ftpBtn) {
        ftpBtn.addEventListener('click', async function () {
            this.disabled = true;
            const ctrlStream = document.getElementById('ftp-ctrl-stream');
            const dataStream = document.getElementById('ftp-data-stream');
            const log = document.getElementById('ftp-log');
            ctrlStream.innerHTML = '';
            dataStream.innerHTML = '';
            log.innerHTML = '';

            const commands = [
                { chan: 'ctrl', msg: '→ CONNECT :21', log: '🔌 Control: Client opens TCP connection to server port 21' },
                { chan: 'ctrl', msg: '← 220 Welcome', log: '📋 Control: Server says "Ready for login"' },
                { chan: 'ctrl', msg: '→ USER admin', log: '📋 Control: Client sends username' },
                { chan: 'ctrl', msg: '← 331 Password?', log: '📋 Control: Server asks for password' },
                { chan: 'ctrl', msg: '→ PASS ****', log: '🔑 Control: Client sends password (should use SFTP for encryption!)' },
                { chan: 'ctrl', msg: '← 230 Logged in', log: '✅ Control: Authentication successful' },
                { chan: 'ctrl', msg: '→ STOR report.pdf', log: '📋 Control: Client says "I want to upload report.pdf"' },
                { chan: 'ctrl', msg: '← 150 Opening data', log: '🔌 Server opens data channel on port 20' },
                { chan: 'data', msg: '→ [report.pdf bytes] ████ 25%', log: '📦 Data: File bytes flowing through network → routers → server' },
                { chan: 'data', msg: '→ [report.pdf bytes] ████████ 60%', log: '📦 Data: More file data streaming across the TCP data connection...' },
                { chan: 'data', msg: '→ [report.pdf bytes] ████████████ 100%', log: '📦 Data: All bytes received! Data connection closes.' },
                { chan: 'ctrl', msg: '← 226 Transfer OK', log: '✅ Control: Server confirms file saved. Control channel stays open for more commands.' },
            ];

            for (const c of commands) {
                const el = document.createElement('div');
                el.className = 'demo-ftp-msg';
                el.textContent = c.msg;
                (c.chan === 'ctrl' ? ctrlStream : dataStream).appendChild(el);
                log.innerHTML += `<div class="demo-log-line">${c.log}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(700);
            }
            this.disabled = false;
        });
    }

    /* ── SMTP ── */
    createDemo('smtp', `
        <p class="demo-desc">Watch an email travel from sender to recipient through <strong>SMTP</strong> (Simple Mail Transfer Protocol) servers.</p>
        <div class="demo-proxy-notes">
            <p><strong>What is MX?</strong> MX stands for <strong>Mail Exchanger</strong>. It's a special DNS record that tells the internet "mail for this domain should go to this server." Without MX records, the sender's server wouldn't know where to deliver your email!</p>
            <p><strong>Example:</strong> <code>dig college.edu MX</code> → <code>10 mail.college.edu</code> (priority 10, deliver to mail.college.edu)</p>
        </div>
        <div class="demo-network-path" id="smtp-sim" style="position:relative">
            <div class="demo-node demo-n-device" data-sm="0">📧<span>Sender</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-sm="1">📮<span>Sender's<br>SMTP Server</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-switch" data-sm="2">🌐<span>DNS MX<br>Lookup</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" data-sm="3">📬<span>Recipient's<br>SMTP Server</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-device" data-sm="4">📥<span>Inbox</span></div>
            <div class="demo-packet" id="smtp-pkt">📧</div>
        </div>
        <div class="demo-log" id="smtp-log"></div>
        <button class="demo-btn" id="smtp-btn">▶ Send Email</button>
    `);

    const smtpBtn = document.getElementById('smtp-btn');
    if (smtpBtn) {
        smtpBtn.addEventListener('click', async function () {
            this.disabled = true;
            const sim = document.getElementById('smtp-sim');
            const pkt = document.getElementById('smtp-pkt');
            const log = document.getElementById('smtp-log');
            log.innerHTML = '';
            sim.querySelectorAll('.demo-node').forEach(n => n.classList.remove('demo-node-active'));
            const steps = [
                { sel: '[data-sm="0"]', msg: '📧 User clicks Send on "Hello from student@school.edu → teacher@college.edu"' },
                { sel: '[data-sm="1"]', msg: '📮 Email client connects to school.edu SMTP server on port 587 (authenticated submission)' },
                { sel: '[data-sm="2"]', msg: '🌐 DNS MX lookup: "What server handles mail for college.edu?" → Answer: mail.college.edu (priority 10)' },
                { sel: '[data-sm="3"]', msg: '📬 school.edu server connects to mail.college.edu on port 25 and relays the message via SMTP' },
                { sel: '[data-sm="4"]', msg: '📥 mail.college.edu stores the email. Teacher opens inbox via IMAP/POP3 and reads it!' },
            ];
            for (const s of steps) {
                await animatePacket(sim, pkt, [s.sel], 750);
                log.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(200);
            }
            pkt.style.opacity = '0';
            await sleep(400);
            sim.querySelectorAll('.demo-node').forEach(n => n.classList.remove('demo-node-active'));
            this.disabled = false;
        });
    }

    /* ── Telnet / SSH ── */
    createDemo('telnet-ssh', `
        <p class="demo-desc">See why SSH is essential: compare what an attacker sees with Telnet vs SSH.</p>
        <div class="demo-telnet-ssh">
            <div class="demo-tsh-col">
                <h4>⚠️ Telnet (Plain Text)</h4>
                <div class="demo-terminal" id="telnet-terminal">
                    <div>$ login: admin</div>
                    <div>$ password: S3cretP@ss!</div>
                    <div>$ SELECT * FROM users;</div>
                </div>
                <p class="demo-caption">👁️ Attacker can read everything!</p>
            </div>
            <div class="demo-tsh-col">
                <h4>🔒 SSH (Encrypted)</h4>
                <div class="demo-terminal demo-terminal-enc" id="ssh-terminal">
                    <div>a8#kQ!z&@xR2$mP...</div>
                    <div>Yx9!bK&3#qW7*nL...</div>
                    <div>4Fj@8sD#2!wE9rT...</div>
                </div>
                <p class="demo-caption">🔒 Attacker sees only gibberish!</p>
            </div>
        </div>
        <button class="demo-btn" id="ssh-demo-btn">▶ Simulate Connection</button>
    `);

    const sshDemoBtn = document.getElementById('ssh-demo-btn');
    if (sshDemoBtn) {
        sshDemoBtn.addEventListener('click', async function () {
            this.disabled = true;
            const telTerm = document.getElementById('telnet-terminal');
            const sshTerm = document.getElementById('ssh-terminal');
            telTerm.innerHTML = '';
            sshTerm.innerHTML = '';
            
            const cmds = [
                { plain: '$ login: admin', enc: 'a8#kQ!z&@xR2$mP...' },
                { plain: '$ password: S3cretP@ss!', enc: 'Yx9!bK&3#qW7*nL...' },
                { plain: '$ SELECT * FROM users;', enc: '4Fj@8sD#2!wE9rT...' },
                { plain: '→ id=1 name=Alice role=admin', enc: 'pL7&2nR#!kM4$qJ...' },
            ];
            for (const c of cmds) {
                const d1 = document.createElement('div');
                d1.textContent = c.plain;
                d1.className = 'demo-type-in';
                telTerm.appendChild(d1);
                const d2 = document.createElement('div');
                d2.textContent = c.enc;
                d2.className = 'demo-type-in';
                sshTerm.appendChild(d2);
                await sleep(800);
            }
            this.disabled = false;
        });
    }

    /* ── Ports ── */
    createDemo('ports', `
        <p class="demo-desc">A port is like a <strong>door number</strong> on a building (server). The IP address gets you to the building; the port tells you which door (service) to knock on. Click a service to explore:</p>
        <div class="demo-proxy-notes">
            <p><strong>Port ranges:</strong> 0-1023 = Well-Known (system services) · 1024-49151 = Registered (applications) · 49152-65535 = Ephemeral (temporary client ports)</p>
        </div>
        <div class="demo-ports-grid" id="ports-demo">
            <button class="demo-port-btn" data-port="22" data-svc="SSH" data-full="Secure Shell" data-desc="Encrypted remote terminal access to servers. Replaced insecure Telnet." data-proto="TCP" data-use="Server administration, secure file copy (SCP), port forwarding">🔑 SSH</button>
            <button class="demo-port-btn" data-port="53" data-svc="DNS" data-full="Domain Name System" data-desc="Translates domain names (google.com) to IP addresses." data-proto="UDP (queries) / TCP (zone transfers)" data-use="Every website visit starts with a DNS lookup">🌐 DNS</button>
            <button class="demo-port-btn" data-port="80" data-svc="HTTP" data-full="HyperText Transfer Protocol" data-desc="Unencrypted web traffic. Data is readable by anyone on the network." data-proto="TCP" data-use="Legacy websites, redirects to HTTPS">📄 HTTP</button>
            <button class="demo-port-btn" data-port="443" data-svc="HTTPS" data-full="HTTP Secure (HTTP over TLS)" data-desc="Encrypted web traffic. All modern websites use this." data-proto="TCP" data-use="Banking, shopping, APIs, login pages — everything sensitive">🔒 HTTPS</button>
            <button class="demo-port-btn" data-port="25" data-svc="SMTP" data-full="Simple Mail Transfer Protocol" data-desc="Relays email between mail servers." data-proto="TCP" data-use="Server-to-server email delivery">📧 SMTP</button>
            <button class="demo-port-btn" data-port="3306" data-svc="MySQL" data-full="MySQL Database Server" data-desc="Client applications connect to MySQL databases." data-proto="TCP" data-use="Web app backends, WordPress, data storage">🗄️ MySQL</button>
            <button class="demo-port-btn" data-port="1433" data-svc="MSSQL" data-full="Microsoft SQL Server" data-desc="Client connections to SQL Server databases." data-proto="TCP" data-use="Enterprise apps, reporting, ERP systems">🗄️ MSSQL</button>
            <button class="demo-port-btn" data-port="6379" data-svc="Redis" data-full="Remote Dictionary Server" data-desc="Ultra-fast in-memory key-value store for caching." data-proto="TCP" data-use="Session cache, real-time leaderboards, message queues">⚡ Redis</button>
        </div>
        <div class="demo-port-info" id="port-info">
            <p>👆 Click a service above to see how client and server communicate on that port.</p>
        </div>
    `);

    document.querySelectorAll('.demo-port-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.demo-port-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const info = document.getElementById('port-info');
            const clientPort = 40000 + Math.floor(Math.random() * 20000);
            info.innerHTML = `
                <div class="demo-port-detail">
                    <div class="demo-port-num">Port ${this.dataset.port}</div>
                    <div><strong>${this.dataset.svc}</strong> — ${this.dataset.full}</div>
                    <p>${this.dataset.desc}</p>
                    <p><strong>Protocol:</strong> ${this.dataset.proto}</p>
                    <p><strong>Used for:</strong> ${this.dataset.use}</p>
                    <div class="demo-port-flow">
                        <span>💻 Client:${clientPort}</span>
                        <span class="demo-arrow">→</span>
                        <span>🖥️ Server:${this.dataset.port}</span>
                    </div>
                    <p style="font-size:0.78rem;margin-top:0.5rem;color:var(--muted)">💡 The client uses a random <strong>ephemeral port</strong> (${clientPort}), while the server always listens on the <strong>well-known port</strong> (${this.dataset.port}).</p>
                </div>
            `;
        });
    });


    /* ═══════════════════════════════════════════════════
       3. INFRASTRUCTURE DEMOS
       ═══════════════════════════════════════════════════ */

    /* ── Web Server ── */
    createDemo('web-server', `
        <p class="demo-desc">Send different types of requests to see how a web server handles them.</p>
        <div class="demo-ws-buttons">
            <button class="demo-btn demo-btn-sm" data-req="static">📄 Request HTML Page</button>
            <button class="demo-btn demo-btn-sm" data-req="css">🎨 Request CSS File</button>
            <button class="demo-btn demo-btn-sm" data-req="api">⚡ Request API Data</button>
            <button class="demo-btn demo-btn-sm" data-req="404">❓ Request Missing Page</button>
        </div>
        <div class="demo-ws-flow" id="ws-flow"></div>
    `);

    document.querySelectorAll('.demo-ws-buttons button').forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.dataset.req;
            const flow = document.getElementById('ws-flow');
            const responses = {
                static: { status: '200 OK', action: 'Serves static file from disk', file: 'index.html', icon: '📄' },
                css: { status: '200 OK', action: 'Serves static asset with caching headers', file: 'styles.css', icon: '🎨' },
                api: { status: '200 OK', action: 'Proxies to application backend (Node/Python/etc)', file: '/api/data → App Server', icon: '⚡' },
                '404': { status: '404 Not Found', action: 'File not found on server', file: 'missing.html', icon: '❌' },
            };
            const r = responses[type];
            flow.innerHTML = `
                <div class="demo-ws-step">💻 Client</div>
                <div class="demo-ws-arrow">GET /${r.file} →</div>
                <div class="demo-ws-step demo-node-active">🖥️ Nginx</div>
                <div class="demo-ws-arrow">${r.icon} ${r.action} →</div>
                <div class="demo-ws-step">${r.status}</div>
            `;
        });
    });

    /* ── Proxy / Reverse Proxy ── */
    createDemo('proxy-reverse-proxy', `
        <p class="demo-desc">A <strong>proxy</strong> is a middleman between two parties. Toggle to see <strong>who</strong> the proxy represents and <strong>what it does</strong>.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="proxy-type" value="forward" checked> Forward Proxy (client-side)</label>
            <label class="demo-radio"><input type="radio" name="proxy-type" value="reverse"> Reverse Proxy (server-side)</label>
        </div>
        <div class="demo-proxy-viz" id="proxy-viz"></div>
    `);

    function renderProxy(type) {
        const viz = document.getElementById('proxy-viz');
        if (type === 'forward') {
            viz.innerHTML = `
                <div class="demo-proxy-flow">
                    <div class="demo-node demo-n-device">💻<span>Employee<br>192.168.1.50</span></div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-node demo-n-switch demo-node-active">🛡️<span>Forward Proxy<br>10.0.0.1</span></div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-node demo-n-router">🌐<span>Internet<br>(google.com)</span></div>
                </div>
                <div class="demo-proxy-notes">
                    <h4>🛡️ Forward Proxy — acts on behalf of the CLIENT</h4>
                    <p>🔹 <strong>What it does:</strong> Sits between employees and the internet. All outbound requests go through it first.</p>
                    <p>🔹 <strong>Content filtering:</strong> Company blocks social media → proxy rejects requests to facebook.com</p>
                    <p>🔹 <strong>Caching:</strong> 100 employees visit same news site → proxy caches it, serves from memory</p>
                    <p>🔹 <strong>Anonymity:</strong> Google sees the proxy's IP (10.0.0.1), NOT the employee's IP (192.168.1.50)</p>
                    <p>🔹 <strong>Real-world examples:</strong> Squid Proxy, corporate web gateways, VPN services</p>
                </div>
            `;
        } else {
            viz.innerHTML = `
                <div class="demo-proxy-flow">
                    <div class="demo-node demo-n-device">💻<span>User<br>(anywhere)</span></div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-node demo-n-switch demo-node-active">🔀<span>Reverse Proxy<br>shop.com</span></div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-node demo-n-router">🖥️<span>App Server A<br>10.0.1.10</span></div>
                </div>
                <div class="demo-proxy-flow" style="padding-top:0">
                    <div class="demo-node" style="visibility:hidden;min-width:70px">_</div>
                    <div class="demo-arrow" style="visibility:hidden">→</div>
                    <div class="demo-node" style="visibility:hidden;min-width:70px">_</div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-node demo-n-router">🖥️<span>App Server B<br>10.0.1.11</span></div>
                </div>
                <div class="demo-proxy-notes">
                    <h4>🔀 Reverse Proxy — acts on behalf of the SERVER</h4>
                    <p>🔹 <strong>What it does:</strong> Sits in front of backend servers. Users only see "shop.com", never the real servers.</p>
                    <p>🔹 <strong>TLS termination:</strong> Handles HTTPS encryption so backend servers don't have to</p>
                    <p>🔹 <strong>URL routing:</strong> /api → App Server A, /images → Static file server, /admin → Admin server</p>
                    <p>🔹 <strong>Load balancing:</strong> Spreads traffic across multiple backend servers</p>
                    <p>🔹 <strong>Security:</strong> Hides internal server IPs. Attacker can't directly reach 10.0.1.10</p>
                    <p>🔹 <strong>Real-world examples:</strong> Nginx, HAProxy, Cloudflare, AWS ALB (Application Load Balancer)</p>
                </div>
            `;
        }
    }
    renderProxy('forward');
    document.querySelectorAll('input[name="proxy-type"]').forEach(r => {
        r.addEventListener('change', () => renderProxy(r.value));
    });

    /* ── Load Balancer ── */
    createDemo('load-balancer', `
        <p class="demo-desc">Watch requests get distributed across servers. Select an algorithm and send requests to see the difference.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="lb-algo" value="rr" checked> Round Robin</label>
            <label class="demo-radio"><input type="radio" name="lb-algo" value="lc"> Least Connections</label>
            <label class="demo-radio"><input type="radio" name="lb-algo" value="weighted"> Weighted</label>
            <label class="demo-radio"><input type="radio" name="lb-algo" value="random"> Random</label>
        </div>
        <div class="demo-proxy-notes">
            <p id="lb-algo-desc"><strong>Round Robin:</strong> Requests go to each server in turn: A → B → C → A → B → C... Simple and fair.</p>
        </div>
        <div class="demo-lb-layout">
            <div class="demo-lb-left">
                <div class="demo-node demo-n-switch demo-node-active">⚖️<span>Load Balancer</span></div>
                <div class="demo-lb-algo" id="lb-algo-label">Algorithm: <strong>Round Robin</strong></div>
            </div>
            <div class="demo-lb-servers">
                <div class="demo-lb-server" id="lb-s1"><span>🖥️ Server A</span><div class="demo-lb-count" id="lb-c1">0 requests</div><div class="demo-lb-bar"><div class="demo-lb-fill" id="lb-f1"></div></div></div>
                <div class="demo-lb-server" id="lb-s2"><span>🖥️ Server B</span><div class="demo-lb-count" id="lb-c2">0 requests</div><div class="demo-lb-bar"><div class="demo-lb-fill" id="lb-f2"></div></div></div>
                <div class="demo-lb-server" id="lb-s3"><span>🖥️ Server C</span><div class="demo-lb-count" id="lb-c3">0 requests</div><div class="demo-lb-bar"><div class="demo-lb-fill" id="lb-f3"></div></div></div>
            </div>
        </div>
        <div class="demo-log" id="lb-log"></div>
        <div class="demo-controls">
            <button class="demo-btn" id="lb-send">▶ Send Request</button>
            <button class="demo-btn demo-btn-sm" id="lb-burst">⚡ Send 10 Requests</button>
            <button class="demo-btn demo-btn-sm" id="lb-reset">↺ Reset</button>
        </div>
    `);

    let lbCounts = [0, 0, 0];
    let lbNext = 0;
    const lbWeights = [3, 2, 1]; // Server A handles 3x, B 2x, C 1x

    const algoDescs = {
        rr: '<strong>Round Robin:</strong> Requests go to each server in turn: A → B → C → A → B → C... Simple and fair.',
        lc: '<strong>Least Connections:</strong> Each request goes to the server currently handling the fewest active connections. Best when requests take varying time.',
        weighted: '<strong>Weighted:</strong> Server A (weight 3) gets 3x more traffic than Server C (weight 1). Use when servers have different capacities (e.g., A has 16 CPU cores, C has 4).',
        random: '<strong>Random:</strong> Each request goes to a randomly chosen server. Simple but can be uneven with small numbers of requests.'
    };

    document.querySelectorAll('input[name="lb-algo"]').forEach(r => {
        r.addEventListener('change', () => {
            document.getElementById('lb-algo-desc').innerHTML = algoDescs[r.value];
            const labels = { rr: 'Round Robin', lc: 'Least Connections', weighted: 'Weighted', random: 'Random' };
            document.getElementById('lb-algo-label').innerHTML = 'Algorithm: <strong>' + labels[r.value] + '</strong>';
        });
    });

    function lbSendOne() {
        const algo = document.querySelector('input[name="lb-algo"]:checked').value;
        let idx;
        const names = ['A', 'B', 'C'];
        let reason = '';

        if (algo === 'rr') {
            idx = lbNext % 3;
            reason = '(next in rotation)';
        } else if (algo === 'lc') {
            idx = lbCounts.indexOf(Math.min(...lbCounts));
            reason = '(fewest connections: ' + lbCounts[idx] + ')';
        } else if (algo === 'weighted') {
            // Weighted round-robin
            const totalWeight = lbWeights.reduce((a, b) => a + b, 0);
            const pick = lbNext % totalWeight;
            let cum = 0;
            for (let i = 0; i < 3; i++) { cum += lbWeights[i]; if (pick < cum) { idx = i; break; } }
            reason = '(weight: ' + lbWeights[idx] + ')';
        } else {
            idx = Math.floor(Math.random() * 3);
            reason = '(random pick)';
        }

        lbCounts[idx]++;
        lbNext++;
        for (let i = 0; i < 3; i++) {
            document.getElementById(`lb-c${i + 1}`).textContent = `${lbCounts[i]} requests`;
            const max = Math.max(...lbCounts, 1);
            document.getElementById(`lb-f${i + 1}`).style.width = `${(lbCounts[i] / max) * 100}%`;
        }
        const srv = document.getElementById(`lb-s${idx + 1}`);
        srv.classList.add('demo-node-active');
        setTimeout(() => srv.classList.remove('demo-node-active'), 400);
        const log = document.getElementById('lb-log');
        log.innerHTML += `<div class="demo-log-line">→ Request #${lbNext} → Server ${names[idx]} ${reason}</div>`;
        log.scrollTop = log.scrollHeight;
    }

    const lbSendBtn = document.getElementById('lb-send');
    const lbBurstBtn = document.getElementById('lb-burst');
    const lbResetBtn = document.getElementById('lb-reset');
    if (lbSendBtn) lbSendBtn.addEventListener('click', lbSendOne);
    if (lbBurstBtn) {
        lbBurstBtn.addEventListener('click', async function () {
            this.disabled = true;
            for (let i = 0; i < 10; i++) { lbSendOne(); await sleep(200); }
            this.disabled = false;
        });
    }
    if (lbResetBtn) {
        lbResetBtn.addEventListener('click', () => {
            lbCounts = [0, 0, 0];
            lbNext = 0;
            for (let i = 0; i < 3; i++) {
                document.getElementById(`lb-c${i + 1}`).textContent = '0 requests';
                document.getElementById(`lb-f${i + 1}`).style.width = '0%';
            }
            document.getElementById('lb-log').innerHTML = '';
        });
    }

    /* ── Firewall ── */
    createDemo('firewall', `
        <p class="demo-desc">Test traffic against firewall rules. Enter source, destination port, and see if it passes or gets blocked.</p>
        <div class="demo-fw-rules">
            <h4>🛡️ Firewall Rules</h4>
            <table>
                <thead><tr><th>#</th><th>Source</th><th>Port</th><th>Action</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>App Subnet</td><td>1433</td><td class="demo-fw-allow">✅ ALLOW</td></tr>
                    <tr><td>2</td><td>Any</td><td>443</td><td class="demo-fw-allow">✅ ALLOW</td></tr>
                    <tr><td>3</td><td>Any</td><td>80</td><td class="demo-fw-allow">✅ ALLOW</td></tr>
                    <tr><td>4</td><td>Any</td><td>22</td><td class="demo-fw-allow">✅ ALLOW</td></tr>
                    <tr><td>5</td><td>Any</td><td>*</td><td class="demo-fw-deny">🚫 DENY</td></tr>
                </tbody>
            </table>
        </div>
        <div class="demo-fw-test">
            <select id="fw-source" class="demo-select">
                <option value="app">App Subnet (10.0.1.x)</option>
                <option value="internet">Internet (any)</option>
            </select>
            <input type="number" id="fw-port" value="443" class="demo-input demo-input-sm" placeholder="Port">
            <button class="demo-btn demo-btn-sm" id="fw-test-btn">🔍 Test Traffic</button>
        </div>
        <div id="fw-result" class="demo-fw-result"></div>
    `);

    const fwTestBtn = document.getElementById('fw-test-btn');
    if (fwTestBtn) {
        fwTestBtn.addEventListener('click', () => {
            const src = document.getElementById('fw-source').value;
            const port = parseInt(document.getElementById('fw-port').value);
            const res = document.getElementById('fw-result');

            let allowed = false;
            let rule = '';
            if (src === 'app' && port === 1433) { allowed = true; rule = 'Rule 1: App Subnet → Port 1433 ALLOW'; }
            else if ([443, 80, 22].includes(port)) { allowed = true; rule = `Rule: Any → Port ${port} ALLOW`; }
            else { rule = 'Rule 5: Default DENY — no matching allow rule'; }

            res.innerHTML = `
                <div class="demo-fw-verdict ${allowed ? 'demo-fw-pass' : 'demo-fw-block'}">
                    ${allowed ? '✅ ALLOWED' : '🚫 BLOCKED'}
                </div>
                <p><strong>Source:</strong> ${src === 'app' ? 'App Subnet' : 'Internet'} | <strong>Port:</strong> ${port}</p>
                <p><strong>Matched:</strong> ${rule}</p>
            `;
        });
    }

    /* ── NAT ── */
    createDemo('nat', `
        <p class="demo-desc">See how <strong>NAT</strong> (Network Address Translation) translates private addresses to a single public IP.</p>
        <div class="demo-proxy-notes">
            <h4>❓ Why do we need NAT?</h4>
            <p><strong>The problem:</strong> Private IPs (like 192.168.x.x) <em>cannot be routed on the internet</em>. If your PC sends a packet with source IP 192.168.1.10, no server on the internet can send a reply back — it doesn't know how to reach a private address!</p>
            <p><strong>The solution:</strong> Your router performs NAT — it <em>rewrites</em> the source IP from your private address to its single public IP before sending the packet out. When the response comes back, NAT looks up the translation table and forwards it to the correct device.</p>
            <p><strong>Bonus:</strong> NAT also conserves IPv4 addresses — your entire home (PC, phone, TV, IoT) shares just ONE public IP instead of needing one per device.</p>
        </div>
        <p style="font-size:0.88rem;color:var(--muted);margin:0.5rem 0">👇 Click each device to simulate an outbound connection. Watch the translation table grow — each connection gets a unique port mapping!</p>
        <div class="demo-controls" style="margin-bottom:0.5rem"><button class="demo-btn demo-btn-sm" id="nat-reset">↺ Reset Table</button></div>
        <div class="demo-nat-layout">
            <div class="demo-nat-private">
                <h4>🏠 Private Network</h4>
                <button class="demo-nat-dev" data-priv="192.168.1.10">💻 PC: 192.168.1.10</button>
                <button class="demo-nat-dev" data-priv="192.168.1.11">📱 Phone: 192.168.1.11</button>
                <button class="demo-nat-dev" data-priv="192.168.1.12">🖥️ TV: 192.168.1.12</button>
            </div>
            <div class="demo-nat-router">
                <div class="demo-node demo-n-router">🌐<span>NAT Router</span><small>Public: 203.0.113.10</small></div>
            </div>
            <div class="demo-nat-table">
                <h4>NAT Translation Table</h4>
                <table>
                    <thead><tr><th>Private</th><th>→</th><th>Public</th></tr></thead>
                    <tbody id="nat-table-body"><tr><td colspan="3" class="demo-empty">No connections yet</td></tr></tbody>
                </table>
            </div>
        </div>
    `);

    const natEntries = [];
    document.querySelectorAll('.demo-nat-dev').forEach(btn => {
        btn.addEventListener('click', function () {
            const priv = this.dataset.priv;
            const srcPort = 40000 + Math.floor(Math.random() * 20000);
            const pubPort = 30000 + Math.floor(Math.random() * 20000);
            natEntries.push({ priv: `${priv}:${srcPort}`, pub: `203.0.113.10:${pubPort}` });
            const tbody = document.getElementById('nat-table-body');
            tbody.innerHTML = '';
            for (const e of natEntries) {
                tbody.innerHTML += `<tr><td><code>${e.priv}</code></td><td>→</td><td><code>${e.pub}</code></td></tr>`;
            }
            this.classList.add('demo-node-active');
            setTimeout(() => this.classList.remove('demo-node-active'), 500);
        });
    });

    const natResetBtn = document.getElementById('nat-reset');
    if (natResetBtn) {
        natResetBtn.addEventListener('click', () => {
            natEntries.length = 0;
            document.getElementById('nat-table-body').innerHTML = '<tr><td colspan="3" class="demo-empty">No connections yet</td></tr>';
        });
    }


    /* ═══════════════════════════════════════════════════
       4. DATABASE DEMOS
       ═══════════════════════════════════════════════════ */

    /* ── Database Types ── */
    createDemo('database-types', `
        <p class="demo-desc">Click each database type to see example data and when to use it.</p>
        <div class="demo-db-types-grid">
            <button class="demo-dbt-btn" data-dbt="relational">📊 Relational</button>
            <button class="demo-dbt-btn" data-dbt="document">📄 Document</button>
            <button class="demo-dbt-btn" data-dbt="keyvalue">🔑 Key-Value</button>
            <button class="demo-dbt-btn" data-dbt="graph">🕸️ Graph</button>
        </div>
        <div id="dbt-display" class="demo-dbt-display"></div>
    `);

    const dbtData = {
        relational: {
            title: 'Relational (SQL)',
            example: `┌────┬─────────┬──────────────────┐\n│ ID │ Name    │ Email            │\n├────┼─────────┼──────────────────┤\n│ 1  │ Alice   │ alice@mail.com   │\n│ 2  │ Bob     │ bob@mail.com     │\n└────┴─────────┴──────────────────┘`,
            use: 'Structured data with relationships, transactions, reporting. Examples: PostgreSQL, MySQL, SQL Server.'
        },
        document: {
            title: 'Document Store',
            example: `{\n  "_id": "abc123",\n  "name": "Alice",\n  "orders": [\n    {"item": "Widget", "qty": 3},\n    {"item": "Gadget", "qty": 1}\n  ]\n}`,
            use: 'Flexible schema, nested data, evolving objects. Examples: MongoDB, CouchDB.'
        },
        keyvalue: {
            title: 'Key-Value Store',
            example: `SET session:user42 → {"loggedIn": true, "role": "admin"}\nGET session:user42 → {"loggedIn": true, "role": "admin"}`,
            use: 'Ultra-fast lookup by key. Caching, sessions, config. Examples: Redis, DynamoDB.'
        },
        graph: {
            title: 'Graph Database',
            example: `(Alice)-[:FRIENDS_WITH]->(Bob)\n(Bob)-[:WORKS_AT]->(Acme)\n(Alice)-[:BOUGHT]->(Widget)`,
            use: 'Relationship-heavy queries: social networks, fraud detection, recommendations. Examples: Neo4j, Amazon Neptune.'
        }
    };

    document.querySelectorAll('.demo-dbt-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.demo-dbt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const d = dbtData[this.dataset.dbt];
            document.getElementById('dbt-display').innerHTML = `
                <h4>${d.title}</h4>
                <pre>${d.example}</pre>
                <p><strong>Best for:</strong> ${d.use}</p>
            `;
        });
    });

    /* ── SQL vs NoSQL ── */
    createDemo('sql-vs-nosql', `
        <p class="demo-desc">Choose a workload and compare how a relational SQL design and a flexible NoSQL design behave under that pressure.</p>
        <div class="demo-sqlnosql-scenarios">
            <button class="demo-sqlnosql-btn active" data-workload="banking">🏦 Banking</button>
            <button class="demo-sqlnosql-btn" data-workload="reporting">📊 Reporting</button>
            <button class="demo-sqlnosql-btn" data-workload="catalog">🛍️ Product Catalog</button>
            <button class="demo-sqlnosql-btn" data-workload="telemetry">📡 IoT Telemetry</button>
        </div>
        <div class="demo-sqlnosql-layout">
            <section class="demo-sqlnosql-summary" id="sqlnosql-summary"></section>
            <div class="demo-sqlnosql-compare" id="sqlnosql-compare"></div>
        </div>
    `);

    const sqlNoSqlData = {
        banking: {
            title: 'Bank transfer ledger',
            recommendation: 'sql',
            recommendationLabel: 'SQL recommended',
            tagline: 'Strong transactions, strict schema, and accurate balances matter more than schema flexibility.',
            why: [
                'Transfers must commit or roll back as one unit.',
                'Relationships between accounts, customers, and audit rows are explicit.',
                'Reporting and reconciliation queries rely on joins and constraints.'
            ],
            caution: 'A NoSQL model can store the data, but rebuilding ACID guarantees correctly is harder.',
            sql: {
                fit: 'Best fit for correctness-heavy systems',
                metrics: { Schema: 95, Joins: 90, Transactions: 100 },
                notes: [
                    'Foreign keys enforce valid account references.',
                    'Transactions prevent partial money movement.',
                    'SQL reporting works well for audits.'
                ],
                example: [
                    'BEGIN TRANSACTION;',
                    'UPDATE Accounts SET balance = balance - 100 WHERE account_id = 1;',
                    'UPDATE Accounts SET balance = balance + 100 WHERE account_id = 2;',
                    'COMMIT;'
                ].join('\n')
            },
            nosql: {
                fit: 'Possible, but consistency becomes the hard part',
                metrics: { Schema: 45, Joins: 25, Transactions: 45 },
                notes: [
                    'High write scale is possible.',
                    'Embedded documents can simplify simple reads.',
                    'Cross-document consistency needs extra design care.'
                ],
                example: [
                    'db.accounts.updateOne(',
                    '  { _id: 1 },',
                    '  { $inc: { balance: -100 } }',
                    ');',
                    '// Matching debit/credit safety is application-managed'
                ].join('\n')
            }
        },
        reporting: {
            title: 'ERP reporting dashboard',
            recommendation: 'sql',
            recommendationLabel: 'SQL recommended',
            tagline: 'Stable business entities and cross-table analysis favor a relational engine.',
            why: [
                'Finance, orders, inventory, and users relate cleanly through keys.',
                'Aggregations, filters, and joins are first-class SQL operations.',
                'Schema discipline helps keep reports consistent over time.'
            ],
            caution: 'NoSQL can ingest events quickly, but complex ad hoc reporting usually becomes harder.',
            sql: {
                fit: 'Best fit for normalized business data',
                metrics: { Schema: 92, Joins: 96, Transactions: 82 },
                notes: [
                    'Normalized tables reduce duplication.',
                    'GROUP BY and JOIN support rich dashboards.',
                    'Indexes can target frequent report filters.'
                ],
                example: [
                    'SELECT c.region, SUM(o.total_amount) AS revenue',
                    'FROM Orders AS o',
                    'JOIN Customers AS c ON c.customer_id = o.customer_id',
                    'GROUP BY c.region;'
                ].join('\n')
            },
            nosql: {
                fit: 'Useful for precomputed views, weaker for broad ad hoc joins',
                metrics: { Schema: 65, Joins: 20, Transactions: 40 },
                notes: [
                    'Fast denormalized reads are possible.',
                    'Changing report dimensions can require data reshaping.',
                    'Cross-collection joins are limited or expensive.'
                ],
                example: [
                    'db.sales_by_region.aggregate([',
                    '  { $group: { _id: "$region", revenue: { $sum: "$total_amount" } } }',
                    ']);'
                ].join('\n')
            }
        },
        catalog: {
            title: 'E-commerce product catalog',
            recommendation: 'nosql',
            recommendationLabel: 'NoSQL recommended',
            tagline: 'Rapidly changing product attributes favor flexible documents over rigid table design.',
            why: [
                'One product might have sizes, another voltage, another author and ISBN.',
                'Nested JSON-like documents map well to catalog objects.',
                'Horizontal read scale is often more important than strict joins.'
            ],
            caution: 'SQL still works well when product attributes are standardized and reporting dominates.',
            sql: {
                fit: 'Works, but schema changes pile up as attributes expand',
                metrics: { Schema: 58, Joins: 84, Transactions: 78 },
                notes: [
                    'Good when attributes are predictable.',
                    'May require many side tables for variant attributes.',
                    'Reporting remains strong.'
                ],
                example: [
                    'SELECT p.product_id, p.name, a.attribute_name, v.attribute_value',
                    'FROM Products AS p',
                    'JOIN ProductAttributeValues AS v ON v.product_id = p.product_id',
                    'JOIN Attributes AS a ON a.attribute_id = v.attribute_id;'
                ].join('\n')
            },
            nosql: {
                fit: 'Best fit for uneven, evolving item shapes',
                metrics: { Schema: 95, Joins: 35, Transactions: 45 },
                notes: [
                    'Different products can store different fields naturally.',
                    'Single-document reads are efficient for product pages.',
                    'Denormalization simplifies front-end retrieval.'
                ],
                example: [
                    'db.products.findOne({ sku: "BK-1042" })',
                    '// {',
                    '//   name: "Router",',
                    '//   specs: { ports: 8, poe: true, uplinks: ["SFP+"] }',
                    '// }'
                ].join('\n')
            }
        },
        telemetry: {
            title: 'IoT sensor telemetry stream',
            recommendation: 'nosql',
            recommendationLabel: 'NoSQL recommended',
            tagline: 'Massive append-heavy writes and flexible event payloads usually favor non-relational storage.',
            why: [
                'Devices emit time-series events at very high volume.',
                'Payload shape may evolve by firmware or device class.',
                'Scale-out ingestion is often more important than multi-row transactions.'
            ],
            caution: 'SQL remains useful for downstream analytics warehouses and curated reporting layers.',
            sql: {
                fit: 'Good for curated warehouse views, not raw ingest at scale',
                metrics: { Schema: 70, Joins: 82, Transactions: 72 },
                notes: [
                    'Works well after data is cleaned into reporting tables.',
                    'Partitioning helps, but ingest pressure grows fast.',
                    'Structured analytics are excellent later in the pipeline.'
                ],
                example: [
                    'SELECT device_id, AVG(temperature_c) AS avg_temp',
                    'FROM SensorReadings',
                    'WHERE captured_at >= DATEADD(hour, -1, SYSUTCDATETIME())',
                    'GROUP BY device_id;'
                ].join('\n')
            },
            nosql: {
                fit: 'Best fit for high-throughput event ingestion',
                metrics: { Schema: 92, Joins: 18, Transactions: 28 },
                notes: [
                    'Append-friendly writes suit event streams.',
                    'Flexible documents handle versioned payloads.',
                    'Sharding and horizontal scale are common strengths.'
                ],
                example: [
                    'db.telemetry.insertOne({',
                    '  device_id: "sensor-17",',
                    '  captured_at: ISODate(),',
                    '  metrics: { temperature_c: 23.4, battery_pct: 81 }',
                    '});'
                ].join('\n')
            }
        }
    };

    function buildSqlNoSqlCard(name, data, recommended) {
        return `
            <article class="demo-sqlnosql-card${recommended ? ' is-recommended' : ''}">
                <div class="demo-sqlnosql-card-top">
                    <span class="demo-sqlnosql-tag demo-sqlnosql-tag-${name}">${name === 'sql' ? 'SQL' : 'NoSQL'}</span>
                    <p>${data.fit}</p>
                </div>
                <ul class="demo-sqlnosql-notes">${data.notes.map(note => `<li>${note}</li>`).join('')}</ul>
                <pre class="demo-sqlnosql-code"><code>${data.example}</code></pre>
            </article>
        `;
    }

    function renderSqlNoSqlScenario(workload) {
        const data = sqlNoSqlData[workload];
        const summary = document.getElementById('sqlnosql-summary');
        const compare = document.getElementById('sqlnosql-compare');
        if (!data || !summary || !compare) return;

        summary.innerHTML = `
            <div class="demo-sqlnosql-summary-head">
                <p class="demo-sqlnosql-kicker">Scenario</p>
                <span class="demo-sqlnosql-pill demo-sqlnosql-pill-${data.recommendation}">${data.recommendationLabel}</span>
            </div>
            <h4>${data.title}</h4>
            <p>${data.tagline}</p>
            <ul class="demo-sqlnosql-why">${data.why.map(item => `<li>${item}</li>`).join('')}</ul>
            <p class="demo-sqlnosql-caution">${data.caution}</p>
        `;

        compare.innerHTML = [
            buildSqlNoSqlCard('sql', data.sql, data.recommendation === 'sql'),
            buildSqlNoSqlCard('nosql', data.nosql, data.recommendation === 'nosql')
        ].join('');
    }

    document.querySelectorAll('.demo-sqlnosql-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.demo-sqlnosql-btn').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            renderSqlNoSqlScenario(this.dataset.workload);
        });
    });

    renderSqlNoSqlScenario('banking');

    /* ── SQL ── */
    createDemo('sql', `
        <p class="demo-desc">Write SQL queries against sample data and see results instantly.</p>
        <div class="demo-sql-layout">
            <div class="demo-sql-tables">
                <h4>📋 Sample Tables</h4>
                <table class="demo-sql-sample">
                    <caption>Customers</caption>
                    <thead><tr><th>id</th><th>name</th><th>email</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Alice</td><td>alice@mail.com</td></tr>
                        <tr><td>2</td><td>Bob</td><td>bob@mail.com</td></tr>
                        <tr><td>3</td><td>Carol</td><td>carol@mail.com</td></tr>
                    </tbody>
                </table>
                <table class="demo-sql-sample">
                    <caption>Orders</caption>
                    <thead><tr><th>id</th><th>customer_id</th><th>product</th><th>amount</th></tr></thead>
                    <tbody>
                        <tr><td>101</td><td>1</td><td>Widget</td><td>29.99</td></tr>
                        <tr><td>102</td><td>1</td><td>Gadget</td><td>49.99</td></tr>
                        <tr><td>103</td><td>2</td><td>Widget</td><td>29.99</td></tr>
                        <tr><td>104</td><td>3</td><td>Doohickey</td><td>19.99</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="demo-sql-editor">
                <h4>✏️ Write a Query</h4>
                <div class="demo-sql-presets">
                    <button class="demo-btn demo-btn-xs" data-sql="SELECT * FROM Customers;">All Customers</button>
                    <button class="demo-btn demo-btn-xs" data-sql="SELECT * FROM Orders WHERE customer_id = 1;">Alice's Orders</button>
                    <button class="demo-btn demo-btn-xs" data-sql="SELECT c.name, o.product FROM Orders o JOIN Customers c ON c.id = o.customer_id;">Join Query</button>
                    <button class="demo-btn demo-btn-xs" data-sql="SELECT customer_id, COUNT(*) as total FROM Orders GROUP BY customer_id;">Group By</button>
                </div>
                <textarea id="sql-editor" class="demo-textarea" rows="3">SELECT * FROM Customers;</textarea>
                <button class="demo-btn" id="sql-run">▶ Run Query</button>
                <div id="sql-result" class="demo-sql-result"></div>
            </div>
        </div>
    `);

    // Mini SQL engine
    const sampleData = {
        customers: [
            { id: 1, name: 'Alice', email: 'alice@mail.com' },
            { id: 2, name: 'Bob', email: 'bob@mail.com' },
            { id: 3, name: 'Carol', email: 'carol@mail.com' },
        ],
        orders: [
            { id: 101, customer_id: 1, product: 'Widget', amount: 29.99 },
            { id: 102, customer_id: 1, product: 'Gadget', amount: 49.99 },
            { id: 103, customer_id: 2, product: 'Widget', amount: 29.99 },
            { id: 104, customer_id: 3, product: 'Doohickey', amount: 19.99 },
        ]
    };

    document.querySelectorAll('[data-sql]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.getElementById('sql-editor').value = this.dataset.sql;
        });
    });

    const sqlRunBtn = document.getElementById('sql-run');
    if (sqlRunBtn) {
        sqlRunBtn.addEventListener('click', () => {
            const query = document.getElementById('sql-editor').value.trim().toUpperCase();
            const res = document.getElementById('sql-result');
            let rows = [];
            let cols = [];

            try {
                if (query.includes('JOIN')) {
                    cols = ['name', 'product'];
                    rows = sampleData.orders.map(o => {
                        const c = sampleData.customers.find(c => c.id === o.customer_id);
                        return { name: c ? c.name : '?', product: o.product };
                    });
                } else if (query.includes('GROUP BY')) {
                    cols = ['customer_id', 'total'];
                    const groups = {};
                    sampleData.orders.forEach(o => { groups[o.customer_id] = (groups[o.customer_id] || 0) + 1; });
                    rows = Object.entries(groups).map(([k, v]) => ({ customer_id: +k, total: v }));
                } else if (query.includes('ORDERS')) {
                    cols = ['id', 'customer_id', 'product', 'amount'];
                    rows = [...sampleData.orders];
                    if (query.includes('WHERE') && query.includes('CUSTOMER_ID')) {
                        const m = query.match(/CUSTOMER_ID\s*=\s*(\d+)/);
                        if (m) rows = rows.filter(r => r.customer_id === +m[1]);
                    }
                } else if (query.includes('CUSTOMERS')) {
                    cols = ['id', 'name', 'email'];
                    rows = [...sampleData.customers];
                    if (query.includes('WHERE')) {
                        const m = query.match(/ID\s*=\s*(\d+)/);
                        if (m) rows = rows.filter(r => r.id === +m[1]);
                    }
                } else {
                    res.innerHTML = '<p class="demo-error">Try a SELECT query on Customers or Orders table</p>';
                    return;
                }

                let html = `<p class="demo-sql-rows">${rows.length} row(s) returned</p><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
                rows.forEach(r => {
                    html += '<tr>' + cols.map(c => `<td>${r[c]}</td>`).join('') + '</tr>';
                });
                html += '</tbody></table>';
                res.innerHTML = html;
            } catch (e) {
                res.innerHTML = '<p class="demo-error">Could not parse query. Try one of the preset buttons.</p>';
            }
        });
    }

    /* ── Keys ── */
    createDemo('keys', `
        <p class="demo-desc">See how primary and foreign keys link tables. Click a customer to highlight their orders.</p>
        <div class="demo-keys-layout">
            <div class="demo-keys-table">
                <h4>🔑 Customers (PK: id)</h4>
                <table>
                    <thead><tr><th>id (PK)</th><th>name</th></tr></thead>
                    <tbody>
                        <tr class="demo-key-row" data-kid="1"><td><strong>1</strong></td><td>Alice</td></tr>
                        <tr class="demo-key-row" data-kid="2"><td><strong>2</strong></td><td>Bob</td></tr>
                        <tr class="demo-key-row" data-kid="3"><td><strong>3</strong></td><td>Carol</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="demo-keys-link">🔗</div>
            <div class="demo-keys-table">
                <h4>🔗 Orders (FK: customer_id)</h4>
                <table>
                    <thead><tr><th>id</th><th>customer_id (FK)</th><th>product</th></tr></thead>
                    <tbody>
                        <tr class="demo-fk-row" data-fk="1"><td>101</td><td><strong>1</strong></td><td>Widget</td></tr>
                        <tr class="demo-fk-row" data-fk="1"><td>102</td><td><strong>1</strong></td><td>Gadget</td></tr>
                        <tr class="demo-fk-row" data-fk="2"><td>103</td><td><strong>2</strong></td><td>Widget</td></tr>
                        <tr class="demo-fk-row" data-fk="3"><td>104</td><td><strong>3</strong></td><td>Doohickey</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `);

    document.querySelectorAll('.demo-key-row').forEach(row => {
        row.addEventListener('click', function () {
            const kid = this.dataset.kid;
            document.querySelectorAll('.demo-key-row').forEach(r => r.classList.remove('demo-node-active'));
            document.querySelectorAll('.demo-fk-row').forEach(r => r.classList.remove('demo-node-active'));
            this.classList.add('demo-node-active');
            document.querySelectorAll(`.demo-fk-row[data-fk="${kid}"]`).forEach(r => r.classList.add('demo-node-active'));
        });
    });

    /* ── JOIN ── */
    createDemo('join', `
        <p class="demo-desc">Select a JOIN type and see which rows are returned visually.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="join-type" value="inner" checked> INNER JOIN</label>
            <label class="demo-radio"><input type="radio" name="join-type" value="left"> LEFT JOIN</label>
            <label class="demo-radio"><input type="radio" name="join-type" value="right"> RIGHT JOIN</label>
            <label class="demo-radio"><input type="radio" name="join-type" value="full"> FULL JOIN</label>
        </div>
        <div class="demo-join-viz" id="join-viz"></div>
    `);

    const joinCustomers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Carol' },
        { id: 4, name: 'Dave' }, // no orders
    ];
    const joinOrders = [
        { id: 101, customer_id: 1, product: 'Widget' },
        { id: 102, customer_id: 2, product: 'Gadget' },
        { id: 103, customer_id: 5, product: 'Thingamajig' }, // orphan order
    ];

    function renderJoin(type) {
        const viz = document.getElementById('join-viz');
        let rows = [];
        if (type === 'inner') {
            joinCustomers.forEach(c => {
                joinOrders.filter(o => o.customer_id === c.id).forEach(o => {
                    rows.push({ name: c.name, product: o.product, match: true });
                });
            });
        } else if (type === 'left') {
            joinCustomers.forEach(c => {
                const ords = joinOrders.filter(o => o.customer_id === c.id);
                if (ords.length) ords.forEach(o => rows.push({ name: c.name, product: o.product, match: true }));
                else rows.push({ name: c.name, product: 'NULL', match: false });
            });
        } else if (type === 'right') {
            joinOrders.forEach(o => {
                const c = joinCustomers.find(c => c.id === o.customer_id);
                rows.push({ name: c ? c.name : 'NULL', product: o.product, match: !!c });
            });
        } else {
            joinCustomers.forEach(c => {
                const ords = joinOrders.filter(o => o.customer_id === c.id);
                if (ords.length) ords.forEach(o => rows.push({ name: c.name, product: o.product, match: true }));
                else rows.push({ name: c.name, product: 'NULL', match: false });
            });
            joinOrders.filter(o => !joinCustomers.find(c => c.id === o.customer_id)).forEach(o => {
                rows.push({ name: 'NULL', product: o.product, match: false });
            });
        }

        const descriptions = {
            inner: 'Only rows that match in BOTH tables',
            left: 'All rows from Customers + matches from Orders (NULL if no match)',
            right: 'All rows from Orders + matches from Customers (NULL if no match)',
            full: 'All rows from BOTH tables (NULL where no match)'
        };

        let html = `<p class="demo-join-desc">${descriptions[type]}</p>`;
        html += '<table><thead><tr><th>Customer</th><th>Product</th></tr></thead><tbody>';
        rows.forEach(r => {
            const cls = r.match ? '' : 'demo-join-null';
            html += `<tr class="${cls}"><td>${r.name}</td><td>${r.product}</td></tr>`;
        });
        html += '</tbody></table>';
        html += `<p class="demo-sql-rows">${rows.length} row(s)</p>`;
        viz.innerHTML = html;
    }
    renderJoin('inner');
    document.querySelectorAll('input[name="join-type"]').forEach(r => {
        r.addEventListener('change', () => renderJoin(r.value));
    });

    /* ── Index ── */
    createDemo('index', `
        <p class="demo-desc">Compare searching with and without an index. Click to find a record and see the difference.</p>
        <div class="demo-index-layout">
            <div class="demo-index-col">
                <h4>❌ Without Index (Full Table Scan)</h4>
                <div class="demo-index-rows" id="idx-no"></div>
                <div class="demo-index-stats" id="idx-no-stats"></div>
            </div>
            <div class="demo-index-col">
                <h4>✅ With Index (B-Tree Seek)</h4>
                <div class="demo-index-rows" id="idx-yes"></div>
                <div class="demo-index-stats" id="idx-yes-stats"></div>
            </div>
        </div>
        <div class="demo-ip-input">
            <input type="text" id="idx-search" value="carol@mail.com" class="demo-input" placeholder="Search email...">
            <button class="demo-btn demo-btn-sm" id="idx-btn">🔍 Search</button>
        </div>
    `);

    const indexData = [
        'alice@mail.com', 'bob@mail.com', 'carol@mail.com', 'dave@mail.com',
        'eve@mail.com', 'frank@mail.com', 'grace@mail.com', 'henry@mail.com'
    ];

    const idxBtn = document.getElementById('idx-btn');
    if (idxBtn) {
        idxBtn.addEventListener('click', async function () {
            this.disabled = true;
            const search = document.getElementById('idx-search').value.trim().toLowerCase();
            const noIdx = document.getElementById('idx-no');
            const yesIdx = document.getElementById('idx-yes');
            const noStats = document.getElementById('idx-no-stats');
            const yesStats = document.getElementById('idx-yes-stats');

            // No index - scan all
            noIdx.innerHTML = indexData.map(e => `<div class="demo-idx-row" data-email="${e}">${e}</div>`).join('');
            noStats.innerHTML = '';
            let scanned = 0;
            for (const row of noIdx.querySelectorAll('.demo-idx-row')) {
                row.classList.add('demo-idx-scanning');
                scanned++;
                await sleep(250);
                if (row.dataset.email === search) {
                    row.classList.add('demo-idx-found');
                    break;
                }
                row.classList.remove('demo-idx-scanning');
                row.classList.add('demo-idx-checked');
            }
            noStats.innerHTML = `<p>Rows scanned: <strong>${scanned}</strong> of ${indexData.length}</p>`;

            // With index - direct seek
            const sorted = [...indexData].sort();
            yesIdx.innerHTML = sorted.map(e => `<div class="demo-idx-row" data-email="${e}">${e}</div>`).join('');
            yesStats.innerHTML = '';
            await sleep(300);
            // Simulate binary search visualization
            let lo = 0, hi = sorted.length - 1, seeks = 0;
            const allRows = yesIdx.querySelectorAll('.demo-idx-row');
            while (lo <= hi) {
                const mid = Math.floor((lo + hi) / 2);
                seeks++;
                allRows[mid].classList.add('demo-idx-scanning');
                await sleep(350);
                if (sorted[mid] === search) {
                    allRows[mid].classList.add('demo-idx-found');
                    break;
                } else if (sorted[mid] < search) {
                    allRows[mid].classList.remove('demo-idx-scanning');
                    allRows[mid].classList.add('demo-idx-checked');
                    lo = mid + 1;
                } else {
                    allRows[mid].classList.remove('demo-idx-scanning');
                    allRows[mid].classList.add('demo-idx-checked');
                    hi = mid - 1;
                }
            }
            yesStats.innerHTML = `<p>Index seeks: <strong>${seeks}</strong> (B-Tree binary search)</p>`;
            this.disabled = false;
        });
    }

    /* ── Transactions ── */
    createDemo('transactions', `
        <p class="demo-desc">Watch a bank transfer as a transaction. See what happens on COMMIT vs ROLLBACK.</p>
        <div class="demo-tx-accounts">
            <div class="demo-tx-acc">
                <h4>Account A (Alice)</h4>
                <div class="demo-tx-balance" id="tx-a">$1,000</div>
            </div>
            <div class="demo-tx-arrow">💸</div>
            <div class="demo-tx-acc">
                <h4>Account B (Bob)</h4>
                <div class="demo-tx-balance" id="tx-b">$500</div>
            </div>
        </div>
        <div class="demo-controls">
            <label>Transfer amount: <input type="number" id="tx-amount" value="200" class="demo-input demo-input-sm"></label>
        </div>
        <div class="demo-controls">
            <button class="demo-btn" id="tx-commit">▶ Transfer & COMMIT</button>
            <button class="demo-btn demo-btn-sm" id="tx-rollback">↩ Transfer & ROLLBACK</button>
            <button class="demo-btn demo-btn-sm" id="tx-reset">↺ Reset</button>
        </div>
        <div class="demo-log" id="tx-log"></div>
    `);

    let txA = 1000, txB = 500;
    function updateTxDisplay() {
        document.getElementById('tx-a').textContent = `$${txA.toLocaleString()}`;
        document.getElementById('tx-b').textContent = `$${txB.toLocaleString()}`;
    }

    const txCommit = document.getElementById('tx-commit');
    const txRollback = document.getElementById('tx-rollback');
    const txReset = document.getElementById('tx-reset');

    if (txCommit) {
        txCommit.addEventListener('click', async function () {
            this.disabled = true;
            const amt = parseInt(document.getElementById('tx-amount').value) || 0;
            const log = document.getElementById('tx-log');
            log.innerHTML = '';
            log.innerHTML += `<div class="demo-log-line">BEGIN TRANSACTION;</div>`;
            await sleep(500);
            log.innerHTML += `<div class="demo-log-line">UPDATE Accounts SET balance = balance - ${amt} WHERE id = 'A';</div>`;
            txA -= amt;
            updateTxDisplay();
            document.getElementById('tx-a').classList.add('demo-tx-pending');
            await sleep(600);
            log.innerHTML += `<div class="demo-log-line">UPDATE Accounts SET balance = balance + ${amt} WHERE id = 'B';</div>`;
            txB += amt;
            updateTxDisplay();
            document.getElementById('tx-b').classList.add('demo-tx-pending');
            await sleep(600);
            log.innerHTML += `<div class="demo-log-line"><strong>COMMIT; ✅ Both changes saved permanently!</strong></div>`;
            document.getElementById('tx-a').classList.remove('demo-tx-pending');
            document.getElementById('tx-b').classList.remove('demo-tx-pending');
            document.getElementById('tx-a').classList.add('demo-tx-committed');
            document.getElementById('tx-b').classList.add('demo-tx-committed');
            setTimeout(() => {
                document.getElementById('tx-a').classList.remove('demo-tx-committed');
                document.getElementById('tx-b').classList.remove('demo-tx-committed');
            }, 1500);
            log.scrollTop = log.scrollHeight;
            this.disabled = false;
        });
    }

    if (txRollback) {
        txRollback.addEventListener('click', async function () {
            this.disabled = true;
            const amt = parseInt(document.getElementById('tx-amount').value) || 0;
            const log = document.getElementById('tx-log');
            log.innerHTML = '';
            log.innerHTML += `<div class="demo-log-line">BEGIN TRANSACTION;</div>`;
            await sleep(500);
            const origA = txA, origB = txB;
            log.innerHTML += `<div class="demo-log-line">UPDATE Accounts SET balance = balance - ${amt} WHERE id = 'A';</div>`;
            txA -= amt;
            updateTxDisplay();
            document.getElementById('tx-a').classList.add('demo-tx-pending');
            await sleep(600);
            log.innerHTML += `<div class="demo-log-line">UPDATE Accounts SET balance = balance + ${amt} WHERE id = 'B';</div>`;
            txB += amt;
            updateTxDisplay();
            document.getElementById('tx-b').classList.add('demo-tx-pending');
            await sleep(600);
            log.innerHTML += `<div class="demo-log-line"><strong>ROLLBACK; ↩ Error detected — reverting all changes!</strong></div>`;
            await sleep(400);
            txA = origA;
            txB = origB;
            updateTxDisplay();
            document.getElementById('tx-a').classList.remove('demo-tx-pending');
            document.getElementById('tx-b').classList.remove('demo-tx-pending');
            document.getElementById('tx-a').classList.add('demo-tx-rolled-back');
            document.getElementById('tx-b').classList.add('demo-tx-rolled-back');
            setTimeout(() => {
                document.getElementById('tx-a').classList.remove('demo-tx-rolled-back');
                document.getElementById('tx-b').classList.remove('demo-tx-rolled-back');
            }, 1500);
            log.innerHTML += `<div class="demo-log-line">Both accounts restored to original values. No partial change!</div>`;
            log.scrollTop = log.scrollHeight;
            this.disabled = false;
        });
    }

    if (txReset) {
        txReset.addEventListener('click', () => {
            txA = 1000;
            txB = 500;
            updateTxDisplay();
            document.getElementById('tx-log').innerHTML = '';
        });
    }

    /* ═══════════════════════════════════════════════════
       NGINX INTERACTIVE DEMO
       ═══════════════════════════════════════════════════ */

    createDemo('nginx-server', `
        <p class="demo-desc">Click <strong>▶ Send Request</strong> to watch a browser request travel through Nginx step by step. Toggle the URL to see how Nginx decides what to do.</p>

        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="nginx-url" value="static" checked> /static/logo.png (Static File)</label>
            <label class="demo-radio"><input type="radio" name="nginx-url" value="api"> /api/users (Dynamic API)</label>
            <label class="demo-radio"><input type="radio" name="nginx-url" value="redirect"> /old-page (Redirect)</label>
        </div>

        <div class="server-demo-flow" id="nginx-flow">
            <div class="server-demo-step" id="nginx-s1">
                <span class="step-icon">🌐</span>
                <span class="step-label">1. Client connects on port 443 (HTTPS)</span>
                <span class="step-detail">TCP + TLS handshake begins</span>
            </div>
            <div class="server-demo-step" id="nginx-s2">
                <span class="step-icon">🔒</span>
                <span class="step-label">2. Nginx terminates TLS</span>
                <span class="step-detail">Decrypts using ssl_certificate on disk</span>
            </div>
            <div class="server-demo-step" id="nginx-s3">
                <span class="step-icon">📋</span>
                <span class="step-label">3. HTTP request parsed</span>
                <span class="step-detail" id="nginx-url-display">GET /static/logo.png HTTP/1.1</span>
            </div>
            <div class="server-demo-step" id="nginx-s4">
                <span class="step-icon">🗺️</span>
                <span class="step-label">4. Location block matched</span>
                <span class="step-detail" id="nginx-location-display">location /static/ { root /var/www/html; }</span>
            </div>
            <div class="server-demo-step" id="nginx-s5">
                <span class="step-icon" id="nginx-s5-icon">📁</span>
                <span class="step-label" id="nginx-s5-label">5. Static file served directly from disk</span>
                <span class="step-detail" id="nginx-s5-detail">No app server needed — fast!</span>
            </div>
            <div class="server-demo-step" id="nginx-s6">
                <span class="step-icon">📝</span>
                <span class="step-label">6. Access log written</span>
                <span class="step-detail" id="nginx-log-line">127.0.0.1 - GET /static/logo.png 200</span>
            </div>
        </div>

        <div class="demo-log" id="nginx-demo-log"></div>
        <button class="demo-btn" id="nginx-demo-btn">▶ Send Request</button>
    `);

    // Update labels when URL type changes
    document.querySelectorAll('input[name="nginx-url"]').forEach(r => {
        r.addEventListener('change', () => {
            const v = document.querySelector('input[name="nginx-url"]:checked').value;
            const urlMap = {
                static: 'GET /static/logo.png HTTP/1.1',
                api:    'GET /api/users HTTP/1.1',
                redirect: 'GET /old-page HTTP/1.1'
            };
            const locMap = {
                static:   'location /static/ { root /var/www/html; expires 30d; }',
                api:      'location /api/ { proxy_pass http://localhost:3000; }',
                redirect: 'location /old-page { return 301 /new-page; }'
            };
            const s5Map = {
                static:   { icon: '📁', label: '5. Static file served directly from disk', detail: 'No app server needed — extremely fast!' },
                api:      { icon: '🔁', label: '5. Request proxied upstream to Node.js :3000', detail: 'proxy_pass forwards to backend app server' },
                redirect: { icon: '↩️', label: '5. Nginx returns 301 Redirect immediately', detail: 'Client is told to go to /new-page — no backend needed' }
            };
            const logMap = {
                static:   '127.0.0.1 - GET /static/logo.png 200 12843ms',
                api:      '127.0.0.1 - GET /api/users 200 84ms (proxied)',
                redirect: '127.0.0.1 - GET /old-page 301 0ms (redirect)'
            };
            document.getElementById('nginx-url-display').textContent = urlMap[v];
            document.getElementById('nginx-location-display').textContent = locMap[v];
            document.getElementById('nginx-s5-icon').textContent = s5Map[v].icon;
            document.getElementById('nginx-s5-label').textContent = s5Map[v].label;
            document.getElementById('nginx-s5-detail').textContent = s5Map[v].detail;
            document.getElementById('nginx-log-line').textContent = logMap[v];
        });
    });

    const nginxBtn = document.getElementById('nginx-demo-btn');
    if (nginxBtn) {
        nginxBtn.addEventListener('click', async function () {
            this.disabled = true;
            const log = document.getElementById('nginx-demo-log');
            log.innerHTML = '';
            const steps = ['nginx-s1','nginx-s2','nginx-s3','nginx-s4','nginx-s5','nginx-s6'];
            const msgs = [
                '🌐 Browser opens TCP connection → TLS ClientHello sent to Nginx on :443',
                '🔒 Nginx reads ssl_certificate, completes TLS handshake → channel encrypted',
                '📋 Nginx reads HTTP request line + Host header from decrypted stream',
                '🗺️ Nginx evaluates server{} and location{} blocks top-to-bottom — first match wins',
                (() => {
                    const v = document.querySelector('input[name="nginx-url"]:checked').value;
                    if (v === 'static') return '📁 File found on disk → Nginx sends bytes directly, sets Cache-Control header';
                    if (v === 'api')    return '🔁 proxy_pass: Nginx opens connection to localhost:3000 and relays the request';
                    return '↩️ return 301: Nginx writes Location: /new-page header and closes with 301 status';
                })(),
                '📝 Request logged: IP · method · path · status code · response time'
            ];
            for (let i = 0; i < steps.length; i++) {
                const el = document.getElementById(steps[i]);
                el.classList.add('sds-active');
                log.innerHTML += `<div class="demo-log-line">${msgs[i]}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(700);
                el.classList.remove('sds-active');
                el.classList.add('sds-done');
            }
            await sleep(400);
            steps.forEach(id => document.getElementById(id).classList.remove('sds-done'));
            this.disabled = false;
        });
    }

    /* ═══════════════════════════════════════════════════
       APACHE HTTP SERVER INTERACTIVE DEMO
       ═══════════════════════════════════════════════════ */

    createDemo('apache-server', `
        <p class="demo-desc">Choose an <strong>MPM (processing model)</strong> and click a request type to watch Apache route and handle it.</p>

        <div class="demo-controls" style="margin-bottom:0.5rem">
            <strong style="font-size:0.85rem">MPM:</strong>
            <label class="demo-radio"><input type="radio" name="apache-mpm" value="prefork" checked> Prefork (1 process/request)</label>
            <label class="demo-radio"><input type="radio" name="apache-mpm" value="event"> Event (thread pool)</label>
        </div>

        <div class="demo-controls">
            <strong style="font-size:0.85rem">Request:</strong>
            <button class="demo-btn demo-btn-xs" id="apache-php-btn">🐘 PHP Page</button>
            <button class="demo-btn demo-btn-xs" id="apache-static-btn">📄 Static HTML</button>
            <button class="demo-btn demo-btn-xs" id="apache-proxy-btn">🔗 Proxy to Tomcat</button>
        </div>

        <div class="server-demo-flow" id="apache-flow">
            <div class="server-demo-step" id="apache-s1">
                <span class="step-icon">🌐</span>
                <span class="step-label">1. Client connects on port 80 / 443</span>
                <span class="step-detail" id="apache-mpm-label">Prefork MPM assigns a dedicated child process</span>
            </div>
            <div class="server-demo-step" id="apache-s2">
                <span class="step-icon">🔒</span>
                <span class="step-label">2. mod_ssl decrypts (if HTTPS)</span>
                <span class="step-detail">TLS handled by mod_ssl module</span>
            </div>
            <div class="server-demo-step" id="apache-s3">
                <span class="step-icon">📁</span>
                <span class="step-label">3. .htaccess files checked</span>
                <span class="step-detail">Per-directory overrides: rewrites, auth, deny rules</span>
            </div>
            <div class="server-demo-step" id="apache-s4">
                <span class="step-icon">🏠</span>
                <span class="step-label">4. VirtualHost matched by Host header</span>
                <span class="step-detail">DocumentRoot and config determined</span>
            </div>
            <div class="server-demo-step" id="apache-s5">
                <span class="step-icon" id="apache-s5-icon">🐘</span>
                <span class="step-label" id="apache-s5-label">5. mod_php executes PHP in-process</span>
                <span class="step-detail" id="apache-s5-detail">No external process — PHP runs inside Apache worker</span>
            </div>
            <div class="server-demo-step" id="apache-s6">
                <span class="step-icon">📤</span>
                <span class="step-label">6. Response sent; access log written</span>
                <span class="step-detail" id="apache-log-line">example.com - GET /index.php 200 combined</span>
            </div>
        </div>

        <div class="demo-log" id="apache-demo-log"></div>
    `);

    // MPM label update
    document.querySelectorAll('input[name="apache-mpm"]').forEach(r => {
        r.addEventListener('change', () => {
            const v = r.value;
            document.getElementById('apache-mpm-label').textContent =
                v === 'prefork'
                    ? 'Prefork MPM: one dedicated child process per connection'
                    : 'Event MPM: thread pool — keep-alive connections offloaded to a dedicated thread';
        });
    });

    async function runApacheDemo(type) {
        const log = document.getElementById('apache-demo-log');
        log.innerHTML = '';
        const steps = ['apache-s1','apache-s2','apache-s3','apache-s4','apache-s5','apache-s6'];
        const mpm = document.querySelector('input[name="apache-mpm"]:checked').value;

        const configs = {
            php: {
                icon: '🐘', label: '5. mod_php executes PHP in-process',
                detail: 'No external process — PHP runs inside Apache worker',
                log: 'example.com - GET /index.php 200 42ms'
            },
            static: {
                icon: '📄', label: '5. Static handler reads file from DocumentRoot',
                detail: 'default_handler sends bytes directly — very fast',
                log: 'example.com - GET /about.html 200 3ms'
            },
            proxy: {
                icon: '🔗', label: '5. mod_proxy forwards to Tomcat on :8009 (AJP)',
                detail: 'AJP connector passes request to Tomcat servlet container',
                log: 'example.com - GET /app/hello 200 88ms (via AJP)'
            }
        };

        const cfg = configs[type];
        document.getElementById('apache-s5-icon').textContent = cfg.icon;
        document.getElementById('apache-s5-label').textContent = cfg.label;
        document.getElementById('apache-s5-detail').textContent = cfg.detail;
        document.getElementById('apache-log-line').textContent = cfg.log;

        const msgs = [
            `🌐 TCP connection accepted → ${mpm === 'prefork' ? 'child process spawned (Prefork)' : 'thread assigned from pool (Event MPM)'}`,
            '🔒 mod_ssl completes TLS handshake — request decrypted',
            '📁 Apache walks directory tree checking for .htaccess overrides — rewrites applied',
            '🏠 Host header matched to VirtualHost → DocumentRoot = /var/www/example',
            `${cfg.icon} ${cfg.label.slice(3)}`,
            `📤 Response written to socket → ${cfg.log}`
        ];

        for (let i = 0; i < steps.length; i++) {
            const el = document.getElementById(steps[i]);
            el.classList.add('sds-active');
            log.innerHTML += `<div class="demo-log-line">${msgs[i]}</div>`;
            log.scrollTop = log.scrollHeight;
            await sleep(650);
            el.classList.remove('sds-active');
            el.classList.add('sds-done');
        }
        await sleep(400);
        steps.forEach(id => document.getElementById(id).classList.remove('sds-done'));
    }

    ['php','static','proxy'].forEach(type => {
        const btn = document.getElementById(`apache-${type}-btn`);
        if (btn) btn.addEventListener('click', () => runApacheDemo(type));
    });

    /* ═══════════════════════════════════════════════════
       APACHE TOMCAT INTERACTIVE DEMO
       ═══════════════════════════════════════════════════ */

    createDemo('tomcat-server', `
        <p class="demo-desc">Watch a Java web request travel through Tomcat's internal pipeline. Choose a scenario and click <strong>▶ Run Request</strong>.</p>

        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="tomcat-req" value="get" checked> GET /myapp/products</label>
            <label class="demo-radio"><input type="radio" name="tomcat-req" value="post"> POST /myapp/orders</label>
            <label class="demo-radio"><input type="radio" name="tomcat-req" value="jsp"> JSP /myapp/report.jsp</label>
        </div>

        <div class="server-demo-flow" id="tomcat-flow">
            <div class="server-demo-step" id="tc-s1">
                <span class="step-icon">🪶</span>
                <span class="step-label">1. Nginx/Apache forwards to Tomcat Connector</span>
                <span class="step-detail">AJP on :8009 or HTTP proxy on :8080</span>
            </div>
            <div class="server-demo-step" id="tc-s2">
                <span class="step-icon">🔌</span>
                <span class="step-label">2. Coyote Connector reads request</span>
                <span class="step-detail">Builds HttpServletRequest object</span>
            </div>
            <div class="server-demo-step" id="tc-s3">
                <span class="step-icon">🔧</span>
                <span class="step-label">3. Catalina Engine finds Host → Context</span>
                <span class="step-detail" id="tc-context-label">localhost → /myapp → myapp.war</span>
            </div>
            <div class="server-demo-step" id="tc-s4">
                <span class="step-icon">🗺️</span>
                <span class="step-label">4. URL pattern matched to Servlet</span>
                <span class="step-detail" id="tc-servlet-label">@WebServlet("/products") → ProductServlet.class</span>
            </div>
            <div class="server-demo-step" id="tc-s5">
                <span class="step-icon" id="tc-s5-icon">⚙️</span>
                <span class="step-label" id="tc-s5-label">5. doGet() executes business logic</span>
                <span class="step-detail" id="tc-s5-detail">JDBC query to DB → build response</span>
            </div>
            <div class="server-demo-step" id="tc-s6">
                <span class="step-icon">🍪</span>
                <span class="step-label">6. Session managed (if stateful)</span>
                <span class="step-detail">JSESSIONID cookie tracks server-side session</span>
            </div>
            <div class="server-demo-step" id="tc-s7">
                <span class="step-icon">📤</span>
                <span class="step-label">7. HttpServletResponse committed</span>
                <span class="step-detail" id="tc-response-label">JSON response written back to Nginx/Apache</span>
            </div>
        </div>

        <div class="demo-log" id="tc-demo-log"></div>
        <button class="demo-btn" id="tc-demo-btn">▶ Run Request</button>

        <div class="demo-proxy-notes" style="margin-top:1rem">
            <p>💡 <strong>Key insight:</strong> Tomcat does <em>not</em> handle TLS or serve static files efficiently. Always put Nginx or Apache in front for production deployments.</p>
            <p>☕ <strong>WAR deployment:</strong> Drop <code>myapp.war</code> into <code>TOMCAT_HOME/webapps/</code> and Tomcat auto-deploys it. Access at <code>http://host:8080/myapp/</code>.</p>
        </div>
    `);

    document.querySelectorAll('input[name="tomcat-req"]').forEach(r => {
        r.addEventListener('change', () => {
            const v = r.value;
            const ctxMap = { get: 'localhost → /myapp → myapp.war', post: 'localhost → /myapp → myapp.war', jsp: 'localhost → /myapp → report.jsp (compiled → Servlet)' };
            const srvMap = { get: '@WebServlet("/products") → ProductServlet.class', post: '@WebServlet("/orders") → OrderServlet.class', jsp: 'JSP compiled to Servlet by Jasper engine' };
            const s5Map  = { get: { icon:'⚙️', label:'5. doGet() executes business logic', detail:'SELECT * FROM products via JDBC → JSON response' },
                             post: { icon:'📝', label:'5. doPost() processes form data', detail:'Validates input, INSERTs order row, returns 201 Created' },
                             jsp:  { icon:'📜', label:'5. Jasper compiles JSP → Servlet → executes', detail:'HTML template merged with data model → HTML response' } };
            const rspMap = { get: 'JSON array of products → 200 OK', post: '{"orderId":42,"status":"created"} → 201 Created', jsp: 'HTML page rendered → 200 OK' };
            document.getElementById('tc-context-label').textContent = ctxMap[v];
            document.getElementById('tc-servlet-label').textContent = srvMap[v];
            document.getElementById('tc-s5-icon').textContent = s5Map[v].icon;
            document.getElementById('tc-s5-label').textContent = s5Map[v].label;
            document.getElementById('tc-s5-detail').textContent = s5Map[v].detail;
            document.getElementById('tc-response-label').textContent = rspMap[v];
        });
    });

    const tcBtn = document.getElementById('tc-demo-btn');
    if (tcBtn) {
        tcBtn.addEventListener('click', async function () {
            this.disabled = true;
            const log = document.getElementById('tc-demo-log');
            log.innerHTML = '';
            const v = document.querySelector('input[name="tomcat-req"]:checked').value;
            const steps = ['tc-s1','tc-s2','tc-s3','tc-s4','tc-s5','tc-s6','tc-s7'];

            const msgs = {
                get: [
                    '🪶 Nginx proxies GET /myapp/products → Tomcat AJP connector on :8009',
                    '🔌 Coyote reads AJP packet → creates HttpServletRequest (method=GET, uri=/myapp/products)',
                    '🔧 Catalina engine: Host=localhost → Context=/myapp matched to deployed myapp.war',
                    '🗺️ URL pattern /products → ProductServlet.class (from web.xml annotation mapping)',
                    '⚙️ ProductServlet.doGet() runs: conn = dataSource.getConnection(); rs = stmt.executeQuery("SELECT * FROM products")',
                    '🍪 Session check: request.getSession(false) → existing JSESSIONID found, session valid',
                    '📤 response.setContentType("application/json"); writer.write(jsonArray); → 200 OK sent back'
                ],
                post: [
                    '🪶 Nginx proxies POST /myapp/orders with JSON body → Tomcat on :8080',
                    '🔌 Coyote reads HTTP/1.1 packet → creates HttpServletRequest (method=POST, body=JSON)',
                    '🔧 Catalina: Host=localhost → Context=/myapp → OrderServlet.class selected',
                    '🗺️ URL pattern /orders matched → OrderServlet.doPost() will handle',
                    '📝 doPost(): validate JSON → INSERT INTO orders (…) VALUES (…) via PreparedStatement',
                    '🍪 New session created for authenticated user → JSESSIONID cookie set in response',
                    '📤 res.setStatus(201); res.setHeader("Location","/myapp/orders/42"); → 201 Created'
                ],
                jsp: [
                    '🪶 Nginx proxy_pass GET /myapp/report.jsp → Tomcat HTTP connector on :8080',
                    '🔌 Coyote builds HttpServletRequest for JSP file request',
                    '🔧 Catalina finds Context /myapp → locates report.jsp in webapp directory',
                    '🗺️ Jasper engine checks if report.jsp is compiled → first time: compile to report_jsp.class',
                    '📜 report_jsp (Servlet) executes: queries DB, sets pageContext attrs, renders HTML template',
                    '🍪 Session attributes (username, role) injected into page context for personalisation',
                    '📤 Full HTML page written to response → 200 OK → Nginx streams to client browser'
                ]
            };

            for (let i = 0; i < steps.length; i++) {
                const el = document.getElementById(steps[i]);
                el.classList.add('sds-active');
                log.innerHTML += `<div class="demo-log-line">${msgs[v][i]}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(700);
                el.classList.remove('sds-active');
                el.classList.add('sds-done');
            }
            await sleep(400);
            steps.forEach(id => document.getElementById(id).classList.remove('sds-done'));
            this.disabled = false;
        });
    }

    /* ═══════════════════════════════════════════════════
       5. AD DOMAINS & IDENTITY DEMOS
       ═══════════════════════════════════════════════════ */

    /* ── What is a Domain — Domain Join Simulator ── */
    createDemo('what-is-domain', `
        <p class="demo-desc">Simulate what happens when a PC joins a Windows domain vs stays in a workgroup.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="domain-mode" value="workgroup" checked> Workgroup Mode</label>
            <label class="demo-radio"><input type="radio" name="domain-mode" value="domain"> Domain Mode</label>
        </div>
        <div class="demo-domain-flow" id="domain-flow-sim">
            <div class="demo-node demo-n-device" id="df-pc">💻<span>PC</span></div>
            <div class="demo-arrow" id="df-arrow">→</div>
            <div class="demo-node demo-n-router" id="df-auth">🗄️<span>Local SAM</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-device" id="df-resource">📁<span>Resource</span></div>
        </div>
        <div class="demo-log" id="domain-log"></div>
        <button class="demo-btn" id="domain-login-btn">▶ Simulate Login</button>
    `);

    document.querySelectorAll('input[name="domain-mode"]').forEach(r => {
        r.addEventListener('change', () => {
            const authNode = document.getElementById('df-auth');
            if (r.value === 'domain') authNode.innerHTML = '🏢<span>Domain Controller</span>';
            else authNode.innerHTML = '🗄️<span>Local SAM</span>';
            document.getElementById('domain-log').innerHTML = '';
        });
    });

    const domainLoginBtn = document.getElementById('domain-login-btn');
    if (domainLoginBtn) {
        domainLoginBtn.addEventListener('click', async function () {
            this.disabled = true;
            const mode = document.querySelector('input[name="domain-mode"]:checked').value;
            const log = document.getElementById('domain-log');
            log.innerHTML = '';

            if (mode === 'workgroup') {
                const steps = [
                    '💻 User types username: <code>john</code> on PC-01',
                    '🗄️ PC checks its own local SAM database for user "john"',
                    '✅ Found! Login granted — but only on THIS machine',
                    '📁 Tries to access \\\\FILE-SERVER\\Share ...',
                    '❌ Access denied — FILE-SERVER has no account for "john"',
                    '⚠️ Must create a matching local account on every machine!',
                ];
                for (const msg of steps) {
                    log.innerHTML += `<div class="demo-log-line">${msg}</div>`;
                    log.scrollTop = log.scrollHeight;
                    await sleep(700);
                }
            } else {
                const steps = [
                    '💻 User types domain credentials: <code>CORP\\john</code> on PC-01',
                    '🏢 PC contacts Domain Controller at <code>dc01.corp.contoso.com</code>',
                    '🔐 DC validates credentials using Kerberos protocol',
                    '🎫 DC issues a Kerberos TGT (Ticket Granting Ticket) to the user',
                    '📋 GPOs downloaded and applied: desktop settings, drive maps, software',
                    '📁 User accesses \\\\FILE-SERVER\\Share — Kerberos service ticket presented',
                    '✅ Access granted! Same login works on ANY domain-joined machine',
                ];
                for (const msg of steps) {
                    log.innerHTML += `<div class="demo-log-line">${msg}</div>`;
                    log.scrollTop = log.scrollHeight;
                    await sleep(700);
                }
            }
            this.disabled = false;
        });
    }

    /* ── Azure AD vs On-Prem AD comparison ── */
    createDemo('azure-ad-domain', `
        <p class="demo-desc">Click a scenario to see how Azure AD and On-Prem AD handle the authentication differently.</p>
        <div class="demo-controls">
            <button class="demo-btn demo-btn-sm" id="aad-onprem-btn">🏢 On-Prem AD Login</button>
            <button class="demo-btn demo-btn-sm" id="aad-cloud-btn">☁️ Azure AD Login</button>
            <button class="demo-btn demo-btn-sm" id="aad-hybrid-btn">🔄 Hybrid (Synced) Login</button>
        </div>
        <div class="demo-log" id="aad-log"></div>
    `);

    async function runAadScenario(steps, logId) {
        const log = document.getElementById(logId);
        log.innerHTML = '';
        for (const msg of steps) {
            log.innerHTML += `<div class="demo-log-line">${msg}</div>`;
            log.scrollTop = log.scrollHeight;
            await sleep(650);
        }
    }

    const aadOnpremBtn = document.getElementById('aad-onprem-btn');
    if (aadOnpremBtn) {
        aadOnpremBtn.addEventListener('click', () => runAadScenario([
            '💻 User at office PC presses Ctrl+Alt+Del → types CORP\\alice',
            '🔌 PC must reach Domain Controller on LAN (line-of-sight required)',
            '🔐 DC authenticates with <strong>Kerberos</strong> (port 88)',
            '📋 LDAP query (port 389) fetches group memberships and GPOs',
            '🎫 Kerberos TGT issued — valid for 10 hours',
            '✅ Login complete. Protocol: Kerberos. Directory: AD DS. GPO applied.',
        ], 'aad-log'));
    }

    const aadCloudBtn = document.getElementById('aad-cloud-btn');
    if (aadCloudBtn) {
        aadCloudBtn.addEventListener('click', () => runAadScenario([
            '💻 User on remote laptop accesses Microsoft 365 via browser',
            '🌐 Browser redirected to <code>login.microsoftonline.com</code>',
            '🔐 Azure AD validates credentials using <strong>OpenID Connect</strong> over HTTPS',
            '📱 MFA challenge sent — user approves on Authenticator app',
            '🎟️ Azure AD issues JWT <strong>access token</strong> (valid 1 hour) + refresh token',
            '📋 Intune MDM policies applied (no GPO — cloud-native policy)',
            '✅ Login complete. No DC needed. Works from anywhere on the internet.',
        ], 'aad-log'));
    }

    const aadHybridBtn = document.getElementById('aad-hybrid-btn');
    if (aadHybridBtn) {
        aadHybridBtn.addEventListener('click', () => runAadScenario([
            '🔄 <strong>Entra Connect</strong> has already synced users from on-prem AD to Azure AD',
            '💻 User logs into Windows with on-prem domain account (Kerberos on LAN)',
            '🔗 Device is Hybrid Azure AD Joined — registered with both AD and Azure AD',
            '🌐 User opens Outlook (Microsoft 365) → browser redirects to Azure AD',
            '🎫 <strong>Seamless SSO</strong>: on-prem Kerberos ticket exchanged for Azure AD token',
            '✅ No second login required — single sign-on across on-prem and cloud!',
            '📋 On-prem GPOs apply for Windows settings; Intune applies for cloud apps',
        ], 'aad-log'));
    }

    /* ── Workgroup vs Domain ── */
    createDemo('workgroup-vs-domain', `
        <p class="demo-desc">Try adding a user in a <strong>Workgroup</strong> vs a <strong>Domain</strong> environment and see the operational difference.</p>
        <div class="demo-controls">
            <button class="demo-btn demo-btn-sm" id="wg-adduser-btn">👤 Add User (Workgroup)</button>
            <button class="demo-btn demo-btn-sm" id="dom-adduser-btn">👤 Add User (Domain)</button>
        </div>
        <div class="demo-log" id="wgdom-log"></div>
    `);

    const wgAddBtn = document.getElementById('wg-adduser-btn');
    if (wgAddBtn) {
        wgAddBtn.addEventListener('click', async function() {
            const log = document.getElementById('wgdom-log');
            log.innerHTML = '';
            const steps = [
                '⚙️ <strong>WORKGROUP</strong>: IT admin must add "bob" on PC-01',
                '   ✦ Control Panel → User Accounts → Add user on PC-01',
                '   ✦ Must repeat on PC-02, PC-03, FILE-SERVER, PRINTER, ...',
                '📊 10 computers × 1 user = <strong>10 separate operations</strong>',
                '❌ Bob calls IT because he forgot his password on PC-04',
                '   → IT must reset on THAT specific machine only',
                '⚠️ No central audit log. No policy enforcement. Inconsistent settings.',
            ];
            for (const msg of steps) {
                log.innerHTML += `<div class="demo-log-line">${msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(650);
            }
        });
    }

    const domAddBtn = document.getElementById('dom-adduser-btn');
    if (domAddBtn) {
        domAddBtn.addEventListener('click', async function() {
            const log = document.getElementById('wgdom-log');
            log.innerHTML = '';
            const steps = [
                '⚙️ <strong>DOMAIN</strong>: IT admin adds "bob" once in Active Directory',
                '   ✦ <code>New-ADUser -Name "Bob Smith" -SamAccountName "bsmith" -Enabled $true</code>',
                '📊 1 operation in AD → Bob can log into ALL 10 domain-joined machines',
                '📋 GPOs automatically apply: wallpaper, drive maps, software, firewall rules',
                '🔑 Bob forgets password → IT resets in AD: <code>Set-ADAccountPassword -Identity bsmith</code>',
                '   → Works everywhere instantly. No need to touch individual machines.',
                '✅ Central audit log in Event Viewer / SIEM. Full policy enforcement.',
            ];
            for (const msg of steps) {
                log.innerHTML += `<div class="demo-log-line">${msg}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(650);
            }
        });
    }

    /* ── AD Architecture Explorer ── */
    createDemo('ad-architecture', `
        <p class="demo-desc">Click a layer of the AD hierarchy to understand what it does and what objects it contains.</p>
        <div class="demo-ad-tree" id="ad-arch-tree">
            <div class="demo-ad-layer" id="adl-forest" data-layer="forest">🌲 Forest: contoso.com</div>
            <div class="demo-ad-layer" id="adl-tree" data-layer="tree" style="margin-left:1.5rem">🌳 Tree: corp.contoso.com</div>
            <div class="demo-ad-layer" id="adl-domain" data-layer="domain" style="margin-left:3rem">🏢 Domain: corp.contoso.com</div>
            <div class="demo-ad-layer" id="adl-ou" data-layer="ou" style="margin-left:4.5rem">📁 OU: Finance</div>
            <div class="demo-ad-layer" id="adl-user" data-layer="user" style="margin-left:6rem">👤 User: alice</div>
        </div>
        <div class="demo-log" id="ad-arch-log"></div>
    `);

    const adLayerInfo = {
        forest: [
            '🌲 <strong>Forest</strong> — Top-level container. Security boundary.',
            '   Shares: schema (object definitions), global catalog, and configuration partition.',
            '   All domains within this forest trust each other.',
            '   Forest trusts connect separate forests (separate security boundaries).',
            '   FSMO roles: Schema Master, Domain Naming Master (one each per forest).',
        ],
        tree: [
            '🌳 <strong>Tree</strong> — A group of domains with contiguous DNS namespace.',
            '   Example: contoso.com → corp.contoso.com → us.corp.contoso.com',
            '   Parent and child domains have automatic two-way transitive trusts.',
            '   Separate trees (e.g., fabrikam.com) can join the same forest.',
        ],
        domain: [
            '🏢 <strong>Domain</strong> — Core administrative unit. Has its own DC(s).',
            '   Contains: users, computers, groups, OUs, and policies.',
            '   Domain-wide security policies: password policy, account lockout.',
            '   FSMO roles: PDC Emulator, RID Master, Infrastructure Master (per domain).',
            '   Clients must be able to reach a DC to log in.',
        ],
        ou: [
            '📁 <strong>Organizational Unit (OU)</strong> — A container inside a domain.',
            '   Used to organize objects by department, location, or type.',
            '   GPOs are linked to OUs → settings flow down to child OUs.',
            '   Delegation: you can give a help desk admin control over just one OU.',
            '   Example: OU=Finance contains users in the Finance department.',
        ],
        user: [
            '👤 <strong>User Object</strong> — Represents one person\'s account in AD.',
            '   Key attributes: sAMAccountName, UPN (alice@corp.contoso.com), displayName.',
            '   Security principal: has a unique SID used for permissions.',
            '   Member of security groups → inherits resource access.',
            '   Distinguished Name: CN=Alice,OU=Finance,DC=corp,DC=contoso,DC=com',
        ],
    };

    document.querySelectorAll('.demo-ad-layer').forEach(layer => {
        layer.style.cursor = 'pointer';
        layer.style.padding = '6px 12px';
        layer.style.margin = '4px 0';
        layer.style.borderRadius = '6px';
        layer.style.transition = 'background 0.2s';
        layer.addEventListener('click', function() {
            document.querySelectorAll('.demo-ad-layer').forEach(l => l.classList.remove('demo-node-active'));
            this.classList.add('demo-node-active');
            const info = adLayerInfo[this.dataset.layer];
            const log = document.getElementById('ad-arch-log');
            log.innerHTML = info.map(l => `<div class="demo-log-line">${l}</div>`).join('');
        });
    });

    /* ── LDAP Query Builder ── */
    createDemo('ldap-query', `
        <p class="demo-desc">Build and test LDAP filter expressions. Select criteria to construct a query.</p>
        <div class="demo-ldap-builder">
            <div class="demo-controls" style="flex-wrap:wrap;gap:0.4rem">
                <label style="font-size:0.85rem"><strong>Object type:</strong></label>
                <select id="ldap-objtype" class="demo-select">
                    <option value="user">User</option>
                    <option value="computer">Computer</option>
                    <option value="group">Group</option>
                </select>
                <label style="font-size:0.85rem"><strong>Condition:</strong></label>
                <select id="ldap-cond" class="demo-select">
                    <option value="any">Any (no extra filter)</option>
                    <option value="enabled">Enabled accounts only</option>
                    <option value="disabled">Disabled accounts only</option>
                    <option value="name">Name starts with...</option>
                    <option value="dept">Department equals...</option>
                    <option value="locked">Locked-out accounts</option>
                </select>
                <input type="text" id="ldap-extra" placeholder="value (for name/dept)" class="demo-input" style="max-width:160px">
            </div>
            <button class="demo-btn demo-btn-sm" id="ldap-build-btn">⚙️ Build Filter</button>
        </div>
        <div class="demo-log" id="ldap-filter-result" style="min-height:60px;font-family:monospace"></div>
        <div class="demo-log" id="ldap-filter-explain" style="margin-top:0.4rem"></div>
    `);

    const ldapBuildBtn = document.getElementById('ldap-build-btn');
    if (ldapBuildBtn) {
        ldapBuildBtn.addEventListener('click', () => {
            const objType = document.getElementById('ldap-objtype').value;
            const cond = document.getElementById('ldap-cond').value;
            const extra = document.getElementById('ldap-extra').value.trim() || '*';
            const res = document.getElementById('ldap-filter-result');
            const exp = document.getElementById('ldap-filter-explain');

            const objClass = { user: 'user', computer: 'computer', group: 'group' }[objType];
            let filter = `(objectClass=${objClass})`;
            let explain = [`<div class="demo-log-line">🔵 <code>(objectClass=${objClass})</code> — match all ${objType} objects</div>`];

            if (cond === 'enabled') {
                filter = `(&(objectClass=${objClass})(!(userAccountControl:1.2.840.113556.1.4.803:=2)))`;
                explain.push('<div class="demo-log-line">🟢 <code>!(userAccountControl:...=2)</code> — exclude disabled accounts (bit 2 = disabled flag)</div>');
            } else if (cond === 'disabled') {
                filter = `(&(objectClass=${objClass})(userAccountControl:1.2.840.113556.1.4.803:=2))`;
                explain.push('<div class="demo-log-line">🔴 <code>userAccountControl:...=2</code> — match accounts with disabled flag (bit 2) set</div>');
            } else if (cond === 'name') {
                const val = document.getElementById('ldap-extra').value.trim() || 'John';
                filter = `(&(objectClass=${objClass})(cn=${val}*))`;
                explain.push(`<div class="demo-log-line">🔵 <code>(cn=${val}*)</code> — cn (Common Name) starts with "${val}" — the <code>*</code> is a wildcard</div>`);
            } else if (cond === 'dept') {
                const val = document.getElementById('ldap-extra').value.trim() || 'Finance';
                filter = `(&(objectClass=${objClass})(department=${val}))`;
                explain.push(`<div class="demo-log-line">🟡 <code>(department=${val})</code> — exact match on department attribute</div>`);
            } else if (cond === 'locked') {
                filter = `(&(objectClass=${objClass})(lockoutTime>=1))`;
                explain.push('<div class="demo-log-line">🔴 <code>(lockoutTime>=1)</code> — lockoutTime > 0 means account is currently locked out</div>');
            }

            res.innerHTML = `<div class="demo-log-line" style="color:var(--clr-accent,#2563eb);font-weight:600">Filter: ${filter}</div>`;
            exp.innerHTML = '<div class="demo-log-line"><strong>How to read it:</strong></div>' + explain.join('') +
                '<div class="demo-log-line">🔍 <code>&amp;(…)(…)</code> = AND both conditions must match</div>' +
                `<div class="demo-log-line">📌 Full PowerShell: <code>Get-ADObject -LDAPFilter "${filter}" -Properties *</code></div>`;
        });
    }

    /* ── DC Replication Simulator ── */
    createDemo('dc-sync', `
        <p class="demo-desc">Simulate Active Directory replication between Domain Controllers. Watch how a change propagates.</p>
        <div class="demo-dc-grid" id="dc-sim">
            <div class="demo-node" id="dc1" style="background:#e3f2fd;border:2px solid #1976d2;padding:0.6rem 1rem;border-radius:8px">
                🖥️ <strong>DC1</strong><br><small id="dc1-usn">USN: 1000</small><br><small id="dc1-status">✅ Up to date</small>
            </div>
            <div class="demo-node" id="dc2" style="background:#e8f5e9;border:2px solid #388e3c;padding:0.6rem 1rem;border-radius:8px">
                🖥️ <strong>DC2</strong><br><small id="dc2-usn">USN: 1000</small><br><small id="dc2-status">✅ Up to date</small>
            </div>
            <div class="demo-node" id="dc3" style="background:#fff3e0;border:2px solid #f57c00;padding:0.6rem 1rem;border-radius:8px">
                🖥️ <strong>DC3</strong><br><small id="dc3-usn">USN: 1000</small><br><small id="dc3-status">✅ Up to date</small>
            </div>
        </div>
        <div class="demo-controls" style="margin-top:0.8rem">
            <button class="demo-btn demo-btn-sm" id="dc-change-btn">➕ Create User on DC1</button>
            <button class="demo-btn demo-btn-sm" id="dc-replicate-btn">🔄 Run Replication</button>
            <button class="demo-btn demo-btn-sm" id="dc-reset-btn">↺ Reset</button>
        </div>
        <div class="demo-log" id="dc-log"></div>
    `);

    let dcState = { dc1: 1000, dc2: 1000, dc3: 1000, pendingChange: false };

    const dcChangeBtn = document.getElementById('dc-change-btn');
    if (dcChangeBtn) {
        dcChangeBtn.addEventListener('click', function() {
            if (dcState.pendingChange) return;
            dcState.dc1 = 1001;
            dcState.pendingChange = true;
            document.getElementById('dc1-usn').textContent = 'USN: 1001';
            document.getElementById('dc1-status').textContent = '🆕 Change made here';
            document.getElementById('dc2-status').textContent = '⏳ Behind (USN 1000)';
            document.getElementById('dc3-status').textContent = '⏳ Behind (USN 1000)';
            const log = document.getElementById('dc-log');
            log.innerHTML += `<div class="demo-log-line">🆕 New user "charlie" created on DC1 → DC1 USN incremented to <strong>1001</strong></div>`;
            log.innerHTML += `<div class="demo-log-line">📢 DC1 sends change notification to replication partners (within 15 seconds intra-site)</div>`;
            log.scrollTop = log.scrollHeight;
        });
    }

    const dcReplicateBtn = document.getElementById('dc-replicate-btn');
    if (dcReplicateBtn) {
        dcReplicateBtn.addEventListener('click', async function() {
            if (!dcState.pendingChange) {
                const log = document.getElementById('dc-log');
                log.innerHTML += `<div class="demo-log-line">ℹ️ No pending changes to replicate. Create a change first!</div>`;
                return;
            }
            this.disabled = true;
            const log = document.getElementById('dc-log');

            // DC1 → DC2
            document.getElementById('dc2').style.border = '2px solid #1976d2';
            log.innerHTML += `<div class="demo-log-line">🔄 DC1 → DC2: Sending update (1 object, 1 attribute changed)</div>`;
            await sleep(800);
            dcState.dc2 = 1001;
            document.getElementById('dc2-usn').textContent = 'USN: 1001';
            document.getElementById('dc2-status').textContent = '✅ Replicated';
            log.innerHTML += `<div class="demo-log-line">✅ DC2 applied change → "charlie" account now exists on DC2 (USN 1001)</div>`;
            log.scrollTop = log.scrollHeight;
            await sleep(600);

            // DC1 → DC3
            document.getElementById('dc3').style.border = '2px solid #1976d2';
            log.innerHTML += `<div class="demo-log-line">🔄 DC1 → DC3: Sending update (inter-site link — compressed)</div>`;
            await sleep(900);
            dcState.dc3 = 1001;
            document.getElementById('dc3-usn').textContent = 'USN: 1001';
            document.getElementById('dc3-status').textContent = '✅ Replicated';
            log.innerHTML += `<div class="demo-log-line">✅ DC3 applied change → "charlie" account now exists on DC3 (USN 1001)</div>`;
            log.scrollTop = log.scrollHeight;
            await sleep(400);

            document.getElementById('dc1-status').textContent = '✅ Up to date';
            dcState.pendingChange = false;
            log.innerHTML += `<div class="demo-log-line">🎉 All DCs are in sync! Any user can now log in from any site.</div>`;
            log.scrollTop = log.scrollHeight;
            this.disabled = false;
        });
    }

    const dcResetBtn = document.getElementById('dc-reset-btn');
    if (dcResetBtn) {
        dcResetBtn.addEventListener('click', () => {
            dcState = { dc1: 1000, dc2: 1000, dc3: 1000, pendingChange: false };
            ['dc1','dc2','dc3'].forEach(id => {
                document.getElementById(id + '-usn').textContent = 'USN: 1000';
                document.getElementById(id + '-status').textContent = '✅ Up to date';
            });
            document.getElementById('dc2').style.border = '2px solid #388e3c';
            document.getElementById('dc3').style.border = '2px solid #f57c00';
            document.getElementById('dc-log').innerHTML = '';
        });
    }

    /* ── GPO Simulator ── */
    createDemo('gpo', `
        <p class="demo-desc">Simulate GPO processing. Link policies to different levels and watch LSDOU order resolve conflicts.</p>
        <div class="demo-gpo-builder">
            <table style="width:100%;font-size:0.85rem">
                <thead><tr><th>Level</th><th>Policy Name</th><th>Password Min Length</th><th>USB Drives</th></tr></thead>
                <tbody>
                    <tr><td>Local</td><td>Local Policy</td><td><input type="number" id="gpo-local-pwd" value="6" min="0" max="20" class="demo-input demo-input-sm"></td><td><select id="gpo-local-usb" class="demo-select demo-select-sm"><option value="allow">Allow</option><option value="block">Block</option></select></td></tr>
                    <tr><td>Domain</td><td>Corp Security</td><td><input type="number" id="gpo-domain-pwd" value="12" min="0" max="20" class="demo-input demo-input-sm"></td><td><select id="gpo-domain-usb" class="demo-select demo-select-sm"><option value="allow">Allow</option><option value="block" selected>Block</option></select></td></tr>
                    <tr><td>OU: Finance</td><td>Finance Policy</td><td><input type="number" id="gpo-ou-pwd" value="16" min="0" max="20" class="demo-input demo-input-sm"></td><td><select id="gpo-ou-usb" class="demo-select demo-select-sm"><option value="allow">Allow</option><option value="block" selected>Block</option></select></td></tr>
                </tbody>
            </table>
            <button class="demo-btn demo-btn-sm" id="gpo-calc-btn" style="margin-top:0.6rem">⚙️ Calculate Effective Policy (LSDOU)</button>
        </div>
        <div class="demo-log" id="gpo-result-log"></div>
    `);

    const gpoCalcBtn = document.getElementById('gpo-calc-btn');
    if (gpoCalcBtn) {
        gpoCalcBtn.addEventListener('click', async function() {
            const localPwd = parseInt(document.getElementById('gpo-local-pwd').value);
            const domainPwd = parseInt(document.getElementById('gpo-domain-pwd').value);
            const ouPwd = parseInt(document.getElementById('gpo-ou-pwd').value);
            const localUsb = document.getElementById('gpo-local-usb').value;
            const domainUsb = document.getElementById('gpo-domain-usb').value;
            const ouUsb = document.getElementById('gpo-ou-usb').value;

            const log = document.getElementById('gpo-result-log');
            log.innerHTML = '';

            const steps = [
                `1️⃣ <strong>Local Policy</strong> applied first → min password: ${localPwd}, USB: ${localUsb}`,
                `2️⃣ <strong>Site GPO</strong> — none configured in this example`,
                `3️⃣ <strong>Domain GPO</strong> applied → overrides Local: min password: ${domainPwd}, USB: ${domainUsb}`,
                `4️⃣ <strong>OU GPO</strong> applied last (wins!) → min password: ${ouPwd}, USB: ${ouUsb}`,
            ];

            for (const s of steps) {
                log.innerHTML += `<div class="demo-log-line">${s}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(600);
            }

            // Effective result
            const effPwd = ouPwd; // OU wins
            const effUsb = ouUsb;
            log.innerHTML += `<div class="demo-log-line" style="background:#e8f5e9;border-left:3px solid #388e3c;padding:4px 8px;margin-top:4px">
                ✅ <strong>Effective Policy for FinanceOU users:</strong><br>
                &nbsp;&nbsp;• Minimum password length: <strong>${effPwd} characters</strong><br>
                &nbsp;&nbsp;• USB drives: <strong>${effUsb === 'block' ? '🚫 Blocked' : '✅ Allowed'}</strong><br>
                &nbsp;&nbsp;<em>Later-processed GPOs win. OU > Domain > Site > Local.</em>
            </div>`;
            log.scrollTop = log.scrollHeight;
        });
    }

    /* ── Local Security Policy ── */
    createDemo('local-security-policy', `
        <p class="demo-desc">Configure a local password policy and see how it would look as a <code>secedit</code> export or <code>net accounts</code> output.</p>
        <div class="demo-controls" style="flex-wrap:wrap;gap:0.6rem;align-items:center">
            <label style="font-size:0.85rem">Min password length: <input type="number" id="lsp-minpwd" value="12" min="0" max="20" class="demo-input demo-input-sm"></label>
            <label style="font-size:0.85rem">Max password age (days): <input type="number" id="lsp-maxage" value="90" min="0" max="999" class="demo-input demo-input-sm"></label>
            <label style="font-size:0.85rem">Lockout threshold: <input type="number" id="lsp-lockout" value="5" min="0" max="50" class="demo-input demo-input-sm"></label>
            <label style="font-size:0.85rem">Lockout duration (min): <input type="number" id="lsp-lockdur" value="30" min="0" max="9999" class="demo-input demo-input-sm"></label>
        </div>
        <button class="demo-btn demo-btn-sm" id="lsp-gen-btn" style="margin-top:0.6rem">⚙️ Generate Policy Output</button>
        <div class="demo-log" id="lsp-log" style="font-family:monospace;font-size:0.82rem"></div>
    `);

    const lspGenBtn = document.getElementById('lsp-gen-btn');
    if (lspGenBtn) {
        lspGenBtn.addEventListener('click', () => {
            const min = document.getElementById('lsp-minpwd').value;
            const max = document.getElementById('lsp-maxage').value;
            const lock = document.getElementById('lsp-lockout').value;
            const dur = document.getElementById('lsp-lockdur').value;
            const log = document.getElementById('lsp-log');
            log.innerHTML = `
<div class="demo-log-line"><strong>net accounts output:</strong></div>
<div class="demo-log-line">Force user logoff how long after time expires?: Never</div>
<div class="demo-log-line">Minimum password age (days): 1</div>
<div class="demo-log-line">Maximum password age (days): ${max}</div>
<div class="demo-log-line">Minimum password length: ${min}</div>
<div class="demo-log-line">Length of password history maintained: 24</div>
<div class="demo-log-line">Lockout threshold: ${lock}</div>
<div class="demo-log-line">Lockout duration (minutes): ${dur}</div>
<div class="demo-log-line">Lockout observation window (minutes): ${dur}</div>
<div class="demo-log-line">&nbsp;</div>
<div class="demo-log-line"><strong>secedit /export equivalent (security template):</strong></div>
<div class="demo-log-line">[System Access]</div>
<div class="demo-log-line">MinimumPasswordLength = ${min}</div>
<div class="demo-log-line">MaximumPasswordAge = ${max}</div>
<div class="demo-log-line">PasswordComplexity = 1</div>
<div class="demo-log-line">LockoutBadCount = ${lock}</div>
<div class="demo-log-line">LockoutDuration = ${dur}</div>
<div class="demo-log-line">ResetLockoutCount = ${dur}</div>`;
        });
    }

    /* ── Local SAM Explorer ── */
    createDemo('local-sam', `
        <p class="demo-desc">Explore the Windows Local Security Account Manager (<abbr title="Security Account Manager">SAM</abbr>). Create local users, add them to groups, and inspect what the SAM stores.</p>
        <div class="demo-controls" style="flex-wrap:wrap;gap:0.6rem;align-items:flex-end">
            <label style="font-size:0.85rem">Username:<br><input type="text" id="sam-username" value="jsmith" class="demo-input demo-input-sm" maxlength="20"></label>
            <label style="font-size:0.85rem">Full Name:<br><input type="text" id="sam-fullname" value="John Smith" class="demo-input demo-input-sm" maxlength="30"></label>
            <label style="font-size:0.85rem">Password:<br><input type="password" id="sam-password" value="P@ssw0rd123" class="demo-input demo-input-sm" maxlength="30"></label>
            <label style="font-size:0.85rem">Group:<br>
                <select id="sam-group" class="demo-input demo-input-sm">
                    <option value="Users">Users</option>
                    <option value="Administrators">Administrators</option>
                    <option value="Remote Desktop Users">Remote Desktop Users</option>
                    <option value="Backup Operators">Backup Operators</option>
                </select>
            </label>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.6rem">
            <button class="demo-btn demo-btn-sm" id="sam-create-btn">➕ New-LocalUser</button>
            <button class="demo-btn demo-btn-sm" id="sam-add-group-btn">👥 Add-LocalGroupMember</button>
            <button class="demo-btn demo-btn-sm" id="sam-query-btn">🔍 Query SAM</button>
            <button class="demo-btn demo-btn-sm" id="sam-clear-btn" style="background:#555">🗑️ Clear</button>
        </div>
        <div class="demo-log" id="sam-log" style="font-family:monospace;font-size:0.82rem;margin-top:0.5rem"></div>
    `);

    (() => {
        // Internal SAM "database" for this demo session
        const samDB = {
            users: [
                { name: 'Administrator', fullName: 'Built-in Administrator', sid: 'S-1-5-21-XXXX-500', enabled: false, groups: ['Administrators'] },
                { name: 'Guest',         fullName: 'Built-in Guest',         sid: 'S-1-5-21-XXXX-501', enabled: false, groups: ['Guests'] },
            ],
            nextRid: 1001
        };

        function genSid(rid) {
            return `S-1-5-21-3842939862-1821680627-2073250560-${rid}`;
        }

        function ntlmPlaceholder(pwd) {
            // Show a fake hash illustrating the concept — not a real NTLM hash
            let h = 0;
            for (let i = 0; i < pwd.length; i++) h = (Math.imul(31, h) + pwd.charCodeAt(i)) | 0;
            const hex = Math.abs(h).toString(16).padStart(8, '0');
            return (hex + hex + hex + hex).substring(0, 32).toUpperCase();
        }

        function log(msg) {
            const el = document.getElementById('sam-log');
            if (!el) return;
            el.innerHTML += `<div class="demo-log-line">${msg}</div>`;
            el.scrollTop = el.scrollHeight;
        }

        function getInputs() {
            return {
                username: (document.getElementById('sam-username')?.value || '').trim(),
                fullName: (document.getElementById('sam-fullname')?.value || '').trim(),
                password: (document.getElementById('sam-password')?.value || '').trim(),
                group:    (document.getElementById('sam-group')?.value || 'Users'),
            };
        }

        const createBtn   = document.getElementById('sam-create-btn');
        const addGroupBtn = document.getElementById('sam-add-group-btn');
        const queryBtn    = document.getElementById('sam-query-btn');
        const clearBtn    = document.getElementById('sam-clear-btn');

        if (createBtn) {
            createBtn.addEventListener('click', () => {
                const { username, fullName, password } = getInputs();
                if (!username) { log('<span style="color:#f87">⚠ Username cannot be empty.</span>'); return; }
                if (samDB.users.find(u => u.name.toLowerCase() === username.toLowerCase())) {
                    log(`<span style="color:#f87">⚠ A local account named <strong>${username}</strong> already exists.</span>`); return;
                }
                if (password.length < 6) { log('<span style="color:#f87">⚠ Password must be at least 6 characters.</span>'); return; }

                const sid = genSid(samDB.nextRid++);
                const hash = ntlmPlaceholder(password);
                samDB.users.push({ name: username, fullName, sid, enabled: true, groups: ['Users'] });

                log(`<span style="color:#7ec8e3">PS C:\\&gt;</span> New-LocalUser -Name "${username}" -FullName "${fullName}" -Password (ConvertTo-SecureString "${password}" -AsPlainText -Force)`);
                log(`&nbsp;`);
                log(`Name         : ${username}`);
                log(`FullName     : ${fullName}`);
                log(`SID          : ${sid}`);
                log(`Enabled      : True`);
                log(`PasswordHash : <span style="color:#ffd54f">${hash}</span> <em style="color:#aaa">(NTLM — stored in SAM hive)</em>`);
                log(`&nbsp;`);
                log(`<span style="color:#a5d6a7">✅ User created and added to default group: Users</span>`);
                log(`<span style="color:#aaa">── Registry path: HKLM\\SAM\\SAM\\Domains\\Account\\Users\\${sid.split('-').pop().padStart(8,'0')}</span>`);
                log(`&nbsp;`);
            });
        }

        if (addGroupBtn) {
            addGroupBtn.addEventListener('click', () => {
                const { username, group } = getInputs();
                if (!username) { log('<span style="color:#f87">⚠ Username cannot be empty.</span>'); return; }
                const user = samDB.users.find(u => u.name.toLowerCase() === username.toLowerCase());
                if (!user) { log(`<span style="color:#f87">⚠ User <strong>${username}</strong> not found in SAM. Create the user first.</span>`); return; }
                if (user.groups.includes(group)) {
                    log(`<span style="color:#ffd54f">⚠ ${username} is already a member of <strong>${group}</strong>.</span>`); return;
                }
                user.groups.push(group);

                log(`<span style="color:#7ec8e3">PS C:\\&gt;</span> Add-LocalGroupMember -Group "${group}" -Member "${username}"`);
                log(`<span style="color:#a5d6a7">✅ ${username} added to <strong>${group}</strong>.</span>`);
                if (group === 'Administrators') {
                    log(`<span style="color:#ffab40">⚠ Security note: Local admin rights grant full control of this machine's SAM and registry.</span>`);
                }
                log(`&nbsp;`);
            });
        }

        if (queryBtn) {
            queryBtn.addEventListener('click', () => {
                log(`<span style="color:#7ec8e3">PS C:\\&gt;</span> Get-LocalUser | Select-Object Name, SID, Enabled`);
                log(`&nbsp;`);
                log(`${'Name'.padEnd(22)} ${'SID'.padEnd(44)} Enabled`);
                log(`${'----'.padEnd(22)} ${'---'.padEnd(44)} -------`);
                samDB.users.forEach(u => {
                    log(`${u.name.padEnd(22)} ${u.sid.padEnd(44)} ${u.enabled}`);
                });
                log(`&nbsp;`);
                log(`<span style="color:#7ec8e3">PS C:\\&gt;</span> Get-LocalGroup | Select-Object Name`);
                log(`&nbsp;`);
                const allGroups = [...new Set(samDB.users.flatMap(u => u.groups))].sort();
                allGroups.forEach(g => log(`  ${g}`));
                log(`&nbsp;`);
                log(`<span style="color:#aaa">── Physical file: C:\\Windows\\System32\\config\\SAM  (locked while Windows is running)</span>`);
                log(`<span style="color:#aaa">── Registry hive: HKEY_LOCAL_MACHINE\\SAM  (ACL-protected; SYSTEM only)</span>`);
                log(`&nbsp;`);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const el = document.getElementById('sam-log');
                if (el) el.innerHTML = '';
            });
        }
    })();

    /* ── IdP Flow Simulator ── */
    createDemo('what-is-idp', `
        <p class="demo-desc">Watch the full SSO flow: a user accesses an app that redirects to an Identity Provider for authentication.</p>
        <div class="demo-network-path" id="idp-sim" style="flex-wrap:wrap;gap:0.5rem;position:relative">
            <div class="demo-node demo-n-device" id="idp-user">👤<span>User Browser</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-device" id="idp-sp">📱<span>App (SP)</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-router" id="idp-idp">🏢<span>IdP (Azure AD)</span></div>
            <div class="demo-arrow">→</div>
            <div class="demo-node demo-n-device" id="idp-mfa">📱<span>MFA</span></div>
            <div class="demo-packet" id="idp-pkt">🔑</div>
        </div>
        <div class="demo-controls" style="margin-top:0.6rem">
            <label class="demo-radio"><input type="radio" name="idp-protocol" value="oidc" checked> OpenID Connect</label>
            <label class="demo-radio"><input type="radio" name="idp-protocol" value="saml"> SAML 2.0</label>
        </div>
        <div class="demo-log" id="idp-log"></div>
        <button class="demo-btn" id="idp-flow-btn">▶ Run SSO Flow</button>
    `);

    const idpFlowBtn = document.getElementById('idp-flow-btn');
    if (idpFlowBtn) {
        idpFlowBtn.addEventListener('click', async function() {
            this.disabled = true;
            const protocol = document.querySelector('input[name="idp-protocol"]:checked').value;
            const sim = document.getElementById('idp-sim');
            const pkt = document.getElementById('idp-pkt');
            const log = document.getElementById('idp-log');
            log.innerHTML = '';
            sim.querySelectorAll('.demo-node').forEach(n => n.classList.remove('demo-node-active'));

            const nodeFlow = protocol === 'oidc'
                ? ['#idp-user', '#idp-sp', '#idp-idp', '#idp-mfa', '#idp-idp', '#idp-sp', '#idp-user']
                : ['#idp-user', '#idp-sp', '#idp-idp', '#idp-mfa', '#idp-idp', '#idp-user', '#idp-sp'];

            const oidcMsgs = [
                '👤 User visits <code>app.example.com/dashboard</code> — not logged in',
                '📱 App (SP) detects no session → sends OIDC authorization request to IdP',
                '🏢 Azure AD shows login page. User enters credentials.',
                '📱 MFA triggered → user approves push notification on Authenticator',
                '🏢 Azure AD creates <strong>authorization code</strong> → redirects back to app',
                '📱 App exchanges code for <strong>ID token + access token</strong>',
                '✅ User is now logged in! Token contains: name, email, roles, tenant',
            ];

            const samlMsgs = [
                '👤 User visits <code>app.example.com/dashboard</code> — not logged in',
                '📱 App generates SAML <strong>AuthnRequest</strong> → redirects browser to IdP',
                '🏢 Azure AD shows login page. User enters credentials.',
                '📱 MFA triggered → user approves Authenticator notification',
                '🏢 Azure AD creates signed <strong>SAML Assertion</strong> (XML)',
                '🌐 Browser POSTs assertion to app\'s <strong>ACS URL</strong>',
                '✅ App validates XML signature → session created. Login complete!',
            ];

            const msgs = protocol === 'oidc' ? oidcMsgs : samlMsgs;

            for (let i = 0; i < nodeFlow.length; i++) {
                await animatePacket(sim, pkt, [nodeFlow[i]], 700);
                log.innerHTML += `<div class="demo-log-line">${msgs[i]}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(200);
            }
            pkt.style.opacity = '0';
            this.disabled = false;
        });
    }

    /* ── LDAP Protocol Demo ── */
    createDemo('ldap-protocol', `
        <p class="demo-desc">Simulate an LDAP bind and search operation against an Active Directory server.</p>
        <div class="demo-controls" style="flex-wrap:wrap;gap:0.5rem;align-items:center">
            <label style="font-size:0.85rem">Server: <input type="text" id="ldap-server" value="dc01.corp.contoso.com" class="demo-input" style="min-width:200px"></label>
            <label class="demo-radio"><input type="radio" name="ldap-port" value="389" checked> LDAP :389</label>
            <label class="demo-radio"><input type="radio" name="ldap-port" value="636"> LDAPS :636 (TLS)</label>
        </div>
        <div class="demo-controls" style="flex-wrap:wrap;gap:0.5rem;align-items:center;margin-top:0.4rem">
            <label style="font-size:0.85rem">Bind DN: <input type="text" id="ldap-binddn" value="corp\\svc-account" class="demo-input"></label>
            <label style="font-size:0.85rem">Search filter: <input type="text" id="ldap-filter-in" value="(sAMAccountName=jsmith)" class="demo-input"></label>
        </div>
        <button class="demo-btn demo-btn-sm" id="ldap-run-btn" style="margin-top:0.6rem">▶ Run LDAP Query</button>
        <div class="demo-log" id="ldap-proto-log" style="font-family:monospace;font-size:0.82rem"></div>
    `);

    const ldapRunBtn = document.getElementById('ldap-run-btn');
    if (ldapRunBtn) {
        ldapRunBtn.addEventListener('click', async function() {
            this.disabled = true;
            const server = document.getElementById('ldap-server').value || 'dc01.corp.contoso.com';
            const port = document.querySelector('input[name="ldap-port"]:checked').value;
            const bindDN = document.getElementById('ldap-binddn').value || 'corp\\svc-account';
            const filter = document.getElementById('ldap-filter-in').value || '(objectClass=user)';
            const log = document.getElementById('ldap-proto-log');
            log.innerHTML = '';

            const steps = [
                `🔌 TCP connect to <strong>${server}:${port}</strong>`,
                port === '636' ? '🔒 TLS handshake — certificate verified. Connection encrypted.' : '⚠️ Unencrypted connection (port 389). Consider STARTTLS or LDAPS in production.',
                `🤝 LDAP Bind Request → authenticating as: <strong>${bindDN}</strong>`,
                '✅ Bind Response: resultCode=0 (success) — authenticated',
                `🔍 Search Request:`,
                `   Base DN: DC=corp,DC=contoso,DC=com`,
                `   Scope: Subtree (all objects below base)`,
                `   Filter: <code>${filter}</code>`,
                `   Attributes requested: displayName, mail, memberOf, userAccountControl`,
                '📩 Search Response entries returned:',
                '   DN: CN=John Smith,OU=Finance,DC=corp,DC=contoso,DC=com',
                '   displayName: John Smith',
                '   mail: jsmith@corp.contoso.com',
                '   memberOf: CN=Domain Users,CN=Users,DC=corp,DC=contoso,DC=com',
                '   userAccountControl: 512 (normal enabled account)',
                '🏁 Search Done: resultCode=0, 1 entry returned',
                '🔓 Unbind → TCP connection closed',
            ];

            for (const s of steps) {
                log.innerHTML += `<div class="demo-log-line">${s}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(400);
            }
            this.disabled = false;
        });
    }

    /* ── SAML Flow Visualizer ── */
    createDemo('saml', `
        <p class="demo-desc">Step through the SAML 2.0 SP-Initiated SSO flow step by step.</p>
        <div class="demo-network-path" id="saml-sim" style="flex-wrap:wrap;gap:0.5rem">
            <div class="demo-node demo-n-device" id="saml-browser">🌐<span>Browser</span></div>
            <div class="demo-arrow">↔</div>
            <div class="demo-node demo-n-device" id="saml-sp">📱<span>SP (App)</span></div>
            <div class="demo-arrow">↔</div>
            <div class="demo-node demo-n-router" id="saml-idp">🏢<span>IdP</span></div>
        </div>
        <div class="demo-log" id="saml-log"></div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.4rem">
            <button class="demo-btn demo-btn-sm" id="saml-next-btn">▶ Next Step</button>
            <button class="demo-btn demo-btn-sm" id="saml-reset-btn">↺ Reset</button>
            <span id="saml-step-counter" style="font-size:0.85rem;align-self:center;color:var(--clr-text-muted,#6b7280)">Step 0 / 6</span>
        </div>
    `);

    const samlStepsData = [
        { actor: 'browser→sp', msg: '👤 <strong>Step 1:</strong> User navigates to <code>https://app.example.com/login</code>. No session found.' },
        { actor: 'sp→browser', msg: '📱 <strong>Step 2:</strong> SP creates SAML <strong>AuthnRequest</strong> (XML), Base64-encodes it, and 302-redirects browser to IdP:<br>&nbsp;&nbsp;<code>https://login.microsoftonline.com/...?SAMLRequest=PHNhbWxwOlJlc3BvbnNlI...</code>' },
        { actor: 'browser→idp', msg: '🌐 <strong>Step 3:</strong> Browser follows redirect → arrives at IdP login page. User enters credentials + MFA.' },
        { actor: 'idp→browser', msg: '🏢 <strong>Step 4:</strong> IdP validates credentials, creates signed <strong>SAML Assertion</strong> (XML):<br>&nbsp;&nbsp;Subject: alice@contoso.com | Attributes: displayName, role=admin | Signature: RSA-SHA256' },
        { actor: 'browser→sp', msg: '🌐 <strong>Step 5:</strong> Browser auto-POSTs the SAML Response to SP\'s <strong>ACS URL</strong>:<br>&nbsp;&nbsp;<code>POST https://app.example.com/saml/acs</code><br>&nbsp;&nbsp;Body: SAMLResponse=PHNhbWxwOlJlc3BvbnNlI...' },
        { actor: 'sp', msg: '📱 <strong>Step 6:</strong> SP validates XML signature using IdP\'s public certificate → extracts claims → creates local session.<br>&nbsp;&nbsp;✅ <strong>Login complete!</strong> User sees their dashboard.' },
    ];

    let samlStep = 0;
    const samlLog = document.getElementById('saml-log');

    const samlNextBtn = document.getElementById('saml-next-btn');
    const samlResetBtn = document.getElementById('saml-reset-btn');

    function updateSamlCounter() {
        const el = document.getElementById('saml-step-counter');
        if (el) el.textContent = `Step ${samlStep} / ${samlStepsData.length}`;
    }

    if (samlNextBtn) {
        samlNextBtn.addEventListener('click', function() {
            if (samlStep >= samlStepsData.length) return;
            const s = samlStepsData[samlStep];
            samlLog.innerHTML += `<div class="demo-log-line">${s.msg}</div>`;
            samlLog.scrollTop = samlLog.scrollHeight;
            samlStep++;
            updateSamlCounter();
            if (samlStep >= samlStepsData.length) this.disabled = true;
        });
    }
    if (samlResetBtn) {
        samlResetBtn.addEventListener('click', function() {
            samlStep = 0;
            samlLog.innerHTML = '';
            updateSamlCounter();
            if (samlNextBtn) samlNextBtn.disabled = false;
        });
    }

    /* ── OAuth 2.0 Flow Simulator ── */
    createDemo('oauth', `
        <p class="demo-desc">Simulate the OAuth 2.0 Authorization Code + PKCE flow. Select a grant type and walk through it.</p>
        <div class="demo-controls">
            <label class="demo-radio"><input type="radio" name="oauth-grant" value="authcode" checked> Authorization Code + PKCE</label>
            <label class="demo-radio"><input type="radio" name="oauth-grant" value="clientcreds"> Client Credentials</label>
            <label class="demo-radio"><input type="radio" name="oauth-grant" value="device"> Device Code</label>
        </div>
        <div class="demo-log" id="oauth-log"></div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.4rem">
            <button class="demo-btn" id="oauth-run-btn">▶ Run Flow</button>
            <button class="demo-btn demo-btn-sm" id="oauth-decode-btn">🔍 Decode Sample JWT</button>
        </div>
        <div class="demo-log" id="oauth-jwt-log" style="font-family:monospace;font-size:0.8rem;display:none;margin-top:0.4rem"></div>
    `);

    const oauthGrants = {
        authcode: [
            '👤 User clicks "Login with Microsoft" in the web app',
            '📱 App generates random <strong>code_verifier</strong> and <strong>code_challenge</strong> (PKCE):',
            '   code_verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"',
            '   code_challenge = BASE64URL(SHA256(code_verifier))',
            '🌐 App redirects browser to Azure AD /authorize with: client_id, scope, redirect_uri, code_challenge',
            '🏢 Azure AD shows login page → user authenticates + MFA',
            '🔀 Azure AD redirects back: <code>https://app.example.com/callback?code=OAAABAAAAiL9K...</code>',
            '📱 App sends POST to /token endpoint with: code + code_verifier (proves it\'s the same app)',
            '🏢 Azure AD validates code_verifier matches code_challenge → issues tokens:',
            '   • <strong>access_token</strong> (JWT, 1 hour) — for calling APIs',
            '   • <strong>id_token</strong> (JWT) — confirms user identity (OpenID Connect)',
            '   • <strong>refresh_token</strong> (90 days) — get new access tokens silently',
            '✅ App calls Microsoft Graph: <code>GET /v1.0/me</code> with <code>Authorization: Bearer {access_token}</code>',
        ],
        clientcreds: [
            '🤖 Background service/daemon needs to call an API (no user involved)',
            '📱 Service sends POST to /token with: client_id + client_secret (or certificate)',
            '🏢 Azure AD validates client credentials',
            '🔑 Azure AD returns <strong>access_token</strong> (JWT, app permissions only — no user context)',
            '✅ Service calls API with: <code>Authorization: Bearer {access_token}</code>',
            '⏱️ Token expires (typically 1 hour) → service requests a new one',
            'ℹ️ No refresh token in Client Credentials — just re-authenticate each time',
            '🔒 Best practice: use certificate instead of client_secret for higher security',
        ],
        device: [
            '📺 Device (TV, CLI tool, IoT) cannot open a browser',
            '📱 Device POSTs to <code>/devicecode</code> endpoint with: client_id + scope',
            '🏢 Azure AD returns: <strong>device_code</strong>, <strong>user_code</strong>, and verification_uri',
            '📺 Device displays: "Go to aka.ms/devicelogin and enter code: ABCD-1234"',
            '👤 User opens another device (phone/laptop), navigates to verification_uri, enters code',
            '🏢 Azure AD authenticates the user on THAT device → links to the waiting device_code',
            '📺 Device polls /token every 5 seconds until user completes authentication',
            '✅ Device receives access_token + refresh_token',
            '📺 Device can now call APIs on behalf of the authenticated user',
        ],
    };

    const oauthRunBtn = document.getElementById('oauth-run-btn');
    if (oauthRunBtn) {
        oauthRunBtn.addEventListener('click', async function() {
            this.disabled = true;
            const grant = document.querySelector('input[name="oauth-grant"]:checked').value;
            const log = document.getElementById('oauth-log');
            log.innerHTML = '';
            for (const s of oauthGrants[grant]) {
                log.innerHTML += `<div class="demo-log-line">${s}</div>`;
                log.scrollTop = log.scrollHeight;
                await sleep(650);
            }
            this.disabled = false;
        });
    }

    const oauthDecodeBtn = document.getElementById('oauth-decode-btn');
    if (oauthDecodeBtn) {
        oauthDecodeBtn.addEventListener('click', function() {
            const jwtLog = document.getElementById('oauth-jwt-log');
            jwtLog.style.display = jwtLog.style.display === 'none' ? '' : 'none';
            if (jwtLog.style.display !== 'none') {
                jwtLog.innerHTML = `
<div class="demo-log-line"><strong>Sample JWT Access Token (decoded):</strong></div>
<div class="demo-log-line"><span style="color:#1976d2"><strong>Header:</strong></span></div>
<div class="demo-log-line">{</div>
<div class="demo-log-line">&nbsp;&nbsp;"typ": "JWT",</div>
<div class="demo-log-line">&nbsp;&nbsp;"alg": "RS256",&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// signing algorithm</div>
<div class="demo-log-line">&nbsp;&nbsp;"kid": "i6lGk3FZzxRcUb..."&nbsp;// key ID to find public key at JWKS endpoint</div>
<div class="demo-log-line">}</div>
<div class="demo-log-line"><span style="color:#388e3c"><strong>Payload (Claims):</strong></span></div>
<div class="demo-log-line">{</div>
<div class="demo-log-line">&nbsp;&nbsp;"iss": "https://login.microsoftonline.com/{tenant}/v2.0",</div>
<div class="demo-log-line">&nbsp;&nbsp;"aud": "https://graph.microsoft.com",&nbsp;&nbsp;// intended audience (the API)</div>
<div class="demo-log-line">&nbsp;&nbsp;"sub": "AAAAAAAAAAAAAIkzqFVrSaSaFHy782bbtaQ",</div>
<div class="demo-log-line">&nbsp;&nbsp;"name": "Alice Smith",</div>
<div class="demo-log-line">&nbsp;&nbsp;"email": "alice@contoso.com",</div>
<div class="demo-log-line">&nbsp;&nbsp;"roles": ["User.Read", "Mail.ReadBasic"],</div>
<div class="demo-log-line">&nbsp;&nbsp;"iat": 1752341400,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// issued at (Unix timestamp)</div>
<div class="demo-log-line">&nbsp;&nbsp;"exp": 1752345000,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// expires at (1 hour later)</div>
<div class="demo-log-line">&nbsp;&nbsp;"tid": "72f988bf-86f1-..."&nbsp;&nbsp;&nbsp;// tenant ID</div>
<div class="demo-log-line">}</div>
<div class="demo-log-line"><span style="color:#f57c00"><strong>Signature:</strong></span> RSA-SHA256 of (header.payload) — verified using IdP's public key at JWKS endpoint</div>
<div class="demo-log-line">ℹ️ JWT is NOT encrypted — it's only signed. Anyone can base64-decode the payload!</div>
<div class="demo-log-line">🔒 Always validate: signature, iss (issuer), aud (audience), exp (expiry), tid (tenant)</div>`;
            }
        });
    }

});
