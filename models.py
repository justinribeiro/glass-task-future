"""
models.py

Models for App Engine datastore

"""
from google.appengine.ext import ndb

class UserProperties(ndb.Model):
    """Store whether a user wants email and/or weekend cards."""
    email = ndb.BooleanProperty(required=True)
    weekends = ndb.BooleanProperty(required=True)
    