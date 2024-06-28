import json
import nltk
from nltk.corpus import wordnet as wn

nltk.download('wordnet')

with open('data.json', 'r') as json_file:
    data = json.load(json_file)

for entry in data:
    if 'category' not in entry:
        entry['category'] = []

    if entry['source'].get('category') != 'conceptnet':
        synsets = wn.synsets(entry['word'])

        for synset in synsets:
            hypernyms = synset.hypernyms()
            for hypernym in hypernyms:
                entry['category'].append(hypernym.name())

    if 'category' not in entry['source']:
        entry['source']['category'] = "wordnet"

    if not entry['category']:
        entry['source']['category'] = ""

for entry in data:
    print(entry)

with open('data3.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
