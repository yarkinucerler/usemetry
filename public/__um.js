'use strict';

(function() {
    // instantiate a headers object
    const headers = new Headers();
    // add content type header to object
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");

    const generateToken = function() {
        const hex = '0123456789ABCDEF';
        
        let segments = [],
        buffer = new Uint8Array(16);
        
        crypto.getRandomValues(buffer);
    
        buffer[6] = 0x40 | (buffer[6] & 0xF);
        buffer[8] = 0x80 | (buffer[8] & 0xF);
    
        for (let i = 0; i < 16; ++i) {
            segments.push(hex[(buffer[i] >> 4 & 0xF)])
            segments.push(hex[(buffer[i] >> 0 & 0xF)])
    
            if (i == 3 || i == 5 || i == 7 || i == 9) {
                segments.push('-');
            }
        }
    
        return segments.join('');
    }

    const init = async function () {
        let user = JSON.parse(window.localStorage.getItem('user'));
        if (!user) {
            user = {
                id: generateToken()
            }
        }

        user.status = 'online',
        user.lastOnlineTime = new Date().toISOString()
        
        window.localStorage.setItem('user', JSON.stringify(user));
        
        // create a JSON object with parameters for API call and store in a variable
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(user),
            redirect: 'follow'
        };

        await fetch("http://93.115.79.119/", requestOptions)
        .then(response => response.text())
        .catch(error => console.log('error', error));
    }

    const beforeUnload = async function (e) {
        e.preventDefault();

        const user = JSON.parse(window.localStorage.getItem('user'));
        user.status = 'offline';

        window.localStorage.setItem('user', JSON.stringify(user));
        // create a JSON object with parameters for API call and store in a variable
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(user),
            redirect: 'follow'
        };

        await fetch("http://93.115.79.119/", requestOptions)
        .then(response => response.text())
        .then(() => false)
        .catch(error => console.log('error', error));
    }

    
    window.addEventListener('load', init)
    window.addEventListener('DOMContentLoaded', init)
    window.addEventListener('onbeforeunload', beforeUnload)
    window.addEventListener('beforeunload', beforeUnload)
    window.addEventListener('unload', beforeUnload)
    window.addEventListener('onunload', beforeUnload)
    window.onunload = beforeUnload;
    
    
    
    
    
    // define the callAPI function that takes a first name and last name as parameters
    window.callAPI = function (firstName,lastName) {
        // create a JSON object with parameters for API call and store in a variable
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"firstName":firstName,"lastName":lastName}),
            redirect: 'follow'
        };
        // make API call with parameters and use promises to get response
        fetch("https://0z3ij2tu4m.execute-api.eu-central-1.amazonaws.com/dev", requestOptions)
        .then(response => response.text())
        .then(result => alert(JSON.parse(result).body))
        .catch(error => console.log('error', error));
    }
})();