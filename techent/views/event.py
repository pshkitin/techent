# -*- coding: utf-8 -*-
from flask import Blueprint, request, redirect, url_for, render_template

from techent.forms import EventForm, CommentForm
from mongoengine.queryset import DoesNotExist
from techent.models import Event, Tag, Comment, User
from sets import Set
from flask_login import login_required, current_user
from bson.objectid import ObjectId
import datetime

event = Blueprint("event", __name__)

@event.route("/event", methods = ["GET", "POST"])
@login_required
def create_event():
    form = EventForm(request.form, csrf_enabled = False) 
    if form.validate_on_submit():
        tags = []
        if form.tags.data:
            tags = form.tags.data.split(",")
            store_tag_metainformation(tags)

        start_date = form.iso_date(form.start_date.data)
        end_date = form.iso_date(form.end_date.data)
        user_id = current_user.id
        user = User.objects.with_id(ObjectId(user_id))
        event = Event(author=user,
                        subject = form.subject.data,
                        start_date = start_date,
                        end_date = end_date,
                        description = form.description.data,
                        hosts = form.hosts.data,
                        tags = tags)
        if request.files[form.logo.name]:
            event.logo.put(request.files[form.logo.name])
        event.save()
        return redirect(url_for("main.frontpage"))
    return render_template("create_event.html", form = form)

def store_tag_metainformation(tag_names):
    for tag_name in tag_names:
        try:
            tag = Tag.objects.get(name = tag_name)
        except DoesNotExist:
            tag = Tag(name = tag_name, count = 0, related_tags = [])

        #Increment count of posts on the tag
        tag.count += 1
        related_tags = Set(tag_names)
        related_tags.remove(tag_name)
        tag.related_tags = list(Set(tag.related_tags) | (related_tags))

        tag.save()

@event.route('/event/<event_id>')
def show_event(event_id):
    event = Event.objects.with_id(ObjectId(event_id))
    return render_template("show_event.html", event = event)

@event.route('/event/<event_id>/comments', methods = ["POST"])
@login_required
def add_comment(event_id):
    form = CommentForm(request.form, csrf_enabled = False)
    event = Event.objects.with_id(event_id)
    if form.validate_on_submit():
        date = datetime.datetime.strptime(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"%Y-%m-%d %H:%M:%S")
        comment = Comment(text = form.comment.data, author = User.objects.with_id(ObjectId(current_user.id)), date = date)
        event.comments.append(comment)
        event.save()
    return redirect(url_for('event.show_event', event_id=event_id))
