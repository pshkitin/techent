# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.join(os.path.realpath(os.path.dirname(__file__)), '../'))

from techent.app import app_factory
from werkzeug.wsgi import SharedDataMiddleware

if __name__ == '__main__':
    app = app_factory()
    app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
        '/':  os.path.join(os.path.dirname(__file__), 'static')
    })
    app.run(port=5002, debug=True)
