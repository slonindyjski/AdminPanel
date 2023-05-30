function randomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz234567';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
document.querySelector('#change-profile-details').addEventListener('click', () => {
    if (document.querySelector('#username').value != '' && document.querySelector('#full-name').value != '' && document.querySelector('#email').value != '') {
        document.querySelector('#change-profile-details').innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
        `;
        document.querySelector('#change-profile-details').disabled = true;
        fetch('/edit_profile', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: document.querySelector('#username').value, full_name: document.querySelector('#full-name').value, email: document.querySelector('#email').value })
        })
            .then(function (response) { return response.json(); })
            .then(function (json) {
                if (json.status == 'ok') {
                    window.location.replace('/account')
                }
            })
    }
});
document.querySelector('#change-password').addEventListener('click', () => {
    if (document.querySelector('#new-password').value == document.querySelector('#retype-password').value) {
        if (document.querySelector('#new-password').value != '') {
            document.querySelector('#change-password').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
            document.querySelector('#change-password').disabled = true;
            fetch('/change_password', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: document.querySelector('#new-password').value })
            })
                .then(function (response) { return response.json(); })
                .then(function (json) {
                    if (json.status == 'ok') {
                        window.location.replace('/account')
                    }
                })
        }
    } else {
        document.querySelector('#bad-passwords').classList.remove('d-none');
        document.querySelector('#change-password').innerHTML = '<i class="bi bi-pencil-fill"></i> Zmień hasło</button>';
        document.querySelector('#change-password').disabled = false;
    }
});
fetch('/2fa')
    .then(function (response) { return response.json(); })
    .then(function (json) {
        if (json.status == 'enabled') {
            document.querySelector('#disable-2fa').classList.remove('d-none');
        } else {
            document.querySelector('#enable-2fa').classList.remove('d-none');
        }
    })
var secret2fa = randomString(16);
document.querySelector('#secret-2fa').value = secret2fa;
new QRCode(document.querySelector('#qrcode-2fa'), `otpauth://totp/${document.querySelector('#cu-username').innerHTML}?secret=${secret2fa}&issuer=Slon%20Admin%20Panel`)
document.querySelector('#enable-2fa-confirm').addEventListener('click', () => {
    if (document.querySelector('#otp').value != '') {
        document.querySelector('#enable-2fa-confirm').innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
        `;
        document.querySelector('#enable-2fa-confirm').disabled = true;
        fetch('/2fa', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ secret: document.querySelector('#secret-2fa').value, otp: document.querySelector('#otp').value })
        })
            .then(function (response) { return response.json(); })
            .then(function (json) {
                if (json.status == 'ok') {
                    window.location.replace('/account')
                } else if (json.status == 'bad_otp') {
                    document.querySelector('#bad-otp').classList.remove('d-none');
                    document.querySelector('#enable-2fa-confirm').innerHTML = '<i class="bi bi-check-lg"></i> Włącz';
                    document.querySelector('#enable-2fa-confirm').disabled = false;
                }
            })
    }
});
document.querySelector('#disable-2fa-confirm').addEventListener('click', () => {
    document.querySelector('#disable-2fa-confirm').innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>
    `;
    document.querySelector('#disable-2fa-confirm').disabled = true;
    fetch('/2fa', { method: 'DELETE' })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace('/account')
            }
        })
});