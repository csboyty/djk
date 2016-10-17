# coding:utf-8

from sqlalchemy import event as sa_event
from ..core import db, FromCache, after_commit
from ..caching import regions
from ..helpers.sa_helper import JsonSerializableMixin
from sqlalchemy.dialects.postgresql import JSON


class Pattern(db.Model, JsonSerializableMixin):
    __tablename__ = 'patterns'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.Unicode(), unique=True, nullable=False)
    intro = db.Column(db.UnicodeText(), nullable=True)
    profile = db.Column(db.Unicode(256), nullable=False)
    references = db.Column(JSON())
    attachment = db.Column(JSON())
    assets = db.Column(JSON())

    @classmethod
    def from_cache_by_id(cls, pattern_id):
        return Pattern.query.options(FromCache('model', 'pattern:%s' % pattern_id)). \
            filter(Pattern.id == pattern_id).first()

    @classmethod
    def id_with_names(cls):
        return [dict(id=id, name=name) for (id, name) in
                Pattern.query.options(FromCache('model', 'pattern:id_with_names')).with_entities(Pattern.id, Pattern.name).order_by(Pattern.name.asc()).all()]

    @property
    def download_times(self):
        return db.session.query(PatternDownload).with_entities(PatternDownload.number_of_times). \
            filter(PatternDownload.fixture_id == self.id).scalar()

    def increase_download(self):
        PatternDownload.query.filter(PatternDownload.pattern_id == self.id). \
            update({PatternDownload.number_of_times: PatternDownload.number_of_times + 1}, synchronize_session=False)

    def __eq__(self, other):
        if isinstance(other, Pattern) and other.name == self.name:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.name)

    def __repr__(self):
        return '<Pattern<id=%d>>' % self.id


class PatternDownload(db.Model):
    __tablename__ = 'pattern_download'

    pattern_id = db.Column(db.Integer(), db.ForeignKey('patterns.id', ondelete='cascade'), primary_key=True)
    number_of_times = db.Column(db.Integer(), default=0)

    def __eq__(self, other):
        if isinstance(other, PatternDownload) and other.pattern_id == self.pattern_id:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.pattern_id)

    def __repr__(self):
        return '<PatternDownload<pattern_id=%d>>' % self.pattern_id


@sa_event.listens_for(Pattern, 'after_insert')
@sa_event.listens_for(Pattern, 'after_update')
@sa_event.listens_for(Pattern, 'after_delete')
def on_pattern(mapper, connection, pattern):
    def do_after_commit():
        regions['model'].delete('pattern:%s' % pattern.id)
        regions['model'].delete('pattern:id_with_names')

    after_commit(do_after_commit)
