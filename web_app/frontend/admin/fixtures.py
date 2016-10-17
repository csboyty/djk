# coding:utf-8

from flask import Blueprint, request, render_template
from flask_user import roles_required
from ...helpers.flask_helper import json_response
from ...models import Fixture, Tag, Pattern
from ...services import fixture_service

bp = Blueprint('admin_fixtures', __name__, url_prefix='/admin/fixtures')


@bp.route('/', methods=['GET'])
@roles_required('admin')
def home_page():
    return render_template('backend/itemsMgr.html')


@bp.route('/list', methods=['GET'])
def list_pattern():
    limit = int(request.args.get('iDisplayLength', '10'))
    offset = int(request.args.get('iDisplayStart', '0'))
    sEcho = request.args.get('sEcho')
    name = request.args.get('name', None)
    count, fixtures = fixture_service.paginate_fixture(offset, limit, name=name)
    return json_response(sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=fixtures)


@bp.route('/create', methods=['GET'])
@bp.route('/<int:fixture_id>/update', methods=['GET'])
def create_or_update_pattern_page(fixture_id=None):
    if fixture_id:
        fixture = Fixture.from_cache_by_id(fixture_id)
    else:
        fixture = {}

    tags_by_category = dict([(category, Tag.get_cached_tags_by_category(category)) for category in Tag.all_categories()])
    patterns = Pattern.id_with_names()
    return render_template('backend/itemUpdate.html', fixture=fixture, tags_by_category=tags_by_category, patterns=patterns)


@bp.route('/create', methods=['POST'])
def create_fixture():
    fixture = fixture_service.create_fixture(**request.json)
    return json_response(fixture=fixture)


@bp.route('/<int:fixture_id>/update', methods=['POST'])
def update_fixture(fixture_id):
    fixture = fixture_service.update_fixture(fixture_id, **request.json)
    return json_response(fixture=fixture)


@bp.route('/<int:fixture_id>/delete', methods=['POST'])
def delete_fixture(fixture_id):
    fixture_service.delete_pattern(fixture_id)
    return json_response(success=True)


@bp.route('/<int:fixture_id>', methods=['GET'])
def get_fixture(fixture_id):
    fixture = Fixture.from_cache_by_id(fixture_id)
    return json_response(fixture=fixture)
