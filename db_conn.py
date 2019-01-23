from typing import Optional, Dict, List, Any
from cloudant.client import Cloudant
from cloudant.document import Document
from cloudant.database import CouchDatabase
import os

import ibm_boto3
from ibm_botocore.client import Config
from ibm_botocore.exceptions import ClientError

import config


class DbConn():

  def __init__(self):
    # type: () -> None
    creds = config.db_creds
    print(creds)
    print("connecting to Db with username {0} and password {1}".format(os.getenv('DB_USERNAME'), os.getenv("DB_API_KEY")))
    if creds['username'] and creds['apikey']:
      self.client = Cloudant.iam(
        creds['username'], creds['apikey'], connect=True)
        # os.getenv('DB_USERNAME'), os.getenv("DB_API_KEY"), connect=True)
      self.db = self.init_db()
    else:
      print("No DB creds, not connected to DB")

  def init_db(self):
    # type: () -> None
    return self.client.create_database(config.db_name, throw_on_exists=False)

  def create_doc(self, doc):
    # type: (Dict[str, Any]) -> None
    self.db.create_document(doc)

  def get_doc(self, id):
    # type: (str) -> Optional[Document]
    return self.db.get(id)


if __name__ == '__main__':

  cos = ibm_boto3.client(
    "s3",
    aws_access_key_id=config.cos_creds['access_key_id'],
    aws_secret_access_key=config.cos_creds['secret_access_key'],
    ibm_service_instance_id=config.cos_creds['ibm_service_instance_id'],
    ibm_auth_endpoint=config.cos_creds['ibm_auth_endpoint'],
    endpoint_url=config.cos_creds['endpoint_url']
  )

  cos.put_bucket_cors(Bucket=config.COS_BUCKET, CORSConfiguration={
    "CORSRules": [
      {
        "AllowedOrigins": ["*"],
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET","PUT"],
        "MaxAgeSeconds": 3000
      }
    ]
  })

  print(cos.get_bucket_cors(Bucket=config.COS_BUCKET))
