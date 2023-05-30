from flask import Flask, send_file, request, redirect, url_for, render_template
from flask_login import LoginManager, login_required, logout_user, \
    login_user, UserMixin, current_user
import mysql.connector
import requests
import pyotp
import hashlib
import json

with open('configs.json') as file:
    configs = json.load(file)

with open('version.json') as file:
    version = json.load(file)

login_manager = LoginManager()

app = Flask(__name__)

app.secret_key = configs['app_secret_key']

login_manager.init_app(app)


class User(UserMixin):
    def __init__(self, user_id, username, full_name, password, email, secret_2fa):
        self.user_id = str(user_id)
        self.username = username
        self.full_name = full_name
        self.password = password.lower()
        self.email = email
        self.secret_2fa = secret_2fa

    def get_id(self):
        return str(self.user_id) + '+' + self.password

    def check_password(self, password):
        return str(hashlib.sha256(password.encode('UTF-8'))
                   .hexdigest()).lower() == self.password

    def check_otp(self, otp):
        totp = pyotp.TOTP(self.secret_2fa)
        return totp.verify(str(otp))

    def edit(self, username, full_name, email):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        sql = 'UPDATE users SET username = %s, full_name = %s, email = %s WHERE id = %s'
        cursor.execute(sql, (username, full_name, email, self.user_id))
        db.commit()
        cursor.close()
        db.close()

    def change_password(self, password):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        password = str(hashlib.sha256(
            password.encode('UTF-8')).hexdigest()).lower()
        sql = 'UPDATE users SET password = %s WHERE id = %s'
        cursor.execute(sql, (password, self.user_id))
        db.commit()
        cursor.close()
        db.close()

    def enable_2fa(self, secret):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        sql = 'UPDATE users SET secret_2fa = %s WHERE id = %s'
        cursor.execute(sql, (secret, self.user_id))
        db.commit()
        cursor.close()
        db.close()

    def disable_2fa(self):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        sql = 'UPDATE users SET secret_2fa = NULL WHERE id = %s'
        cursor.execute(sql, (self.user_id, ))
        db.commit()
        cursor.close()
        db.close()


class Website:
    def __init__(self, website_id, user, name, domain, pythonanywhere_host, pythonanywhere_username, pythonanywhere_api_token):
        self.website_id = website_id
        self.user = user
        self.name = name
        self.domain = domain
        self.pythonanywhere_host = pythonanywhere_host
        self.pythonanywhere_username = pythonanywhere_username
        self.pythonanywhere_api_token = pythonanywhere_api_token

    def get_info(self):
        r = requests.get(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}/webapps/{self.domain}/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return r.json()

    def reload_website(self):
        r = requests.post(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}/webapps/{self.domain}/reload/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return r.json()['status'] == 'OK'

    def enable_website(self):
        r = requests.post(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}/webapps/{self.domain}/enable/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return r.json()['status'] == 'OK'

    def disable_website(self):
        r = requests.post(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}/webapps/{self.domain}/disable/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return r.json()['status'] == 'OK'

    def update_password_settings(self, enabled, username=None, password=None):
        if enabled:
            data = {
                'password_protection_enabled': True,
                'password_protection_username': username,
                'password_protection_password': password
            }
        else:
            data = {'password_protection_enabled': False}
        requests.patch(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}/webapps/{self.domain}/',
            data=data,
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return self.reload_website()

    def edit(self, name, domain, pythonanywhere_host, pythonanywhere_username, pythonanywhere_api_token):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        sql = 'UPDATE websites SET name = %s, domain = %s, pythonanywhere_host = %s, pythonanywhere_username = %s, pythonanywhere_api_token = %s WHERE id = %s'
        cursor.execute(sql, (name, domain, pythonanywhere_host,
                       pythonanywhere_username, pythonanywhere_api_token, self.website_id))
        db.commit()
        cursor.close()
        db.close()

    def delete(self):
        db = mysql.connector.connect(**configs['database'])
        cursor = db.cursor()
        sql = 'DELETE FROM websites WHERE id = %s'
        cursor.execute(sql, (self.website_id, ))
        db.commit()
        cursor.close()
        db.close()

    def list_logs(self):
        r = requests.get(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}//files/path/var/log/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        rj = r.json()
        access_logs = []
        error_logs = []
        server_logs = []
        for name in rj.keys():
            if name.startswith(self.domain + '.access.log'):
                access_logs.append(name)
            elif name.startswith(self.domain + '.error.log'):
                error_logs.append(name)
            elif name.startswith(self.domain + '.server.log'):
                server_logs.append(name)
        return {'access': access_logs,
                'error': error_logs,
                'server': server_logs}

    def get_logs(self, name):
        r = requests.get(
            f'https://{self.pythonanywhere_host}/api/v0/user/{self.pythonanywhere_username}//files/path/var/log/{name}/',
            headers={'Authorization': f'Token {self.pythonanywhere_api_token}'})
        return r.text


def get_user(user_id=None, username=None):
    db = mysql.connector.connect(**configs['database'])
    cursor = db.cursor(dictionary=True)
    if user_id is not None:
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id, ))
    elif username is not None:
        cursor.execute(
            'SELECT * FROM users WHERE username = %s', (username, ))
    result = cursor.fetchall()
    cursor.close()
    db.close()
    try:
        return User(result[0]['id'],
                    result[0]['username'],
                    result[0]['full_name'],
                    result[0]['password'],
                    result[0]['email'],
                    result[0]['secret_2fa'])
    except IndexError:
        return None


def create_website(website):
    db = mysql.connector.connect(**configs['database'])
    cursor = db.cursor()
    sql = 'INSERT INTO websites VALUES (NULL, %s, %s, %s, %s, %s, %s)'
    cursor.execute(sql, (website.user.user_id, website.name, website.domain,
                   website.pythonanywhere_host, website.pythonanywhere_username, website.pythonanywhere_api_token))
    db.commit()
    cursor.close()
    db.close()


def get_user_websites(user):
    db = mysql.connector.connect(**configs['database'])
    cursor = db.cursor(dictionary=True)
    cursor.execute('SELECT * FROM websites WHERE user_id = %s',
                   (user.user_id, ))
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return [Website(row['id'], user, row['name'], row['domain'], row['pythonanywhere_host'], row['pythonanywhere_username'], row['pythonanywhere_api_token']) for row in result]


def get_website(user, website_id):
    db = mysql.connector.connect(**configs['database'])
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        'SELECT * FROM websites WHERE user_id = %s AND id = %s', (user.user_id, website_id))
    result = cursor.fetchall()
    cursor.close()
    db.close()
    try:
        return [Website(row['id'], user, row['name'], row['domain'], row['pythonanywhere_host'], row['pythonanywhere_username'], row['pythonanywhere_api_token']) for row in result][0]
    except IndexError:
        return None


@login_manager.user_loader
def load_user(user_id):
    user = get_user(user_id=user_id.split('+')[0])
    if user is not None:
        if user.password == user_id.split('+')[1]:
            return user
        else:
            return None
    else:
        return None


@app.route('/favicon.ico')
def favicon():
    return send_file('static/img/favicon.ico')


@app.route('/manifest.json')
def manifest():
    return send_file('static/manifest.json')


@app.route('/')
@login_required
def index():
    return render_template('index.html',
                           sites=get_user_websites(current_user),
                           version=version)


@app.route('/websites/<website_id>/', methods=['GET'])
@login_required
def manage_website(website_id):
    return render_template('website.html', website=get_website(current_user, website_id), len=len)


@app.route('/websites/<website_id>/reload/', methods=['POST'])
@login_required
def reload_website(website_id):
    website = get_website(current_user, website_id)
    if website is not None:
        status = website.reload_website()
        if status:
            return {'status': 'ok'}
        else:
            return {'status': 'error'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/enable/', methods=['POST'])
@login_required
def enable_website(website_id):
    website = get_website(current_user, website_id)
    if website is not None:
        status = website.enable_website()
        if status:
            return {'status': 'ok'}
        else:
            return {'status': 'error'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/disable/', methods=['POST'])
@login_required
def disable_website(website_id):
    website = get_website(current_user, website_id)
    if website is not None:
        status = website.disable_website()
        if status:
            return {'status': 'ok'}
        else:
            return {'status': 'error'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/', methods=['PUT'])
@login_required
def edit_website(website_id):
    r = request.json
    try:
        name = r['name']
        domain = r['domain']
        pythonanywhere_host = r['pythonanywhere_host']
        pythonanywhere_username = r['pythonanywhere_username']
        pythonanywhere_api_token = r['pythonanywhere_api_token']
    except KeyError:
        return {'status': 'data_required'}
    website = get_website(current_user, website_id)
    if website is not None:
        website.edit(name, domain, pythonanywhere_host,
                     pythonanywhere_username, pythonanywhere_api_token)
        return {'status': 'ok'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/', methods=['DELETE'])
@login_required
def delete_website(website_id):
    website = get_website(current_user, website_id)
    if website is not None:
        website.delete()
        return {'status': 'ok'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/update_password_settings/', methods=['PATCH'])
@login_required
def update_password_settings(website_id):
    r = request.get_json()
    try:
        enabled = r['enabled']
    except KeyError:
        return {'status': 'data_required'}
    if enabled:
        try:
            username = r['username']
            password = r['password']
        except IndexError:
            return {'status': 'data_required'}
    website = get_website(current_user, website_id)
    if website is not None:
        if enabled:
            status = website.update_password_settings(True, username, password)
        else:
            status = website.update_password_settings(False)
        if status:
            return {'status': 'ok'}
        else:
            return {'status': 'error'}
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/logs/')
@login_required
def list_logs(website_id):
    website = get_website(current_user, website_id)
    if website is not None:
        return website.list_logs()
    else:
        return {'status': 'website_not_found'}


@app.route('/websites/<website_id>/logs/<logs_name>/')
@login_required
def get_logs(website_id, logs_name):
    website = get_website(current_user, website_id)
    if website is not None:
        return website.get_logs(logs_name)
    else:
        return {'status': 'website_not_found'}


@app.route('/websites', methods=['POST'])
@login_required
def add_site():
    r = request.get_json()
    try:
        name = r['name']
        domain = r['domain']
        pythonanywhere_host = r['pythonanywhere_host']
        pythonanywhere_username = r['pythonanywhere_username']
        pythonanywhere_api_token = r['pythonanywhere_api_token']
    except KeyError:
        return {'status': 'data_required'}
    create_website(Website(None, current_user, name, domain,
                   pythonanywhere_host, pythonanywhere_username, pythonanywhere_api_token))
    return {'status': 'ok'}


@app.route('/account')
@login_required
def account():
    return render_template('account.html')


@app.route('/edit_profile', methods=['PUT'])
@login_required
def edit_profile():
    r = request.get_json()
    try:
        username = r['username']
        full_name = r['full_name']
        email = r['email']
    except KeyError:
        return {'status': 'data_required'}
    current_user.edit(username, full_name, email)
    return {'status': 'ok'}


@app.route('/change_password', methods=['PUT'])
@login_required
def change_password():
    r = request.get_json()
    try:
        password = r['password']
    except KeyError:
        return {'status': 'data_required'}
    user_id = current_user.user_id
    current_user.change_password(password)
    logout_user()
    login_user(get_user(user_id), remember=True)
    return {'status': 'ok'}


@app.route('/2fa', methods=['GET'])
@login_required
def status_2fa():
    if current_user.secret_2fa is not None:
        return {'status': 'enabled'}
    else:
        return {'status': 'disabled'}


@app.route('/2fa', methods=['POST'])
@login_required
def enable_2fa():
    r = request.get_json()
    try:
        secret = r['secret']
        otp = r['otp']
    except KeyError:
        return {'status': 'data_required'}
    totp = pyotp.TOTP(secret)
    if totp.verify(str(otp)):
        current_user.enable_2fa(secret)
        return {'status': 'ok'}
    else:
        return {'status': 'bad_otp'}


@app.route('/2fa', methods=['DELETE'])
@login_required
def disable_2fa():
    current_user.disable_2fa()
    return {'status': 'ok'}


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/login_user', methods=['POST'])
def user_login():
    r = request.get_json()
    try:
        username = r['username']
        password = r['password']
    except KeyError:
        return {'status': 'username_and_password_required'}
    try:
        otp = r['otp']
    except KeyError:
        otp = None
    if username.replace('_', '').replace('', '').isalnum():
        user = get_user(username=username)
        if user:
            if user.check_password(password):
                if user.secret_2fa is None:
                    login_user(user, remember=True)
                    return {'status': 'ok'}
                elif otp is None:
                    return {'status': 'otp_required'}
                else:
                    if user.check_otp(otp):
                        login_user(user, remember=True)
                        return {'status': 'ok'}
                    else:
                        return {'status': 'bad_otp'}
            else:
                return {'status': 'bad_credentials'}
        else:
            return {'status': 'bad_credentials'}
    return {'status': 'bad_credentials'}


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.errorhandler(401)
def unauthorized(e):
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(**configs['flask_server'])
