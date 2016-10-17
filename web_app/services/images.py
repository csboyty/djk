# coding:utf-8

from ..core import BaseService
from ..models import Image


class ImageService(BaseService):
    __model__ = Image

    def create_image(self, **kwargs):
        image = Image(name=kwargs.get('name'), url=kwargs.get('url'), intro=kwargs.get('intro'))
        return self.save(image)

    def delete_image(self, image_id):
        image = self.get(image_id)
        self.delete(image)

    def paginate_image(self, offset=0, limit=10, **kwargs):
        filters = []
        if 'name' in kwargs and kwargs['name']:
            filters.append(Image.name.contains(kwargs['name']))
        return self.paginate_by(filters=filters, orders=[Image.id.desc()], offset=offset, limit=limit)


image_service = ImageService()
