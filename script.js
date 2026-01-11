// ==UserScript==
// @name         RoliBlocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Filter dupes and block players on rolimons
// @match        https://www.rolimons.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var KEY = 'rf_cfg';
    var defaults = { blocked: [], raw: '', dupes: true, players: true };

    function load() {
        try {
            var s = localStorage.getItem(KEY);
            return s ? Object.assign({}, defaults, JSON.parse(s)) : Object.assign({}, defaults);
        } catch (e) { return Object.assign({}, defaults); }
    }

    function save(cfg) {
        localStorage.setItem(KEY, JSON.stringify(cfg));
    }

    var cfg = load();
    var done = false;
    var data = null;

    setTimeout(function () {
        if (!data) delete window.trade_ads;
    }, 5000);

    function filter(arr) {
        if (done || !arr || !arr.length) return arr;

        cfg = load();
        var blocked = {};
        for (var i = 0; i < cfg.blocked.length; i++) {
            blocked[cfg.blocked[i]] = true;
        }

        var seen = {};
        var out = [];
        var dupes = 0, skipped = 0;

        for (var j = 0; j < arr.length; j++) {
            var ad = arr[j];
            var uid = ad[2];

            if (cfg.players && blocked[uid]) {
                skipped++;
                continue;
            }

            var items = ad[4] && ad[4].items ? ad[4].items.slice().sort().join(',') : '';
            var k = uid + '|' + items;

            if (cfg.dupes && seen[k]) {
                dupes++;
                continue;
            }

            seen[k] = 1;
            out.push(ad);
        }

        if (dupes || skipped) {
            console.log('[RF] - ' + dupes + ' dupes, - ' + skipped + ' blocked');
        }
        done = true;
        return out;
    }

    Object.defineProperty(window, 'trade_ads', {
        configurable: true,
        enumerable: true,
        get: function () { return data; },
        set: function (v) { data = filter(v); }
    });

    function initUI() {
        if (document.getElementById('rf-panel')) return;

        var css = document.createElement('style');
        css.textContent = '#rf-btn{position:fixed;bottom:20px;right:20px;width:48px;height:48px;border-radius:50%;background:#0084dd;border:none;cursor:pointer;z-index:9999;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);transition:transform 0.2s,background 0.2s}#rf-btn:hover{background:#0099ff;transform:scale(1.05)}#rf-btn svg{width:22px;height:22px;fill:#fff}#rf-panel{position:fixed;bottom:80px;right:20px;width:320px;background:#1c1e22;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,0.6);z-index:9998;display:none;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;border:1px solid #333}#rf-panel.open{display:block;animation:rf-fade 0.2s ease-out}@keyframes rf-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.rf-head{background:#2b2f33;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;border-radius:4px 4px 0 0}.rf-head h3{margin:0;color:#ddd;font-size:15px;font-weight:600}.rf-x{background:none;border:none;color:#888;font-size:18px;cursor:pointer;padding:4px;line-height:1;border-radius:4px}.rf-x:hover{color:#fff;background:rgba(255,255,255,0.1)}.rf-body{padding:16px}.rf-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;height:24px}.rf-lbl{color:#ddd;font-size:14px;font-weight:500;line-height:1;margin:0;position:relative;top:-5px}.rf-sw{position:relative;width:36px;height:20px;display:inline-block;flex-shrink:0}.rf-sw input{opacity:0;width:0;height:0}.rf-sl{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#444;transition:.2s;border-radius:20px}.rf-sl:before{position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background-color:white;transition:.2s;border-radius:50%}.rf-sw input:checked+.rf-sl{background-color:#0084dd}.rf-sw input:checked+.rf-sl:before{transform:translateX(16px)}.rf-lbl2{color:#ccc;font-size:13px;font-weight:500;margin:16px 0 6px;display:block}.rf-ta{width:100%;height:100px;background:#2b2f33;border:1px solid #444;border-radius:4px;color:#ddd;padding:8px 10px;font-size:13px;font-family:Consolas,monospace;resize:vertical;box-sizing:border-box;display:block}.rf-ta:focus{outline:none;border-color:#0084dd}.rf-ta::placeholder{color:#666}.rf-hint{color:#777;font-size:11px;margin-top:4px;text-align:right}.rf-save{width:100%;padding:8px 0;background:#0084dd;border:1px solid #0084dd;border-radius:4px;color:#f7f7f7;font-size:14px;font-weight:500;cursor:pointer;margin-top:16px;transition:background 0.15s}.rf-save:hover{background:#26292d;border-color:#26292d}.rf-ok{color:#62c462;font-size:13px;text-align:center;margin-top:8px;opacity:0;transition:opacity 0.3s;font-weight:500}.rf-ok.show{opacity:1}.rf-support{display:block;text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #333;color:#ffb347;font-size:11px;text-decoration:none;transition:color 0.2s}.rf-support:hover{color:#ffd700}';
        document.head.appendChild(css);

        var btn = document.createElement('button');
        btn.id = 'rf-btn';
        btn.title = 'Filter Settings';
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></svg>';
        document.body.appendChild(btn);

        var panel = document.createElement('div');
        panel.id = 'rf-panel';
        panel.innerHTML = '<div class="rf-head"><h3>Trade Ads Filter</h3><button class="rf-x">×</button></div><div class="rf-body"><div class="rf-row"><span class="rf-lbl">Remove duplicates</span><label class="rf-sw"><input type="checkbox" id="rf-dupes"><span class="rf-sl"></span></label></div><div class="rf-row"><span class="rf-lbl">Block players</span><label class="rf-sw"><input type="checkbox" id="rf-players"><span class="rf-sl"></span></label></div><span class="rf-lbl2">Blocked User IDs</span><textarea class="rf-ta" id="rf-ids" placeholder="12345678 // Scammer"></textarea><div class="rf-hint">One ID per line. Comments after //</div><button class="rf-save">Save Settings</button><a href="https://www.roblox.com/communities/428430700/RoliBlocker#!/about" target="_blank" class="rf-support">Want to support our work? Click here!</a></div>';
        document.body.appendChild(panel);

        var dupeBox = document.getElementById('rf-dupes');
        var playerBox = document.getElementById('rf-players');
        var idsBox = document.getElementById('rf-ids');
        var closeBtn = panel.querySelector('.rf-x');
        var saveBtn = panel.querySelector('.rf-save');

        function refresh() {
            var c = load();
            dupeBox.checked = c.dupes;
            playerBox.checked = c.players;
            idsBox.value = c.raw || c.blocked.join('\n');
        }

        refresh();

        btn.onclick = function () {
            panel.classList.toggle('open');
            refresh();
        };

        closeBtn.onclick = function () {
            panel.classList.remove('open');
        };

        saveBtn.onclick = function () {
            var raw = idsBox.value;
            var lines = raw.split('\n');
            var ids = [];
            for (var i = 0; i < lines.length; i++) {
                var num = lines[i].split('//')[0].trim();
                if (/^\d+$/.test(num)) {
                    ids.push(parseInt(num, 10));
                }
            }
            save({
                blocked: ids,
                raw: raw,
                dupes: dupeBox.checked,
                players: playerBox.checked
            });
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#62c462';
            saveBtn.style.borderColor = '#62c462';
            setTimeout(function () {
                location.reload();
            }, 800);
        };

        document.addEventListener('click', function (e) {
            if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                panel.classList.remove('open');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();
