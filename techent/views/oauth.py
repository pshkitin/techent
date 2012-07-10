# -*- coding: utf-8 -*-
from functools import wraps
from flask.blueprints import Blueprint
from flask.globals import session, request
from flask.helpers import url_for, flash
from flask_login import login_user
from werkzeug.utils import redirect
from techent.models import User
from techent.oauth import google

oauth = Blueprint('oauth', __name__)

@oauth.route('/google/login')
def google_login():
    if session.get('google_token'):
        del session['google_token']
    session['next'] = session.get('next') or request.referrer or None
    return google.authorize(
        callback=url_for('oauth.google_oauth_authorized',
            _external=True))

def validate_resp(func):
    @wraps(func)
    def wrapper(resp):
        next_url = session.get('next') or url_for('main.frontpage')
        session['next'] = None
        if resp is None:
            flash('You denied the request to sign in.')
            return redirect(next_url)
        func(resp)
        flash('You were logged in successfully')
        return redirect(next_url)
    return wrapper

# Login with Google
@oauth.route('/google/callback')
@google.authorized_handler
@validate_resp
def google_oauth_authorized(resp):

    access_token = resp['access_token']
    refresh_token = resp.get('refresh_token')
    expires_in = resp['expires_in']

    session['google_token'] = (access_token, '')

    params = {
        'access_token': access_token,
    }

    me = google.get('userinfo', data=params)

    user_id = me.data.get('id')

    google_user = User.get(user_id=user_id)
    if not google_user:

        first_name = me.data.get('given_name')
        last_name = me.data.get('family_name')
        full_name = me.data.get('name')
        gender = me.data.get('gender')
        locale = me.data.get('locale')
        email = me.data.get('email')
        plus_link = me.data.get('link')
        avatar_url = me.data.get('picture')

        user = User(email=email, full_name=full_name, avatar_url=avatar_url)
        user.save()

        google_user = User(user_id=user_id, first_name=first_name, last_name=last_name,
            full_name=full_name, gender=gender, locale=locale, email=email, plus_link=plus_link, avatar_url=avatar_url,
            access_token=access_token, refresh_token=refresh_token, expires_in=expires_in, user=user)
        google_user.save()
    else:
        google_user.access_token = access_token

        if refresh_token:
            google_user.refresh_token = refresh_token

        google_user.expires_in = expires_in
        google_user.save()

        user = google_user.user

    login_user(user)