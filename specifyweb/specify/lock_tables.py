from contextlib import contextmanager
import logging
logger = logging.getLogger(__name__)

from django.db import connection

@contextmanager
def lock_tables(*tables):
    cursor = connection.cursor()
    if cursor.db.vendor != 'mysql':
        logger.warning("unable to lock tables")
        yield
    else:
        try:
            cursor.execute('lock tables %s write' % ','.join(tables))
            yield
        finally:
            cursor.execute('unlock tables')


