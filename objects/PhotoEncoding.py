from typing import Optional, Dict, List, Any
from cloudant.database import CouchDatabase
import ibm_boto3
import uuid

import config


class Location():
  def __init__(self, lat, lng):
    self.lat = lat
    self.lng = lng

  def to_dict(self):
    return {
      'lat': self.lat,
      'lng': self.lng
    }


class PhotoEncoding:

  def __init__(
    self, encoding: List[float], src="", id:Optional[str]=None,
    person_id:Optional[str]=None, location:Optional[Location]=None,
    contactInfo:Optional[Dict[str, str]]=None,
    ngo:Optional[str]=None, missing=True) -> None:
    self.id = id
    if not id:
      self.id = PhotoEncoding.create_uuid()
    self._id = self.id
    self.encoding = encoding
    self.src = src
    self.person_id = person_id
    self.location = location
    self.type = "photoencoding"
    self.contactInfo = contactInfo
    self.ngoId = ngo
    self.missing = missing

  def set_src_url(self, cos: ibm_boto3.client) -> None:
    self.src = self.create_presigned_get_url(self.id, config.COS_BUCKET, cos)

  def get_post_url(self, cos: ibm_boto3.client) -> Dict[str, str]:
    return self.create_presigned_post_url(self.id, config.COS_BUCKET, cos)

  @staticmethod
  def create_presigned_get_url(id: str, bucket: str, cos: ibm_boto3.client) -> str:
    return cos.generate_presigned_url(
      'get_object',
      Params={'Bucket': bucket, 'Key': id})

  @staticmethod
  def create_uuid() -> str:
    return str(uuid.uuid4())

  @staticmethod
  def create_presigned_post_url(id: str, bucket: str, cos: ibm_boto3.client) -> Dict[str, str]:
    return cos.generate_presigned_url(
      'put_object',
      Params={'Bucket': bucket, 'Key': id, 'ContentType': 'image/jpeg'},
      HttpMethod="PUT"
    )

  @staticmethod
  def from_dict(data: Dict[str, Any]) -> 'PhotoEncoding':
    return PhotoEncoding(
      encoding=data.get('encoding'),
      src=data.get('src'),
      id=data.get('_id'),
      person_id=data.get('person_id'),
      location=data.get('location'),
      contactInfo=data.get('contactInfo'),
      ngo=data.get('ngoId'),
      missing=data.get('missing')
    )

  def create(self, db: CouchDatabase) -> None:
    db.create_document(data=vars(self))

  @staticmethod
  def get_all(db: CouchDatabase) -> List['PhotoEncoding']:
    return_list: List['PhotoEncoding'] = []
    selector = {'type': {'$eq': 'photoencoding'}}
    resp = db.get_query_result(selector)
    for doc in resp:
      return_list.append(PhotoEncoding.from_dict(doc))
    return return_list

  @staticmethod
  def get_all_missing(db: CouchDatabase) -> List['PhotoEncoding']:
    return_list: List['PhotoEncoding'] = []
    selector = {'type': {'$eq': 'photoencoding'}, 'missing': {'$eq': True}}
    resp = db.get_query_result(selector)
    for doc in resp:
      return_list.append(PhotoEncoding.from_dict(doc))
    return return_list

  @staticmethod
  def get_all_by_ngo(db: CouchDatabase, ngo: str) -> List['PhotoEncoding']:
    return_list: List['PhotoEncoding'] = []
    selector = {'$and': [
      {'type': {'$eq': 'photoencoding'}},
      {'ngoId': {'$eq': ngo}},
      {'missing': {'$eq': False}}
    ]}
    resp = db.get_query_result(selector)
    for doc in resp:
      return_list.append(PhotoEncoding.from_dict(doc))
    return return_list

  def to_dict(self) -> Dict[str, Any]:
    return {
      '_id': self.id,
      'encoding': self.encoding,
      'src': self.src,
      'person_id': self.person_id,
      'location': self.location.to_dict(),
      'ngoId': self.ngoId,
      'missing': self.missing
    }
