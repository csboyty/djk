# coding:utf-8

import datetime
from ..core import BaseService, after_commit, db
from ..models import Fixture, FixtureTag, FixturePattern, FixtureDownload


class FixtureService(BaseService):
    __model__ = Fixture

    def create_fixture(self, **kwargs):
        fixture = Fixture(name=kwargs.get('name'), intro=kwargs.get('intro'), profile=kwargs.get('profile'), attachment=kwargs.get('attachment'),
                          assets=kwargs.get('assets'), cover=kwargs.get('cover'))
        fixture._tags = [FixtureTag(tag_id=int(tag_id)) for tag_id in kwargs['tags']]
        fixture._patterns = [FixturePattern(pattern_id=int(pattern_id)) for pattern_id in kwargs['patterns']]
        self.save(fixture)
        db.session.add(FixtureDownload(fixture_id=fixture.id, number_of_times=0))
        return fixture

    def update_fixture(self, fixture_id, **kwargs):
        fixture = self.get_or_404(fixture_id)
        fixture.name = kwargs.get('name')
        fixture.intro = kwargs.get('intro')
        fixture.profile = kwargs.get('profile')
        fixture.attachment = kwargs.get('attachment')
        fixture.assets = kwargs.get('assets')
        fixture.cover = kwargs.get('cover')
        fixture._tags = [FixtureTag(fixture_id=fixture_id, tag_id=int(tag_id)) for tag_id in kwargs['tags']]
        fixture._patterns = [FixturePattern(fixture_id=fixture_id, pattern_id=int(pattern_id)) for pattern_id in kwargs['patterns']]
        fixture.update_at = datetime.datetime.utcnow()
        return self.save(fixture)

    def delete_fixture(self, fixture_id):
        fixture = self.get_or_404(fixture_id)
        return self.delete(fixture)

    def paginate_fixture(self, offset=0, limit=10, **kwargs):
        filters = []
        orders = [Fixture.create_at.desc()]
        query = db.session.query(Fixture, FixtureDownload.number_of_times).join(FixtureDownload, FixtureDownload.fixture_id == Fixture.id)
        if 'name' in kwargs and kwargs['name']:
            filters.append(Fixture.name.contains(kwargs['name']))
        if 'tag_ids' in kwargs and kwargs['tag_ids']:
            fixture_tags_subquery = FixtureTag.query. \
                with_entities(FixtureTag.fixture_id, db.func.array_agg(FixtureTag.tag_id).label('tag_ids')). \
                group_by(FixtureTag.fixture_id).subquery()
            query = query.join(fixture_tags_subquery, fixture_tags_subquery.c.fixture_id == Fixture.id)
            tag_ids_contains_clause = db.text('tag_ids @> :tag_ids', bindparams=[db.bindparam('tag_ids', kwargs['tag_ids'])])
            filters.append(tag_ids_contains_clause)
        if 'pattern_ids' in kwargs and kwargs['pattern_ids']:
            fixture_patterns_subquery = FixturePattern.query. \
                with_entites(FixturePattern.fixture_id, db.func.array_agg(FixturePattern.pattern_id).label('pattern_ids')). \
                group_by(FixturePattern.fixture_id).subquery()
            query = query.join(fixture_patterns_subquery, fixture_patterns_subquery.c.fixture_id == Fixture.id)
            pattern_ids_contains_clause = db.text('pattern_ids @> :pattern_ids', bindparams=[db.bindparam('pattern_ids', kwargs['pattern_ids'])])
            filters.append(pattern_ids_contains_clause)
        if 'sort' in kwargs and kwargs['sort'] == 'downloads':
            orders.append(FixtureDownload.number_of_times.desc())

        data = []
        count = query.with_entities(db.func.count(Fixture.id)).filter(*filters).scalar()
        if count:
            if offset is None and limit is None:
                data = query.filter(*filters).order_by(*orders).all()
            else:
                data = query.filter(*filters).order_by(*orders).offset(offset).limit(limit).all()

        return count, data


fixture_service = FixtureService()
