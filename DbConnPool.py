import queue
from flask import abort
from db_conn import DbConn
from app_util import get_logger

logger = get_logger('DbConnPool')

class DbConnPool:

  def __init__(self, max_conn, conn_timeout):
    # type: (int, int) -> None
    self.conn_timeout = conn_timeout
    self.dbq = queue.Queue(maxsize=max_conn) # type: Queue.Queue
    for _ in range(max_conn):
      self.dbq.put(DbConn())
    logger.info('Created %s Db connections' % max_conn)

  def get(self):
    # type: () -> DbClient
    logger.debug('Getting Connection from Db Pool')
    db_conn = None
    try:
      db_conn = self.dbq.get(block=True, timeout=self.conn_timeout)
    except queue.Empty:
      logger.error('Timeout while waiting for a db connection')
      abort(503)
    return db_conn

  def put(self, db_conn):
    # type: (DbClient) -> None
    logger.info('Returning Connection to pool')
    self.dbq.put(db_conn)
    logger.info('%s Connections in pool now' % self.dbq.qsize())
  