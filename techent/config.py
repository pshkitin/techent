# -*- coding: utf-8 -*-

import os.path as p

SECRET_KEY  = 'A0Zr98˙™£ª¶3yX R~XHH!jmMPC.s39 LWfk wN]LWX/,?RT'
MONGODB_DB  = 'techent'
DEBUG       = True
# path to the directory with original images
IMAGES_PATH = p.join(p.dirname(p.abspath(__file__)), 'static', 'images')
# path to the directory with resized images
THUMB_PATH  = p.join(p.dirname(p.abspath(__file__)), 'static', 'thumbnails')

GOOGLE_APP_ID = ""
GOOGLE_APP_SECRET = ""

try:
    from local_config import *
except ImportError:
    # no local config found
    pass