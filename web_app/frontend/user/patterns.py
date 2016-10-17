# coding:utf-8

from flask import Blueprint, request, render_template
from ...models import Pattern

bp = Blueprint('user_patterns', __name__, url_prefix='/patterns')


@bp.route('/<int:pattern_id>', methods=['GET'])
def fixture_page(pattern_id):
    pattern = Pattern.from_cache_by_id(pattern_id)
    return render_template('frontend/patternDetail.html', pattern=pattern)


@bp.route('/<int:pattern_id>/download', methods=['GET'])
def download_pattern(pattern_id):
    pattern = Pattern.from_cache_by_id(pattern_id)
    pattern.increase_download()
    return render_template('frontend/patternDownload.html', download_url=pattern.attachment.get('url'))
