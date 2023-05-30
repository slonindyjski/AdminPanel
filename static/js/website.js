const regexForAccessLogs = /(.*) - (.*) \[(.*)\] "(.*) (.*) (.*)" (.*) (.*) "(.*)" "(.*)" ".*" response-time=(.*)/;

function createPagination(logsType, currentPage) {
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/`)
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (logsType == 'access') {
                var pagination = document.createElement('nav');
                pagination.innerHTML = '<ul class="pagination"></ul>';
                var firstPage = document.createElement('li');
                firstPage.classList.add('page-item');
                firstPage.innerHTML = '<button class="page-link">&laquo;</button>';
                if (currentPage == 1) {
                    firstPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(firstPage);

                for (var i = 1; i <= json.access.length; i++) {
                    var page = document.createElement('li');
                    page.classList.add('page-item');
                    page.innerHTML = `<button class="page-link">${i}</button>`;
                    if (currentPage == i) {
                        page.classList.add('active');
                    }
                    pagination.querySelector('.pagination').append(page);
                }

                var lastPage = document.createElement('li');
                lastPage.classList.add('page-item');
                lastPage.innerHTML = '<button class="page-link">&raquo;</button>';
                if (currentPage == json.access.length) {
                    lastPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(lastPage);

                pagination.querySelectorAll('button').forEach((e) => {
                    e.addEventListener('click', (evt) => {
                        if (evt.currentTarget.innerHTML == '«') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index - 1].classList.add('active');
                            loadAccessLogs();
                        } else if (evt.currentTarget.innerHTML == '»') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index + 1].classList.add('active');
                            loadAccessLogs();
                        } else {
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            evt.currentTarget.parentElement.classList.add('active');
                            loadAccessLogs();
                        }
                    })
                })

                document.querySelector('#logs-pagination').innerHTML = '';
                document.querySelector('#logs-pagination').append(pagination);
            } else if (logsType == 'accessFormatted') {
                var pagination = document.createElement('nav');
                pagination.innerHTML = '<ul class="pagination"></ul>';
                var firstPage = document.createElement('li');
                firstPage.classList.add('page-item');
                firstPage.innerHTML = '<button class="page-link">&laquo;</button>';
                if (currentPage == 1) {
                    firstPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(firstPage);

                for (var i = 1; i <= json.access.length; i++) {
                    var page = document.createElement('li');
                    page.classList.add('page-item');
                    page.innerHTML = `<button class="page-link">${i}</button>`;
                    if (currentPage == i) {
                        page.classList.add('active');
                    }
                    pagination.querySelector('.pagination').append(page);
                }

                var lastPage = document.createElement('li');
                lastPage.classList.add('page-item');
                lastPage.innerHTML = '<button class="page-link">&raquo;</button>';
                if (currentPage == json.access.length) {
                    lastPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(lastPage);

                pagination.querySelectorAll('button').forEach((e) => {
                    e.addEventListener('click', (evt) => {
                        if (evt.currentTarget.innerHTML == '«') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index - 1].classList.add('active');
                            loadAccessLogsFormatted();
                        } else if (evt.currentTarget.innerHTML == '»') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index + 1].classList.add('active');
                            loadAccessLogsFormatted();
                        } else {
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            evt.currentTarget.parentElement.classList.add('active');
                            loadAccessLogsFormatted();
                        }
                    })
                })

                document.querySelector('#logs-pagination').innerHTML = '';
                document.querySelector('#logs-pagination').append(pagination);
            } else if (logsType == 'error') {
                var pagination = document.createElement('nav');
                pagination.innerHTML = '<ul class="pagination"></ul>';
                var firstPage = document.createElement('li');
                firstPage.classList.add('page-item');
                firstPage.innerHTML = '<button class="page-link">&laquo;</button>';
                if (currentPage == 1) {
                    firstPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(firstPage);

                for (var i = 1; i <= json.error.length; i++) {
                    var page = document.createElement('li');
                    page.classList.add('page-item');
                    page.innerHTML = `<button class="page-link">${i}</button>`;
                    if (currentPage == i) {
                        page.classList.add('active');
                    }
                    pagination.querySelector('.pagination').append(page);
                }

                var lastPage = document.createElement('li');
                lastPage.classList.add('page-item');
                lastPage.innerHTML = '<button class="page-link">&raquo;</button>';
                if (currentPage == json.error.length) {
                    lastPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(lastPage);

                pagination.querySelectorAll('button').forEach((e) => {
                    e.addEventListener('click', (evt) => {
                        if (evt.currentTarget.innerHTML == '«') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index - 1].classList.add('active');
                            loadErrorLogs();
                        } else if (evt.currentTarget.innerHTML == '»') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index + 1].classList.add('active');
                            loadErrorLogs();
                        } else {
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            evt.currentTarget.parentElement.classList.add('active');
                            loadErrorLogs();
                        }
                    })
                })

                document.querySelector('#logs-pagination').innerHTML = '';
                document.querySelector('#logs-pagination').append(pagination);
            } else if (logsType == 'server') {
                var pagination = document.createElement('nav');
                pagination.innerHTML = '<ul class="pagination"></ul>';
                var firstPage = document.createElement('li');
                firstPage.classList.add('page-item');
                firstPage.innerHTML = '<button class="page-link">&laquo;</button>';
                if (currentPage == 1) {
                    firstPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(firstPage);

                for (var i = 1; i <= json.server.length; i++) {
                    var page = document.createElement('li');
                    page.classList.add('page-item');
                    page.innerHTML = `<button class="page-link">${i}</button>`;
                    if (currentPage == i) {
                        page.classList.add('active');
                    }
                    pagination.querySelector('.pagination').append(page);
                }

                var lastPage = document.createElement('li');
                lastPage.classList.add('page-item');
                lastPage.innerHTML = '<button class="page-link">&raquo;</button>';
                if (currentPage == json.server.length) {
                    lastPage.classList.add('disabled');
                }
                pagination.querySelector('.pagination').append(lastPage);

                pagination.querySelectorAll('button').forEach((e) => {
                    e.addEventListener('click', (evt) => {
                        if (evt.currentTarget.innerHTML == '«') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index - 1].classList.add('active');
                            loadServerLogs();
                        } else if (evt.currentTarget.innerHTML == '»') {
                            var index = Array.from(document.querySelector('#logs-pagination').querySelectorAll('li')).indexOf(document.querySelector('#logs-pagination').querySelector('.active'));
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            document.querySelector('#logs-pagination').querySelectorAll('li')[index + 1].classList.add('active');
                            loadServerLogs();
                        } else {
                            document.querySelector('#logs-pagination').querySelector('.active').classList.remove('active');
                            evt.currentTarget.parentElement.classList.add('active');
                            loadServerLogs();
                        }
                    })
                })

                document.querySelector('#logs-pagination').innerHTML = '';
                document.querySelector('#logs-pagination').append(pagination);
            }
        })
}

function loadAccessLogs() {
    document.querySelector('#logs').innerHTML = '';
    document.querySelector('#loading-logs').classList.replace('d-none', 'd-flex');
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/`)
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (document.querySelector('#logs-pagination').querySelector('.pagination') != null) {
                var pages = document.querySelector('#logs-pagination').querySelectorAll('li');
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].classList.contains('active')) {
                        loadLogs(json.access[i - 1]);
                        // createPagination('access', i);
                        break;
                    }
                }
            } else {
                loadLogs(json.access[0]);
                // createPagination('access', 1);
            }
        })
}

function loadAccessLogsFormatted() {
    document.querySelector('#logs').innerHTML = '';
    document.querySelector('#loading-logs').classList.replace('d-none', 'd-flex');
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/`)
        .then(function (response) { return response.json(); })
        .then(function (json) {
            fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/${json.access[0]}/`)
                .then(function (response) { return response.text(); })
                .then(function (text) {
                    var lines = text.split('\n').slice(0, text.split('\n').length - 1);
                    var tableDiv = document.createElement('div');
                    tableDiv.classList.add('table-responsive');
                    var table = document.createElement('table');
                    table.classList.add('table');
                    table.innerHTML = `
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">IP</th>
                                    <th scope="col">Użytkownik</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Metoda</th>
                                    <th scope="col">Ścieżka</th>
                                    <th scope="col">Protokół</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Rozmiar odpowiedzi</th>
                                    <th scope="col">HTTP Referer</th>
                                    <th scope="col">User Agent</th>
                                    <th scope="col">Czas odpowiedzi</th>
                                </tr>
                            </thead>
                            `;
                    var tbody = document.createElement('tbody');
                    for (var i = 0; i < lines.length; i++) {
                        var row = document.createElement('tr');
                        var r = lines[i].match(regexForAccessLogs);
                        var statusColor;
                        if (r[7][0] == '1') {
                            statusColor = 'light-emphasis';
                        } else if (r[7][0] == '2') {
                            statusColor = 'success';
                        } else if (r[7][0] == '3') {
                            statusColor = 'info';
                        } else if (r[7][0] == '4') {
                            statusColor = 'warning';
                        } else if (r[7][0] == '5') {
                            statusColor = 'danger';
                        }
                        var responseSize;
                        var responseSizeUnit;
                        if (Number(r[8]) < 1024) {
                            responseSize = Number(r[8]);
                            responseSizeUnit = 'B'
                        } else if (Number(r[8]) >= 1024 && Number(r[8]) < (1024 ** 2)) {
                            responseSize = Math.round(Number(r[8]) / 1024 * 100) / 100;
                            responseSizeUnit = 'KB';
                        } else if (Number(r[8]) >= (1024 ** 2) && Number(r[8]) < (1024 ** 3)) {
                            responseSize = Math.round(Number(r[8]) / (1024 ** 2) * 100) / 100;
                            responseSizeUnit = 'MB';
                        } else if (Number(r[8]) >= (1024 ** 3) && Number(r[8]) < (1024 ** 4)) {
                            responseSize = Math.round(Number(r[8]) / (1024 ** 3) * 100) / 100;
                            responseSizeUnit = 'GB';
                        } else if (Number(r[8]) >= (1024 ** 4)) {
                            responseSize = Math.round(Number(r[8]) / (1024 ** 4) * 100) / 100;
                            responseSizeUnit = 'TB';
                        }
                        var date = new Date(Date.UTC(r[3].split('/')[2].split(':')[0],
                            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(r[3].split('/')[1]),
                            r[3].split('/')[0],
                            r[3].split('/')[2].split(':')[1],
                            r[3].split('/')[2].split(':')[2],
                            r[3].split('/')[2].split(':')[3].split(' ')[0]
                        ));
                        row.innerHTML = `
                                <th scope="row">${i + 1}</th>
                                <td>${r[1]}</td>
                                <td>${r[2]}</td>
                                <td>${date.toLocaleString()}</td>
                                <td>${r[4]}</td>
                                <td>${r[5]}</td>
                                <td>${r[6]}</td>
                                <td class="text-${statusColor}">${r[7]}</td>
                                <td>${responseSize} ${responseSizeUnit}</td>
                                <td>${r[9]}</td>
                                <td>${r[10]}</td>
                                <td>${r[11]}</td>
                                `;
                        tbody.append(row);
                    }
                    table.append(tbody);
                    tableDiv.append(table);
                    document.querySelector('#logs').innerHTML = '';
                    document.querySelector('#logs').append(tableDiv);
                    document.querySelector('#loading-logs').classList.replace('d-flex', 'd-none');
                })
        })
}

function loadErrorLogs() {
    document.querySelector('#logs').innerHTML = '';
    document.querySelector('#loading-logs').classList.replace('d-none', 'd-flex');
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/`)
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (document.querySelector('#logs-pagination').querySelector('.pagination') != null) {
                var pages = document.querySelector('#logs-pagination').querySelectorAll('li');
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].classList.contains('active')) {
                        loadLogs(json.error[i - 1]);
                        // createPagination('error', i);
                        break;
                    }
                }
            } else {
                loadLogs(json.error[0]);
                // createPagination('error', 1);
            }
        })
}

function loadServerLogs() {
    document.querySelector('#logs').innerHTML = '';
    document.querySelector('#loading-logs').classList.replace('d-none', 'd-flex');
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/`)
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (document.querySelector('#logs-pagination').querySelector('.pagination') != null) {
                var pages = document.querySelector('#logs-pagination').querySelectorAll('li');
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].classList.contains('active')) {
                        loadLogs(json.server[i - 1]);
                        // createPagination('server', i);
                        break;
                    }
                }
            } else {
                loadLogs(json.server[0]);
                // createPagination('server', 1);
            }
        })
}

function loadLogs(name) {
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/logs/${name}/`)
        .then(function (response) { return response.text(); })
        .then(function (text) {
            var lines = text.split('\n').slice(0, text.split('\n').length - 1);
            var maxWidth = 0;
            var numberWidth = String(lines.length).length + 1;
            var elements = document.createElement('div');
            lines.forEach((e) => {
                if (e.length > maxWidth) {
                    maxWidth = e.length
                }
            })
            maxWidth++;
            for (var i = 0; i < lines.length; i++) {
                var element = document.createElement('div');
                element.classList.add('logs-line')
                var lineNumber = document.createElement('span');
                lineNumber.classList.add('logs-line-number');
                lineNumber.innerHTML = i + 1;
                lineNumber.style.width = `${numberWidth}ch`;
                var line = document.createElement('span');
                line.classList.add('logs-line-text');
                if (i % 2 == 0) {
                    line.classList.add('logs-line-even-number')
                } else {
                    line.classList.add('logs-line-odd-number')
                }
                line.innerHTML = lines[i];
                line.style.height = '3ch';
                line.style.width = `${maxWidth}ch`;
                line.style.marginLeft = `${numberWidth}ch`;
                element.append(lineNumber);
                element.append(line);
                elements.append(element);
            }
            document.querySelector('#logs').innerHTML = '';
            document.querySelector('#logs').append(elements);
            document.querySelector('#loading-logs').classList.replace('d-flex', 'd-none');
        })
}

if (document.querySelector('#show-password')) {
    document.querySelector('#show-password').addEventListener('click', () => {
        if (document.querySelector('#password-visible').classList.contains('d-none')) {
            document.querySelector('#password-visible').classList.remove('d-none');
            document.querySelector('#password-hidden').classList.add('d-none');
            document.querySelector('#show-password').innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
        } else {
            document.querySelector('#password-visible').classList.add('d-none');
            document.querySelector('#password-hidden').classList.remove('d-none');
            document.querySelector('#show-password').innerHTML = '<i class="bi bi-eye-fill"></i>';
        }
    });
}
document.querySelector('#enable-password-protection').addEventListener('change', () => {
    if (document.querySelector('#enable-password-protection').checked) {
        document.querySelector('#password-settings-details').classList.remove('d-none');
    } else {
        document.querySelector('#password-settings-details').classList.add('d-none');
    }
});
document.querySelector('#show-password-2').addEventListener('click', () => {
    if (document.querySelector('#password-protection-password').type == 'password') {
        document.querySelector('#password-protection-password').type = 'text';
        document.querySelector('#show-password-2').innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    } else {
        document.querySelector('#password-protection-password').type = 'password';
        document.querySelector('#show-password-2').innerHTML = '<i class="bi bi-eye-fill"></i>';
    }
});
document.querySelector('#reload-website').addEventListener('click', () => {
    document.querySelector('#reload-website').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#reload-website').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/reload/`, {
        method: 'POST'
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace(`/websites/${document.querySelector('#website-website-id').innerHTML}/`)
            }
        })
});
document.querySelector('#enable-website').addEventListener('click', () => {
    document.querySelector('#enable-website').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#enable-website').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/enable/`, {
        method: 'POST'
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace(`/websites/${document.querySelector('#website-website-id').innerHTML}/`)
            }
        })
});
document.querySelector('#disable-website').addEventListener('click', () => {
    document.querySelector('#disable-website').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#disable-website').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/disable/`, {
        method: 'POST'
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace(`/websites/${document.querySelector('#website-website-id').innerHTML}/`)
            }
        })
});
document.querySelector('#save-password-settings').addEventListener('click', () => {
    var data;
    if (document.querySelector('#enable-password-protection').checked) {
        data = {
            enabled: true,
            username: document.querySelector('#password-protection-username').value,
            password: document.querySelector('#password-protection-password').value
        }
    } else {
        data = {
            enabled: false
        }
    }
    document.querySelector('#save-password-settings').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#save-password-settings').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/update_password_settings/`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace(`/websites/${document.querySelector('#website-website-id').innerHTML}/`)
            }
        })
});
document.querySelector('#delete-website-confirm').addEventListener('click', () => {
    document.querySelector('#delete-website-confirm').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#delete-website-confirm').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/`, {
        method: 'DELETE'
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
            if (json.status == 'ok') {
                window.location.replace('/')
            }
        })
});
document.querySelector('#edit-website-confirm').addEventListener('click', () => {
    document.querySelector('#edit-website-confirm').innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            `;
    document.querySelector('#edit-website-confirm').disabled = true;
    fetch(`/websites/${document.querySelector('#website-website-id').innerHTML}/`, {
        method: 'PUT',
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
                window.location.replace(`/websites/${document.querySelector('#website-website-id').innerHTML}/`)
            }
        })
});

document.querySelector('#pills-logs-tab').addEventListener('click', () => {
    if (document.querySelector('#access-logs-tab').classList.contains('active') && document.querySelector('#access-logs-formatted-tab').classList.contains('active') && document.querySelector('#logs').innerHTML == '') {
        loadAccessLogsFormatted();
    }
})

document.querySelector('#access-logs-tab').addEventListener('click', () => {
    document.querySelector('#logs-pagination').innerHTML = '';
    document.querySelector('#access-logs-tab').classList.add('active');
    document.querySelector('#error-logs-tab').classList.remove('active');
    document.querySelector('#server-logs-tab').classList.remove('active');
    document.querySelector('#access-logs-type').classList.remove('d-none');
    if (document.querySelector('#access-logs-formatted-tab').classList.contains('active')) {
        loadAccessLogsFormatted();
    } else if (document.querySelector('#access-logs-source-tab').classList.contains('active')) {
        loadAccessLogs();
    }
});
document.querySelector('#error-logs-tab').addEventListener('click', () => {
    document.querySelector('#logs-pagination').innerHTML = '';
    document.querySelector('#access-logs-tab').classList.remove('active');
    document.querySelector('#error-logs-tab').classList.add('active');
    document.querySelector('#server-logs-tab').classList.remove('active');
    document.querySelector('#access-logs-type').classList.add('d-none');
    loadErrorLogs();
});
document.querySelector('#server-logs-tab').addEventListener('click', () => {
    document.querySelector('#logs-pagination').innerHTML = '';
    document.querySelector('#access-logs-tab').classList.remove('active');
    document.querySelector('#error-logs-tab').classList.remove('active');
    document.querySelector('#server-logs-tab').classList.add('active');
    document.querySelector('#access-logs-type').classList.add('d-none');
    loadServerLogs();
});
document.querySelector('#access-logs-formatted-tab').addEventListener('click', () => {
    document.querySelector('#logs-pagination').innerHTML = '';
    document.querySelector('#access-logs-formatted-tab').classList.add('active');
    document.querySelector('#access-logs-source-tab').classList.remove('active');
    loadAccessLogsFormatted();
});
document.querySelector('#access-logs-source-tab').addEventListener('click', () => {
    document.querySelector('#logs-pagination').innerHTML = '';
    document.querySelector('#access-logs-formatted-tab').classList.remove('active');
    document.querySelector('#access-logs-source-tab').classList.add('active');
    loadAccessLogs();
});
document.querySelector('#refresh-logs').addEventListener('click', () => {
    if (document.querySelector('#access-logs-tab').classList.contains('active') && document.querySelector('#access-logs-formatted-tab').classList.contains('active')) {
        loadAccessLogsFormatted();
    } else if (document.querySelector('#access-logs-tab').classList.contains('active') && document.querySelector('#access-logs-source-tab').classList.contains('active')) {
        loadAccessLogs();
    } else if (document.querySelector('#error-logs-tab').classList.contains('active')) {
        loadErrorLogs();
    } else if (document.querySelector('#server-logs-tab').classList.contains('active')) {
        loadServerLogs();
    }
});