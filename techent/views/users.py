# -*- coding: utf-8 -*-
from flask import Blueprint
from flask_login import logout_user

users = Blueprint('users', __name__)

@users.route('/logout')
def logout():
    logout_user()
