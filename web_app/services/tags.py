# coding:utf-8

from ..core import BaseService
from ..models import Tag


class TagService(BaseService):
    __model__ = Tag

    def create_tag(self, **kwargs):
        tag = Tag(name=kwargs.get('name'), category=kwargs.get('category'))
        return self.save(tag)

    def update_tag(self, tag_id, **kwargs):
        tag = self.get(tag_id)
        tag.name = kwargs.get('name')
        tag.category = kwargs.get('category')
        return self.save(tag)

    def paginate_tag(self, offset=0, limit=10, **kwargs):
        filters = []
        if 'name' in kwargs and kwargs['name']:
            filters.append(Tag.name.contains(kwargs['name']))
        if 'category' in kwargs and kwargs['category']:
            filters.append(Tag.category == kwargs['category'])

        return self.paginate_by(filters=filters, orders=[Tag.name.asc()], offset=offset, limit=limit)


tag_service = TagService()
