# -*- coding: utf-8 -*-

from bson.objectid import ObjectId
from flask_login import LoginManager
from flask import url_for, redirect
from techent.models import User

login = LoginManager()
login.login_view = "users.login"

@login.user_loader
def load_user(id):
    id = ObjectId(id)
    return User.objects.with_id(id)

@login.unauthorized_handler
def unauthorized():
    return redirect(url_for('main.frontpage'))

@login.token_loader
def token_loader(token):
    return User.get(auth_token=token)
