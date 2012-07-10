# -*- coding: utf-8 -*-
"""
:Authors:
    - qweqwe
"""

from flask_mongoengine import MongoEngine


mongoengine = MongoEngine()
from techent.extensions.login_manager import login

__all__ = ['login', 'mongoengine']