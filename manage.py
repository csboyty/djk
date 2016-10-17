# coding:utf-8

from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand

from web_app.core import db
from web_app.frontend import create_app

app = create_app()
migrate = Migrate(app, db)
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db)


manager.add_command('shell', Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    manager.run()
