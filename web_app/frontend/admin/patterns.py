# coding:utf-8

from flask import Blueprint, request, render_template
from flask_user import roles_required
from ...helpers.flask_helper import json_response
from ...models import Pattern
from ...services import pattern_service

bp = Blueprint('admin_patterns', __name__, url_prefix='/admin/patterns')


@bp.route('/', methods=['GET'])
@roles_required('admin')
def home_page():
    return render_template('backend/patternsMgr.html')


@bp.route('/list', methods=['GET'])
def list_pattern():
    limit = int(request.args.get('iDisplayLength', '10'))
    offset = int(request.args.get('iDisplayStart', '0'))
    sEcho = request.args.get('sEcho')
    name = request.args.get('name', None)
    count, patterns = pattern_service.paginate_pattern(offset, limit, name=name)
    return json_response(sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=patterns)


@bp.route('/create', methods=['GET'])
@bp.route('/<int:pattern_id>/update', methods=['GET'])
def create_or_update_pattern_page(pattern_id=None):
    if pattern_id:
        pattern = Pattern.from_cache_by_id(pattern_id)
    else:
        pattern = {}

    return render_template('backend/patternUpdate.html', pattern=pattern)


@bp.route('/create', methods=['POST'])
def create_pattern():
    pattern = pattern_service.create_pattern(**request.json)
    return json_response(pattern=pattern)


@bp.route('/<int:pattern_id>/update', methods=['POST'])
def update_pattern(pattern_id):
    pattern = pattern_service.update_pattern(pattern_id, **request.json)
    return json_response(pattern=pattern)


@bp.route('/<int:pattern_id>/delete', methods=['POST'])
def delete_pattern(pattern_id):
    pattern_service.delete_pattern(pattern_id)
    return json_response(success=True)


@bp.route('/<int:pattern_id>', methods=['GET'])
def get_pattern(pattern_id):
    pattern = Pattern.from_cache_by_id(pattern_id)
    return json_response(pattern=pattern)
