# coding:utf-8

from flask import Blueprint, request, render_template
from ...models import Fixture

bp = Blueprint('user_fixtures', __name__, url_prefix='/fixtures')


@bp.route('/<int:fixture_id>', methods=['GET'])
def fixture_page(fixture_id):
    fixture = Fixture.from_cache_by_id(fixture_id)
    return render_template('frontend/single.html', fixture=fixture)


@bp.route('/<int:fixture_id>/download', methods=['GET'])
def download_fixture(fixture_id):
    fixture = Fixture.from_cache_by_id(fixture_id)
    fixture.increase_download()
    return render_template('frontend/fixtureDownload.html', download_url=fixture.attachment.get('url'))
