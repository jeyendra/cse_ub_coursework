import json
from speechbrain.pretrained import GraphemeToPhoneme
g2p = GraphemeToPhoneme.from_hparams("speechbrain/soundchoice-g2p")

# Todo write the function to add the data

def add_phoneme_data(word):
    key = word
    phonemes = g2p(word)
    return phonemes


# loading the data
f = open("data.json", "r+")
data = json.loads(f.read())

f.close()
try:
    # for every word we call the function and add the data
    count = 0
    print(len(data))
    for i in data:
        i['phoneme'] = add_phoneme_data(i['word'])
        count+=1
        if count % 10000 == 0:
            print("Done ", count)

    with open("data2.json", 'w') as fd:
        json.dump(data, fd, indent= 2)
    fd.close()
except Exception as e:
    # exception handling to make sure we wont loose dats
    print(e)
