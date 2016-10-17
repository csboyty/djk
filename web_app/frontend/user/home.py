# coding:utf-8

from flask import Blueprint, request, render_template
from ...models import Fixture, FixtureDownload

bp = Blueprint('home', __name__)


@bp.route("/", methods=['GET'])
def index_page():
    fixture_ids = Fixture.query.with_entities(Fixture.id). \
        join(FixtureDownload, FixtureDownload.fixture_id == Fixture.id). \
        order_by(FixtureDownload.number_of_times.desc()).limit(5).all()
    fixtures = [Fixture.from_cache_by_id(fixture_id) for (fixture_id,) in fixture_ids]

    return render_template('frontend/index.html', fixtures=fixtures)


@bp.route("/about", methods=['GET'])
def about_page():
    return render_template('frontend/about.html')
