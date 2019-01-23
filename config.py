from dotenv import load_dotenv
import os
import logging
import json


load_dotenv(verbose=True, dotenv_path='./.envdev')


APP_PORT = 5000
try:
  APP_PORT = int(os.getenv("PORT", '5000'))
except ValueError:
  print("Port env var = %s" % os.getenv("PORT", 'Not found'))



GLOBAL_LOGGING_LEVEL = logging.DEBUG


db_creds = json.loads(
  os.getenv('VCAP_SERVICES', "{}")).get('cloudantNoSQLDB', [{}])[0].get('credentials',
    {
      'username': os.getenv('DB_USERNAME'),
      'apikey': os.getenv("DB_API_KEY")
    }
  )

MAX_DB_CONN = 1
DB_CONN_TIMEOUT = 10

db_name=os.getenv('DB_NAME', "testdb")

COS_BUCKET = os.getenv('COS_BUCKET')

cos_creds = {
  "access_key_id": os.getenv('COS_ACCESS_KEY_ID'),
  "secret_access_key": os.getenv('COS_SECRET_ACCESS_KEY'),
  "ibm_service_instance_id": os.getenv('COS_INSTANCE_ID'),
  "ibm_auth_endpoint": os.getenv('COS_AUTH_ENDPOINT'),
  "endpoint_url": os.getenv('COS_ENDPOINT')
}

UNIT_TEST = os.getenv("UNIT_TEST", "FALSE") == "TRUE"
