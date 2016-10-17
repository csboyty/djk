# coding:utf-8

from sqlalchemy import event as sa_event
from ..core import db, FromCache, after_commit
from ..caching import regions
from ..helpers.sa_helper import JsonSerializableMixin


class Image(db.Model, JsonSerializableMixin):
    __tablename__ = 'images'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.Unicode(64), nullable=False)
    url = db.Column(db.Unicode(256), nullable=False)
    intro = db.Column(db.UnicodeText(), nullable=True)

    @classmethod
    def from_cache_by_id(cls, image_id):
        return Image.query.options(FromCache('model', 'image:%s' % image_id)). \
            filter(Image.id == image_id).first()

    def __eq__(self, other):
        if isinstance(other, Image) and other.id == self.id:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.id)

    def __repr__(self):
        return u'<Image(id=%d)>' % self.id


@sa_event.listens_for(Image, 'after_insert')
@sa_event.listens_for(Image, 'after_update')
@sa_event.listens_for(Image, 'after_delete')
def on_pattern(mapper, connection, image):
    def do_after_commit():
        regions['model'].delete('image:%s' % image.id)

    after_commit(do_after_commit)
