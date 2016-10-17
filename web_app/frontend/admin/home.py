# coding:utf-8

from flask import Blueprint, request, render_template
from flask_user import roles_required

bp = Blueprint('admin_home', __name__, url_prefix='/admin/home')


@bp.route("/", methods=['GET'])
@roles_required('admin')
def home_page():
    return render_template('backend/home.html')
