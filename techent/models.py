# -*- coding: utf-8 -*-
from datetime import datetime
import uuid
from hashlib import sha224
from flask_login import UserMixin
from mongoengine import *

class TimeStampMixin(object):
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def __init__(self, **values):
        super(TimeStampMixin, self).__init__(**values)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super(TimeStampMixin, self).save(*args, **kwargs)

    def update(self, **values):
        super(TimeStampMixin, self).update(set__updated_at=datetime.utcnow(), **values)

class User(TimeStampMixin, UserMixin, Document):
    user_id   = StringField(required=True, unique=True)
    first_name = StringField()
    last_name = StringField()
    full_name = StringField()
    gender = StringField()
    locale = StringField()
    email = EmailField()
    plus_link = URLField()
    avatar_url = URLField()

    access_token = StringField()
    refresh_token = StringField()
    expires_in = IntField()

    meta = {'collection': 'users'}

    def generate_auth_tokens(self):
        """
        Generates unique auth_token, sha256 hash of which is used to
        authenticate users by cookie
        """
        #: temporary auth token
        self.auth_token= int(sha224(str(uuid.uuid4())).hexdigest(), 16)
        #: persistent auth hash
        self.auth_hash = sha224(self.auth_token).hexdigest()

    @classmethod
    def get(cls, email=None, auth_token=None, user_id=None):
        if email:
            return cls.objects(email=email).first()
        if auth_token:
            return cls.objects(auth_hash=sha224(auth_token).hexdigest()).first()
        if user_id:
            return User.objects(id=user_id).first()

    ### Flask-Login methods:

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def get_auth_token(self):
        """
        Returns an authentication token (as unicode) for the user. The auth token
        should uniquely identify the user, and preferably not be guessable by
        public information about the user such as their UID and name - nor should
        it expose such information.
        """
        self.generate_auth_tokens()
        self.save()
        return self.auth_token

    @classmethod
    def find(cls, ids=None):
        if ids:
            return cls.objects(id__in=ids)

class Tag(Document):
    name = StringField(required = True, unique = True)
    count = IntField(required = True)
    related_tags = ListField(StringField()) # all related tags should be stored here

    meta = {
        "collection": "tags"
    }

class Event(TimeStampMixin, Document):
    author = ReferenceField(User)
    subject = StringField(required = True)
    logo = ImageField() 
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    description = StringField()
    location = GeoPointField()
    tags = ListField(StringField())
    time_zone = FloatField() # it's offset from utc in seconds

    meta = {
            "collection": "events"
        }