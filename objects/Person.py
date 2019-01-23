from typing import Optional, Dict, List, Any
from cloudant.database import CouchDatabase
import uuid

from objects.PhotoEncoding import PhotoEncoding

class Person:

  def __init__(
    self,
    is_missing,             #type: bool
    is_reunited,            #type: bool
    reporting_org,          #type: str
    id=None,                #type: Optional[str]
    name=None,              #type: Optional[str]
    age=None,               #type: Optional[Tuple[int, int]]
    sex=None,               #type: Optional[str]
    found_at_location=None, #type: Optional[str]
    location=None,          #type: Optional[str]
    encodings=None          #type: Optional[List[PhotoEncoding]]
  ):
    # type: (...) -> None
    self.id = id
    if not id:
      self.id = Person.create_uuid()
    self._id = self.id
    self.is_missing = is_missing
    self.is_reunited = is_reunited
    self.reporting_org = reporting_org
    self.name = name
    self.age = age
    self.sex = sex
    self.found_at_location = found_at_location
    self.location = location
    self.type = "person"
    self.is_missing
    self.encodings = encodings
    

  @staticmethod
  def create_uuid():
    # type: () -> str
    return str(uuid.uuid4())

  @staticmethod
  def from_dict(data):
    # type: (Dict[str, Any]) -> Person
    return Person(
      is_missing=data.get('is_missing'),
      is_reunited=data.get('is_reunited'),
      reporting_org=data.get('reporting_org'),
      id=data.get('_id'),
      name=data.get('name'),
      age=data.get('age'),
      sex=data.get('sex'),
      found_at_location=data.get('found_at_location'),
      location=data.get('location'),
      encodings=[PhotoEncoding.from_dict(e) for e in data.get('encodings')]
      )

  def create(self, db):
    # type: (CouchDatabase) -> None
    db.create_document(data=vars(self))

  def set_encoding_urls(self):
    # type: () -> None
    for encoding in self.encodings:
      encoding.set_src_url()

  @staticmethod
  def get_all(db):
    # type: (CouchDatabase) -> List[Person]
    return_list = []  # type: List[Person]
    selector = {'type': {'$eq': 'person'}}
    resp = db.get_query_result(selector)
    for doc in resp:
      return_list.append(Person.from_dict(doc))
    return return_list

  @staticmethod
  def get_active_by_org(db, org_name):
    # type: (CouchDatabase, str) -> List[Person]
    return_list = []  # type: List[Person]
    selector = {'type': {'$eq': 'person'}, 'reporting_org': {'$eq': org_name}}
    resp = db.get_query_result(selector)
    for doc in resp:
      return_list.append(Person.from_dict(doc))
    return return_list
