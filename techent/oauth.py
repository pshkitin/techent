# -*- coding: utf-8 -*-

from flask import  session
from techent.extensions.oauth import FlaskOAuth
import config as conf

oauth = FlaskOAuth()

google = oauth.remote_app('google',
    base_url          = 'https://www.googleapis.com/oauth2/v1/',
    request_token_url = None,
    authorize_url     = 'https://accounts.google.com/o/oauth2/auth',
    access_token_url  = 'https://accounts.google.com/o/oauth2/token',
    access_token_method='POST',
    access_token_params={'grant_type': 'authorization_code'},
    consumer_key      = conf.GOOGLE_APP_ID,
    consumer_secret   = conf.GOOGLE_APP_SECRET,
    request_token_params={'response_type': 'code',
                          'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                          'state': 5,
                          'access_type': 'offline'
                          }
)

@google.tokengetter
def get_google_token():
    return session.get('google_token')
