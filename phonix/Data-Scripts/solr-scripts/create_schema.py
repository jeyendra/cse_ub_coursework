from pysolr import Solr

solr = Solr('http://xlabk8s2.cse.buffalo.edu:30007/solr/phonemes')
field_definition = {
    "add-field-type": {
        "name": "int",
        "class": "solr.TrieIntField",
        "precisionStep": 0
    }
}
schema = {
    "add-field": [
        {
            'name': 'word',
            'type': 'string',
            'indexed': True,
            'multiValued': False
        },
        {
            'name': 'category',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'POS',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'phoneme',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'POA',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'MOA',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'VOA',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'H',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'B',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name': 'R',
            'type': 'string',
            'indexed': True,
            'multiValued': True
        },
        {
            'name' : 'freq',
            'type' : 'int',
            'indexed': True,
        },
    ]
}

import requests

head = {"Content-Type": "application/json"}
import  json
requests.post(f"http://xlabk8s2.cse.buffalo.edu:30007/solr/phonemes/schema", data=json.dumps(field_definition), headers=head)
resp = requests.post(f'http://xlabk8s2.cse.buffalo.edu:30007/solr/phonemes/schema', json=schema, headers=head)
print(resp)
