# -*- coding: utf-8 -*-
from techent import create_app
from techent.extensions import mongoengine, login
from techent.views.users import users
from techent.views.main import main
from techent.views.event import event
from techent import config
from techent.views.oauth import oauth

views = [
    (users, ''),
    (oauth, ''),
    (main, ''),
    (event, ''),
]
extensions = [
    mongoengine,
    login,
]

def app_factory(extensions=extensions,
                views=views,
                config=config):

    app = create_app(extensions=extensions,
                     modules=views,
                     config=config)
    return app
