from flask import g
import logging
from datetime import datetime
import config

def get_logger(name):
  # type: (str) -> logging.Logger
  logging.basicConfig()
  logger = logging.getLogger(name)
  logger.setLevel(config.GLOBAL_LOGGING_LEVEL)
  ch = logging.StreamHandler()
  ch.setLevel(config.GLOBAL_LOGGING_LEVEL)
  formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
  ch.setFormatter(formatter)
#  logger.addHandler(ch)
  return logger

logger = get_logger('util')

def get_db_client(conn_pool, *args, **kws):
  logger.debug("Getting DB Connection")
  if 'db' not in g:
    logger.debug("Creating new DB connection")
    g.db = conn_pool.get()
  return g.db

def teardown_db(conn_pool):
  db = g.pop('db', None)
  if db is not None:
    conn_pool.put(db)