document.querySelector('#add-site-confirm').addEventListener('click', () => {
    document.querySelector('#add-site-confirm').innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>
    `;
    document.querySelector('#add-site-confirm').disabled = true;
    fetch('/websites', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.querySelector('#website-name').value,
            domain: document.querySelector('#website-domain').value,
            pythonanywhere_host: document.querySelector('#pythonanywhere-host').value,
            pythonanywhere_username: document.querySelector('#pythonanywhere-username').value,
            pythonanywhere_api_token: document.querySelector('#pythonanywhere-api-token').value
        })
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace('/')
            }
        })

});