import json
import pysolr

# Todo write the function to add the data
def add_phoneme_data(word):
    return word


# loading the data
f = open("data.json", "r+")
data = json.loads(f.read())
f.close()
try:
    # for every word we call the dunction and add the data
    for i in data:
        i['phoneme_data'] = add_phoneme_data(i['word'])
    data = json.dumps(data)
    f = open('data.json', 'w')
    f.write(data)
    f.close()
except Exception as e:
    # exception handling to make sure we wont loose dats
    print(e)
