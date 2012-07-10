# -*- coding: utf-8 -*-
"""
:Authors:
    - qweqwe
"""

import logging
import sys
from logging.handlers import RotatingFileHandler
from flask import Flask

def create_app(extensions = None,
               modules=None,
               config=None,
               converters=None):
    app = Flask(__name__)

    # init url converters
    if converters:
        for key in converters.keys():
            app.url_map.converters[key] = converters[key]

    configure_app(app, config)
    configure_extensions(app, extensions)
    configure_modules(app, modules)
    #    configure_errorhandlers(app)
    configure_logging(app)

    return app

def configure_app(app, config):
    if config is not None:
        app.config.from_object(config)


def configure_modules(app, modules):
    for module, url_prefix in modules:
        app.register_blueprint(module, url_prefix=url_prefix)


def configure_extensions(app, exts):
    for ext in exts:
        ext.init_app(app)


def configure_logging(app):
    formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s '
                                  '[in %(pathname)s:%(lineno)d]')

    if app.debug or app.testing:
        stdout_handler = logging.StreamHandler(sys.__stdout__)
        stdout_handler.setLevel(logging.DEBUG)
        stdout_handler.setFormatter(formatter)
        app.logger.addHandler(stdout_handler)
        logging.getLogger('userspace').addHandler(stdout_handler)
        return

    debug_log = app.config['DEBUG_LOG']
    debug_file_handler = RotatingFileHandler(debug_log, maxBytes=100000,
                                             backupCount=10)
    debug_file_handler.setLevel(logging.DEBUG)
    debug_file_handler.setFormatter(formatter)
    app.logger.addHandler(debug_file_handler)

    error_log = app.config['ERROR_LOG']
    error_file_handler =  RotatingFileHandler(error_log, maxBytes=100000,
                                              backupCount=10)
    error_file_handler.setLevel(logging.WARNING)
    error_file_handler.setFormatter(formatter)
    app.logger.addHandler(error_file_handler)

