# coding:utf-8

from ..core import BaseService
from ..models import Pattern


class PatternService(BaseService):
    __model__ = Pattern

    def create_pattern(self, **kwargs):
        pattern = Pattern(name=kwargs.get('name'), intro=kwargs.get('intro'), profile=kwargs.get('profile'), references=kwargs.get('references'),
                          attachment=kwargs.get('attachment'), assets=kwargs.get('assets'))
        return self.save(pattern)

    def update_pattern(self, pattern_id, **kwargs):
        pattern = self.get(pattern_id)
        pattern.name = kwargs.get('name')
        pattern.intro = kwargs.get('intro')
        pattern.profile = kwargs.get('profile')
        pattern.references = kwargs.get('references')
        pattern.attachment = kwargs.get('attachment')
        pattern.assets = kwargs.get('assets')
        return self.save(pattern)

    def delete_pattern(self, pattern_id):
        pattern = self.get_or_404(pattern_id)
        self.delete(pattern)

    def paginate_pattern(self, offset=0, limit=10, **kwargs):
        filters = []
        if 'name' in kwargs and kwargs['name']:
            filters.append(Pattern.name.contains(kwargs['name']))
        return self.paginate_by(filters=filters, orders=[Pattern.id.desc()], offset=offset, limit=limit)


pattern_service = PatternService()
