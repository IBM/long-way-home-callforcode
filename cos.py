import ibm_boto3
from ibm_botocore.client import Config
from ibm_botocore.exceptions import ClientError
import json 

import config

cos = ibm_boto3.client(
  "s3",
  aws_access_key_id=config.cos_creds['access_key_id'],
  aws_secret_access_key=config.cos_creds['secret_access_key'],
  ibm_service_instance_id=config.cos_creds['ibm_service_instance_id'],
  ibm_auth_endpoint=config.cos_creds['ibm_auth_endpoint'],
  endpoint_url=config.cos_creds['endpoint_url']
)
models_bucket = 'long-way-home-models'
#cos.put_bucket_acl(ACL='public-read',Bucket=models_bucket)
print(json.dumps(cos.get_bucket_acl(Bucket=models_bucket)))
for obj in cos.list_objects(Bucket=models_bucket)['Contents']:
  #cos.put_object_acl(ACL='public-read', Bucket=models_bucket, Key=obj['Key'])
  # print cos.get_object_acl(Bucket=models_bucket, Key=obj['Key'])
  pass

cos.put_bucket_cors(Bucket=models_bucket, CORSConfiguration={
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET","PUT"],
      "MaxAgeSeconds": 3000
    }
  ]
})