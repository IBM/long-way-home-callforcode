from flask import Flask, Response, request, abort
import json
import ibm_boto3
from ibm_botocore.client import Config
from ibm_botocore.exceptions import ClientError
import config
import app_util

from DbConnPool import DbConnPool
from objects.PhotoEncoding import PhotoEncoding
from objects.Person import Person

unit_testing = config.UNIT_TEST

static_folder = 'webapp/build'
db_conn_pool = DbConnPool(config.MAX_DB_CONN, config.DB_CONN_TIMEOUT)

cos = ibm_boto3.client(
  "s3",
  aws_access_key_id=config.cos_creds['access_key_id'],
  aws_secret_access_key=config.cos_creds['secret_access_key'],
  ibm_service_instance_id=config.cos_creds['ibm_service_instance_id'],
  ibm_auth_endpoint=config.cos_creds['ibm_auth_endpoint'],
  endpoint_url=config.cos_creds['endpoint_url']
)

app = Flask(__name__, static_url_path='', static_folder=static_folder)


@app.route('/', methods=['GET'])
def root():
    return app.send_static_file('index.html')


@app.route('/ngo', methods=['GET'])
def ngo():
    return app.send_static_file('index.html')


@app.route('/api/encoding', methods=['POST'])
def post_encoding():
  if not request.json or not request.json.get('encoding'):
    print("could not decode json")
    abort(400)
  encoding = request.json.get('encoding')
  person_id = request.json.get('personId')
  location = request.json.get('location')
  contactInfo = request.json.get('contactInfo')
  ngo_id = request.json.get('ngo')
  missing = request.json.get('missing', True)
  my_db_client = app_util.get_db_client(db_conn_pool)
  photo_encoding = PhotoEncoding(encoding, "", None, person_id, location, contactInfo=contactInfo, ngo=ngo_id, missing=missing)
  photo_encoding.set_src_url(cos)
  photo_encoding.create(my_db_client.db)
  return Response(response=json.dumps({'uploadUrl': photo_encoding.get_post_url(cos)}), status=200, content_type="application/json")


@app.route('/api/encoding/byngo', methods=['GET'])
def get_all_encodings_by_ngo():
  ngo = request.args.get('ngo')
  my_db_client = app_util.get_db_client(db_conn_pool)
  json_results = []
  for encoding in PhotoEncoding.get_all_by_ngo(my_db_client.db, ngo):
    encoding.set_src_url(cos)
    json_results.append(vars(encoding))
  return Response(response=json.dumps(json_results), status=200, content_type="application/json")


@app.route('/api/encoding/missing', methods=['GET'])
def get_all_encoding_missing():
  my_db_client = app_util.get_db_client(db_conn_pool)
  json_results = []
  for encoding in PhotoEncoding.get_all_missing(my_db_client.db):
    encoding.set_src_url(cos)
    json_results.append(vars(encoding))
  return Response(response=json.dumps(json_results), status=200, content_type="application/json")


@app.route('/api/person', methods=['POST'])
def post_person():
  if not request.json:
    print("could not decode json")
    abort(400)
  person_dict = request.json.get('person')
  if not person_dict or 'is_missing' not in person_dict or 'reporting_org' not in person_dict:
    abort(400)
  my_db_client = app_util.get_db_client(db_conn_pool)
  person = Person.from_dict(person_dict)


@app.route('/api/person/org', methods=['GET'])
def get_people_by_org():
  org_name = request.args.get('orgName')
  if not org_name:
    abort(400)
  people_list = Person.get_active_by_org(org_name)
  return_list = []
  for person in people_list:
    person.set_encoding_urls()
    return_list.append(vars(person))


@app.teardown_appcontext
def teardown(e=None):
  app_util.teardown_db(db_conn_pool)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=config.APP_PORT, threaded=True)
