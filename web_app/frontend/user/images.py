# coding:utf-8

from flask import Blueprint, request, render_template
from ...services import image_service
from ...helpers.flask_helper import json_response

bp = Blueprint('user_images', __name__, url_prefix='/images')


@bp.route('/', methods=['GET'])
def image_page():
    count, images = image_service.paginate_image(0, 10)
    return render_template('frontend/images.html', images=images, count=count)


@bp.route('/list', methods=['GET'])
def list_image():
    offset = int(request.args.get('offset', '0'))
    limit = int(request.args.get('limit', '10'))
    count, images = image_service.paginate_image(offset, limit)
    return json_response(count=count, results=images)
