# coding:utf-8


import sqlalchemy as sa
from flask_user import UserMixin
from ..core import db, get_model, FromCache, regions, after_commit
from ..helpers.sa_helper import JsonSerializableMixin


class Account(db.Model, JsonSerializableMixin, UserMixin):
    __tablename__ = "accounts"

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.Unicode(64), unique=True)
    fullname = db.Column(db.Unicode(32), nullable=True)
    _password = db.Column("password", db.String(128))
    role = db.Column(db.String(16), default='user')
    active = db.Column(db.Boolean(), nullable=False, server_default='1')

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, pwd):
        self._password = pwd

    def has_roles(self, *requirements):
        for requirement in requirements:
            if isinstance(requirement, (list, tuple)):
                tuple_of_role_names = requirement
                if self.role in tuple_of_role_names:
                    return True
            else:
                role_name = requirement
                if role_name == self.role:
                    return True
        return False

    def __eq__(self, other):
        if isinstance(other, Account) and self.email == other.email:
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.email)

    def __repr__(self):
        return u"<Account(id=%s)>" % self.id


@sa.event.listens_for(Account, 'after_insert')
@sa.event.listens_for(Account, 'after_update')
@sa.event.listens_for(Account, 'before_delete')
def on_account(mapper, connection, account):
    def do_after_commit():
        regions['model'].delete('account:%d' % account.id)

    after_commit(do_after_commit)
