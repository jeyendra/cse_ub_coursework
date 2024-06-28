
import nltk
nltk.download('wordnet')

import json
import spacy
from nltk.corpus import wordnet as wn
import spacy
nlp = spacy.load("en_core_web_sm")

# Fetch POS from WordNet
def get_parts_of_speech_from_wordnet(word):
    synsets = wn.synsets(word)
    pos_tags = set(s.pos() for s in synsets)

    pos_mapping = {
        "n": "NOUN",
        "v": "VERB",
        "a": "ADJECTIVE",
        "s": "ADJECTIVE (satellite)",
        "r": "ADVERB"
    }

    return [pos_mapping[tag] for tag in pos_tags if tag in pos_mapping], "wordnet" if synsets else ([], None)

# Fetch POS from spaCy
def get_parts_of_speech_from_spacy(word):
    doc = nlp(word)
    return [token.pos_ for token in doc], "spacy"

def get_parts_of_speech(word):
    pos_from_wordnet, source = get_parts_of_speech_from_wordnet(word)
    if pos_from_wordnet:
        return pos_from_wordnet, source
    else:
        pos_from_spacy, source = get_parts_of_speech_from_spacy(word)
        return pos_from_spacy, source

with open("data.json", "r") as f:
    data = json.load(f)

try:
    count = 0
    print(len(data))
    for i in data:
        pos, source_of_pos = get_parts_of_speech(i['word'])
        i['POS'] = pos
        if 'source' not in i:
            i['source'] = {}
        if source_of_pos:
            i['source']['POS'] = source_of_pos
        count += 1
        if count % 10000 == 0:
            print("Done ", count)

    with open("data2.json", 'w') as fd:
        json.dump(data, fd, indent=2)
except Exception as e:
    print(e)