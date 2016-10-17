# coding:utf-8

from flask import Blueprint, request, render_template
from flask_user import roles_required
from ...helpers.flask_helper import json_response
from ...models import Image
from ...services import image_service

bp = Blueprint('admin_images', __name__, url_prefix='/admin/images')


@bp.route('/', methods=['GET'])
@roles_required('admin')
def home_page():
    return render_template('backend/picturesMgr.html')


@bp.route('/list', methods=['GET'])
def list_image():
    limit = int(request.args.get('iDisplayLength', '10'))
    offset = int(request.args.get('iDisplayStart', '0'))
    sEcho = request.args.get('sEcho')
    name = request.args.get('name', None)
    count, images = image_service.paginate_image(offset, limit, name=name)
    return json_response(sEcho=sEcho, iTotalRecords=count, iTotalDisplayRecords=count, aaData=images)


@bp.route('/create', methods=['GET'])
def create_image_page():
    return render_template('backend/pictureUpdate.html')


@bp.route('/create', methods=['POST'])
def create_image():
    image = image_service.create_image(**request.json)
    return json_response(image=image)


@bp.route('/<int:image_id>/delete', methods=['POST'])
def delete_image(image_id):
    image_service.delete_image(image_id)
    return json_response(success=True)
