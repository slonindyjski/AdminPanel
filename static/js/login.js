document.querySelector('form').addEventListener('submit', (e) => {
    document.querySelector('button[type=submit]').innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>
    `;
    document.querySelector('button[type=submit]').disabled = true;
    var data;
    if (document.querySelector('#otp').value == '') {
        data = { username: document.querySelector('#username').value, password: document.querySelector('#password').value };
    } else {
        data = { username: document.querySelector('#username').value, password: document.querySelector('#password').value, otp: document.querySelector('#otp').value }
    }
    fetch('/login_user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace('/')
            } else if (json.status == 'bad_credentials') {
                document.querySelector('#bad-credentials').classList.remove('d-none');
                document.querySelector('button[type=submit]').innerHTML = '<i class="bi bi-key-fill"></i> Zaloguj się';
                document.querySelector('button[type=submit]').disabled = false;
            } else if (json.status == 'otp_required') {
                document.querySelector('#bad-credentials').classList.add('d-none');
                document.querySelector('#username').disabled = true;
                document.querySelector('#password').disabled = true;
                document.querySelector('#otp').parentElement.classList.remove('d-none');
                document.querySelector('button[type=submit]').innerHTML = '<i class="bi bi-key-fill"></i> Zaloguj się';
                document.querySelector('button[type=submit]').disabled = false;
            } else if (json.status == 'bad_otp') {
                document.querySelector('#bad-otp').classList.remove('d-none');
                document.querySelector('button[type=submit]').innerHTML = '<i class="bi bi-key-fill"></i> Zaloguj się';
                document.querySelector('button[type=submit]').disabled = false;
            }
        });
    e.preventDefault();
});