# coding:utf-8

from celery.utils.log import get_task_logger

from flask import current_app
import smtplib
import socket
from .factory import create_celery_app
from . import qinius
from .core import db, get_model

logger = get_task_logger(__name__)
celery_app = create_celery_app()


@celery_app.task(bind=True)
def send_email(self, recipient, subject, html_message, text_message):
    mail_engine = current_app.extensions.get('mail', None)
    if not mail_engine:
        logger.error(
            'Flask-Mail has not been initialized. Initialize Flask-Mail or disable USER_SEND_PASSWORD_CHANGED_EMAIL, USER_SEND_REGISTERED_EMAIL and USER_SEND_USERNAME_CHANGED_EMAIL')
        return

    from flask_mail import Message

    try:

        # Construct Flash-Mail message
        message = Message(subject, recipients=[recipient], html=html_message, body=text_message)
        mail_engine.send(message)

    # Print helpful error messages on exceptions
    except (socket.gaierror, socket.error) as e:
        logger.error('SMTP Connection error: Check your MAIL_HOSTNAME or MAIL_PORT settings.', e)
    except smtplib.SMTPAuthenticationError:
        logger.error('SMTP Authentication error: Check your MAIL_USERNAME and MAIL_PASSWORD settings.')
    except Exception as exc:
        logger.error("send_email error", exc)
        raise self.retry(exc=exc)


@celery_app.task(bind=True)
def thumbnail_image_with_width(self, model_name, model_id, prop_name, new_width=300):
    model = get_model(model_name)
    try:
        model_instance = db.session.query(model).get(model_id)
        if model_instance is not None and getattr(model_instance, prop_name, None):
            image_dict = getattr(model_instance, prop_name)
            image_url = image_dict['url']
            image_info = qinius.get_image_info(image_url)
            if image_info and 'height' in image_info and 'width' in image_info:
                height = image_info['height']
                width = image_info['width']
                new_height = new_width * height / width
                new_size = '%dx%d' % (new_width, new_height)
                qinius.mk_image_thumbnail(key_or_url=image_url, image_sizes=[new_size])
                last_dot = image_url.rindex('.')
                new_image_url = '%(prefix)s-%(image_size)s%(suffix)s' % {"prefix": image_url[:last_dot],
                                                                         "image_size": new_size,
                                                                         "suffix": image_url[last_dot:]}
                new_image_dict = {'image': new_image_url, 'width': new_width, 'height': new_height}
                setattr(model_instance, prop_name, new_image_dict)
                db.session.add(model_instance)
                db.session.commit()
    except Exception as exc:
        logger.error("thumbnail_image_with_width error, model_name:%s, model_id:%d, prop_name:%s, new_width%s" % (model_name, model_id, prop_name, new_width),
                     exc)
        raise self.retry(exc=exc)
