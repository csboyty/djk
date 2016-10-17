# coding:utf-8

from flask import Blueprint, request, render_template
from ...helpers.flask_helper import json_response
from ...models import Fixture, Tag, Pattern
from ...services import fixture_service

bp = Blueprint('user_search', __name__, url_prefix='/search')


@bp.route('/', methods=['GET'])
def search_page():
    tags_by_category = dict(
        [(category, Tag.get_cached_tags_by_category(category)) for category in Tag.all_categories()])
    patterns = Pattern.id_with_names()
    return render_template('frontend/database.html', tags_by_category=tags_by_category, patterns=patterns)


@bp.route('/do', methods=['GET'])
def do_search():
    tag_ids = request.args.getlist('tag')
    if tag_ids:
        tag_ids = map(int, tag_ids)

    pattern_ids = request.args.getlist('pattern')
    if pattern_ids:
        pattern_ids = map(int, pattern_ids)

    name = request.args.get('name')
    sort = request.args.get('sort')
    offset = int(request.args.get('offset', '0'))
    limit = int(request.args.get('limit', '10'))
    count, data = fixture_service.paginate_fixture(offset, limit, tag_ids=tag_ids, pattern_ids=pattern_ids, name=name,
                                                   sort=sort)
    fixtures = []
    for fixture, number_of_times in data:
        fixture_data = {'Fixture': fixture.__json__(include_keys=['tags', 'patterns']), 'number_of_times': number_of_times}
        fixtures.append(fixture_data)

    return json_response(count=count, results=fixtures)
