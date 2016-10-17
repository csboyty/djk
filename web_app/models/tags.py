# coding:utf-8

from sqlalchemy import event as sa_event
from ..core import db, FromCache, after_commit
from ..caching import regions
from ..helpers.sa_helper import JsonSerializableMixin


class Tag(db.Model, JsonSerializableMixin):
    __tablename__ = 'tags'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.Unicode(64), nullable=False)
    category = db.Column(db.Unicode(8), nullable=False)

    __table_args__ = (db.UniqueConstraint("name", "category"),)

    @classmethod
    def from_cache_by_id(cls, tag_id):
        return Tag.query.options(FromCache('model', 'tag:%s' % tag_id)). \
            filter(Tag.id == tag_id).first()

    @classmethod
    def get_cached_tags_by_category(cls, category):
        return Tag.query.options(FromCache('model', 'tag:%s' % category)). \
            filter(Tag.category == category).order_by(Tag.name.asc()).all()

    @classmethod
    def all_categories(cls):
        categories = Tag.query.options(FromCache('model', 'tag:all_categories')). \
            with_entities(Tag.category).all()
        return [category for (category,) in categories]

    def __eq__(self, other):
        if isinstance(other, Tag) and other.name == self.name and other.category == self.category:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.name) + hash(self.category)

    def __repr__(self):
        return u"<Tag(id=%d)>" % self.id


@sa_event.listens_for(Tag, 'after_insert')
@sa_event.listens_for(Tag, 'after_update')
@sa_event.listens_for(Tag, 'after_delete')
def on_tag(mapper, connection, tag):
    def do_after_commit():
        regions['model'].delete('tag:%s' % tag.id)
        regions['model'].delete('tag:%s' % tag.category)
        regions['model'].delete('tag:all_categories')

    after_commit(do_after_commit)


@sa_event.listens_for(Tag.category, 'set')
def on_tag_category(tag, oldvalue, value, initiator):
    if oldvalue != value:
        def do_after_commit():
            regions['model'].delete('tag:%s' % oldvalue)

        after_commit(do_after_commit)
