'use strict';
(function (global, document, service) {
    const generateToken = function() {
        const hex = '0123456789ABCDEF'

        let segments = [],
            buffer = new Uint8Array(16)

        crypto.getRandomValues(buffer)

        buffer[6] = 0x40 | (buffer[6] & 0xF)
        buffer[8] = 0x80 | (buffer[8] & 0xF)

        for (let i = 0; i < 16; ++i) {
            segments.push(hex[(buffer[i] >> 4 & 0xF)])
            segments.push(hex[(buffer[i] >> 0 & 0xF)])

            if (i === 3 || i === 5 || i === 7 || i === 9) {
                segments.push('-');
            }
        }

        return segments.join('');
    }

    const userAgent = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        init: function () {
            const agent = this.header.join(' '),
                os = this.find(agent, this.dataos),
                browser = this.find(agent, this.databrowser);

            return { os: os, browser: browser };
        },
        find: function (string, data) {
            let match,
                matches,
                version;

            for (let i = 0; i < data.length; i += 1) {
                match = new RegExp(data[i].value, 'i').test(string);
                if (match) {
                    matches = string.match(new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i'));
                    version = matches[1] ? matches[1] : 0
                    return {
                        name: data[i].name,
                        version: version
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        }
    };

    function parseCookies(response) {
        const raw = response.headers.raw()['set-cookie'];
        return raw.map((entry) => {
            const parts = entry.split(';');
            const cookiePart = parts[0];
            return cookiePart;
        }).join(';');
    }

    global.um.sessionId = generateToken()
    global.um.history = {
        referrer: global.um.l,
        location: global.location.host,
        prev: document.referrer,
        current: global.location.pathname
    }

    global.um.module = userAgent.init()
    global.um.module.title = document.querySelector('title').innerText

    const checkOnline = function (res) {
        // instantiate a headers object
        const headers = new Headers();
        // add content type header to object
        headers.append('Cache', 'no-cache');
        headers.append('Accept',  'application/json',);
        headers.append("Content-Type", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");

        const interval = setInterval(function () {
            fetch('http://localhost:3000/check',  {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(res),
                redirect: 'follow',
                credentials: "same-origin"
            })
            .then(response => response.json())
            .then(res => {
                console.log(res);
            })
            .catch(error => console.log('error', error));
        }, ( 10 * 1000))
    }

    window.addEventListener('load', function () {
        // instantiate a headers object
        const headers = new Headers();
        // add content type header to object

        headers.append('Cache', 'no-cache');
        headers.append('Accept',  'application/json',);
        headers.append("Content-Type", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");

        fetch('http://localhost:3000',  {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
            credentials: "same-origin"
        }).then(response => response.json())
            .then(res => {
                console.log(res);
                checkOnline(res)
            })
          .catch(error => console.log('error', error));

        console.log('Sayfaya girdim')

        const user = {
            onlineTime: global.um.o,
            route: global.um.history,
            navigator: global.um.module,
            sessionId: global.um.sessionId,
            status: 'online',
        }

    })

    window.addEventListener('unload', function () {
        // instantiate a headers object
        const headers = new Headers();
        // add content type header to object
        headers.append('Cache', 'no-cache');
        headers.append('Accept',  'application/json',);
        headers.append("Content-Type", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");

        fetch('http://localhost:3000',  {
            method: 'POST',
            headers: headers,
            redirect: 'follow',
            credentials: "same-origin"
        }).then(response => response.json())
            .then(res => {
                console.log(res);
            })
            .catch(error => console.log('error', error));

        console.log('Sayfaya çıktım.')
        const user = {
            offlineTime: 1*new Date(),
            route: global.um.history,
            navigator: global.um.module,
            sessionId: global.um.sessionId,
            status: 'offline'
        }
    })

})(window, document)
