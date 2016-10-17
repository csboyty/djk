# coding:utf-8

from flask import Blueprint, request, render_template
from flask_user import roles_required
from ...helpers.flask_helper import json_response
from ...models import Tag
from ...services import tag_service

bp = Blueprint('admin_tags', __name__, url_prefix='/admin/tags')


@bp.route("/", methods=['GET'])
@roles_required('admin')
def home_page():
    return render_template('backend/tagsMgr.html')


@bp.route('/list', methods=['GET'])
@roles_required('admin')
def list_tag():
    limit = int(request.args.get('iDisplayLength', '10'))
    offset = int(request.args.get('iDisplayStart', '0'))
    sEcho = request.args.get('sEcho')
    name = request.args.get('name', None)
    category = request.args.get('category', None)
    count, tags = tag_service.paginate_tag(offset, limit, name=name, category=category)
    return json_response(sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=tags)


@bp.route('/create', methods=['POST'])
def create_tag():
    tag = tag_service.create_tag(**request.json)
    return json_response(tag=tag)


@bp.route('/<int:tag_id>/update', methods=['POST'])
def update_tag(tag_id):
    tag = tag_service.update_tag(tag_id, **request.json)
    return json_response(tag=tag)
