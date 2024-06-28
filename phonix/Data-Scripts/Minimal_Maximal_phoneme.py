import re
import nltk
from nltk import WordNetLemmatizer
import json
import copy

lemma = WordNetLemmatizer()
phoneme = 'T'
f = open('final_data.json', 'r')
data = json.loads(f.read())
words = []
strings = []
place =[]
manner = []
voice = []


def placeDiffer(placeList1,placeList2):
  if(len(placeList1) != len(placeList2)):
    return True
  for i in range(min(len(placeList1),len(placeList2))):
    if(placeList1[i] != placeList2[i]):
        return True

  return False

def mannerDiffer(mannerList1,mannerList2):
  if(len(mannerList1) != len(mannerList2)):
    return True
  for i in range(min(len(mannerList1),len(mannerList2))):
    if(mannerList1[i] != mannerList2[i]):
        return True

  return False

def voiceDiffer(voiceList1,voiceList2):
  if(len(voiceList1) != len(voiceList2)):
    return True
  for i in range(min(len(voiceList1),len(voiceList2))):
    if(voiceList1[i] != voiceList2[i]):
        return True

  return False


len_dict = dict()
data.sort(key = lambda x : len(x['phoneme']))
# print(data[len(data)-1])
for i in range(len(data)):
    strings.append(','.join(data[i]['phoneme']))
    words.append(data[i]['word'])
    place.append(data[i]['POA'])
    manner.append(data[i]['MOA'])
    voice.append(data[i]['VOA'])
    if len(data[i]['phoneme']) not in len_dict:
        len_dict[len(data[i]['phoneme'])] = [i,i]
    else:
        len_dict[len(data[i]['phoneme'])][1] = i

# print(strings)
# print(words)
# print(place)
# print(manner)
# print(voice)


phonetics_data = dict()
maximal_data = dict()
for i in data:
    arr = i['phoneme']
    for k in range(len(arr)):
            tmp = arr[k]
        # if tmp != phoneme:
            arr[k] = "[A-Za-z]+[0-9]?"
            newRegex = ','.join(arr)
            pattern = re.compile('^'+newRegex+'$')
            find_list = []
            rootWord = set()
            rootWordMax = set()
            maximal_pairs = []
            for idx in range(len_dict[len(arr)][0], len_dict[len(arr)][1]+1):
                if pattern.match(strings[idx]):
                    rWord = lemma.lemmatize(words[idx])
                    if rWord not in rootWordMax:
                      if(placeDiffer(place[idx],i['POA']) and mannerDiffer(manner[idx],i['MOA']) and voiceDiffer(voice[idx],i['VOA'])):
                          # print("Maximal " + words[idx])
                          maximal_pairs.append(words[idx])
                          rootWordMax.add(rWord)
                    if rWord not in rootWord and rWord not in rootWordMax:
                          # print(words[idx])
                          find_list.append(words[idx])
                          rootWord.add(rWord)

            if len(find_list) > 2 :
                phonetics_data[newRegex] = [rootWord,find_list]

            if len(maximal_pairs) >= 1 :
                if i['word'] not in rootWordMax:
                  maximal_pairs.append(i['word'])
                maximal_data[newRegex] = [rootWordMax,maximal_pairs]

            arr[k] = tmp
# print(len(data))

for i in phonetics_data:
  print(phonetics_data[i][1])

print("Maximal Pairs")
for i in maximal_data:
  print(maximal_data[i][1])

with open('minimal_pair.json', 'w') as minimal_file:
    json.dump(phonetics_data, minimal_file, indent=2)
with open('maximal_pair.json', 'w') as maximal_file:
    json.dump(maximal_data, maximal_file, indent=2)




def FindMinimalMaximal(phoneme1, phoneme2, lenPhoneme):
    lemma = WordNetLemmatizer()
    phoneme = 'T'
    f = open('final_data.json', 'r')
    data = json.loads(f.read())
    words = []
    strings = []
    place =[]
    manner = []
    voice = []
    len_dict = dict()
    data.sort(key = lambda x : len(x['phoneme']))
    for i in range(len(data)):
        strings.append(','.join(data[i]['phoneme']))
        words.append(data[i]['word'])
        place.append(data[i]['POA'])
        manner.append(data[i]['MOA'])
        voice.append(data[i]['VOA'])
        if len(data[i]['phoneme']) not in len_dict:
            len_dict[len(data[i]['phoneme'])] = [i,i]
        else:
            len_dict[len(data[i]['phoneme'])][1] = i

    minimal_dict = {}
    maximal_dict = {}
    lowerindex = len_dict[lenPhoneme][0]
    upperindex = len_dict[lenPhoneme][1]+1
    phoneme1_set = {}
    for i in range(lowerindex, upperindex+1):
      arr = data[i]['phoneme']
      pattern = re.compile(f'.*{re.escape(phoneme1)}.*')
      for substring in arr:
        if pattern.match(substring):
            phoneme1_set[tuple(data[i]['phoneme'])] = i

    for i in data[lowerindex:upperindex]:
      pattern = re.compile(f'.*\\b{re.escape(phoneme2)}\\b.*')
      arr = copy.copy(i['phoneme'])
      if tuple(arr) not in phoneme1_set:
        for s in arr:
          if pattern.match(s):
            s_phoneme2 = copy.copy(arr)
            for x, substring in enumerate(arr):
              arr[x] = substring.replace(phoneme2, phoneme1)
              if tuple(arr) in phoneme1_set:
                index = phoneme1_set[tuple(arr)]
                minimal_dict[words[index]] = i['word']
              arr[x] = substring.replace(phoneme1, phoneme2)
    print(minimal_dict)



FindMinimalMaximal('P','T',4)

# To find the minimal pairs in a certain category when two phonemes are given
def FindMinimalMaximal(phoneme1, phoneme2, lenPhoneme,category):
    lemma = WordNetLemmatizer()
    phoneme = 'T'
    f = open('final_data.json', 'r')
    data = json.loads(f.read())
    words = []
    strings = []
    place =[]
    manner = []
    voice = []
    len_dict = dict()
    data.sort(key = lambda x : len(x['phoneme']))
    for i in range(len(data)):
        strings.append(','.join(data[i]['phoneme']))
        words.append(data[i]['word'])
        place.append(data[i]['POA'])
        manner.append(data[i]['MOA'])
        voice.append(data[i]['VOA'])
        if len(data[i]['phoneme']) not in len_dict:
            len_dict[len(data[i]['phoneme'])] = [i,i]
        else:
            len_dict[len(data[i]['phoneme'])][1] = i

    minimal_dict = {}
    maximal_dict = {}
    lowerindex = len_dict[lenPhoneme][0]
    upperindex = len_dict[lenPhoneme][1]+1
    phoneme1_set = {}
    for i in range(lowerindex, upperindex+1):
      arr = data[i]['phoneme']
      pattern = re.compile(f'.*{re.escape(phoneme1)}.*')
      for substring in arr:
        if pattern.match(substring) and category in data[i]['category']:
            phoneme1_set[tuple(data[i]['phoneme'])] = i

    # print(phoneme1_set)

    for i in data[lowerindex:upperindex]:
      pattern = re.compile(f'.*\\b{re.escape(phoneme2)}\\b.*')
      arr = copy.copy(i['phoneme'])
      if tuple(arr) not in phoneme1_set:
        for s in arr:
          if pattern.match(s) and category in i['category']:
            s_phoneme2 = copy.copy(arr)
            for x, substring in enumerate(arr):
              arr[x] = substring.replace(phoneme2, phoneme1)
              if tuple(arr) in phoneme1_set:
                index = phoneme1_set[tuple(arr)]
                minimal_dict[words[index]] = i['word']
              arr[x] = substring.replace(phoneme1, phoneme2)

    if len(minimal_dict) == 0:
      print("No Minimal Pairs in this Category")
    else:
      with open('P_T_animal.json', 'w') as json_file:
        json.dump(minimal_dict, json_file, indent=4)


FindMinimalMaximal('K','B',6,"animal")

#To find minimal and maximal pairs if a category and length are given
def placeDiff(placeList1,placeList2):
  if(len(placeList1) != len(placeList2)):
    return False
  count =0;
  for i in range(min(len(placeList1),len(placeList2))):
    if(placeList1[i] != placeList2[i]):
        count +=1;

  if count==1:
    return True
  else:
    return False


def mannerDiff(mannerList1,mannerList2):
  if(len(mannerList1) != len(mannerList2)):
    return False
  count =0;
  for i in range(min(len(mannerList1),len(mannerList2))):
    if(mannerList1[i] != mannerList2[i]):
        count +=1;

  if count==1 :
    return True
  else:
    return False

def voiceDiff(voiceList1,voiceList2):
  if(len(voiceList1) != len(voiceList2)):
    return True
  for i in range(min(len(voiceList1),len(voiceList2))):
    if(voiceList1[i] != voiceList2[i]):
        return True

  return False

# def MinOrMax(placeList1,placeList2,mannerList1,mannerList2, voiceList1, voiceList2):

def FindMinimalMaximal(lenPhoneme,category):
    lemma = WordNetLemmatizer()
    phoneme = 'T'
    f = open('final_data.json', 'r')
    data = json.loads(f.read())
    words = []
    strings = []
    place =[]
    manner = []
    voice = []
    len_dict = dict()
    data.sort(key = lambda x : len(x['phoneme']))
    for i in range(len(data)):
        strings.append(','.join(data[i]['phoneme']))
        words.append(data[i]['word'])
        place.append(data[i]['POA'])
        manner.append(data[i]['MOA'])
        voice.append(data[i]['VOA'])
        if len(data[i]['phoneme']) not in len_dict:
            len_dict[len(data[i]['phoneme'])] = [i,i]
        else:
            len_dict[len(data[i]['phoneme'])][1] = i

    minimal_dict = {}
    maximal_dict = {}
    lowerindex = len_dict[lenPhoneme][0]
    upperindex = len_dict[lenPhoneme][1]+1
    phoneme1_set = {}
    category_phonemes =[]
    for i in range(lowerindex, upperindex+1):
      arr = data[i]['phoneme']
      if category in data[i]['category']:
          phoneme1_set[tuple(data[i]['phoneme'])] = i
          category_phonemes.append(data[i]['phoneme'])


    for i in range(len(category_phonemes)):
      for j in range(i+1, len(category_phonemes)):
        if placeDiff(category_phonemes[i],category_phonemes[j]):
          index_i = phoneme1_set[tuple(category_phonemes[i])]
          index_j = phoneme1_set[tuple(category_phonemes[j])]
          if placeDiff(place[index_i],place[index_j]) and mannerDiff(manner[index_i],manner[index_j]) and voiceDiff(voice[index_i],voice[index_j]) :
            if words[index_i] in minimal_dict:
              maximal_dict[words[index_i]].append(words[index_j])
            else:
              maximal_dict[words[index_i]] = [words[index_j]]
          elif placeDiff(place[index_i],place[index_j]) or mannerDiff(manner[index_i],manner[index_j]) or voiceDiff(voice[index_i],voice[index_j]) :
            if words[index_i] in minimal_dict:
              minimal_dict[words[index_i]].append(words[index_j])
            else:
              minimal_dict[words[index_i]] = [words[index_j]]


    print("Minimal")
    print(minimal_dict)
    print()
    print("Maximal")
    print(maximal_dict)

    # if len(minimal_dict) == 0:
    #   print("No Minimal Pairs in this Category")
    # else:
    #   with open('P_T_animal.json', 'w') as json_file:
    #     json.dump(minimal_dict, json_file, indent=4)


FindMinimalMaximal(4,"fruit")

#Minimal and maximal pairs if a word is given

def placeDiff(placeList1, placeList2):
    if (len(placeList1) != len(placeList2)):
        return False
    count = 0;
    for i in range(min(len(placeList1), len(placeList2))):
        if (placeList1[i] != placeList2[i]):
            count += 1;

    if count == 1:
        return True
    else:
        return False


def mannerDiff(mannerList1, mannerList2):
    if (len(mannerList1) != len(mannerList2)):
        return False
    count = 0;
    for i in range(min(len(mannerList1), len(mannerList2))):
        if (mannerList1[i] != mannerList2[i]):
            count += 1;

    if count == 1:
        return True
    else:
        return False


def voiceDiff(voiceList1, voiceList2):
    if (len(voiceList1) != len(voiceList2)):
        return True
    for i in range(min(len(voiceList1), len(voiceList2))):
        if (voiceList1[i] != voiceList2[i]):
            return True

    return False


def FindMinimalMaximal(givenWord):
    lemma = WordNetLemmatizer()
    f = open('final_data.json', 'r')
    data = json.loads(f.read())
    words = []
    strings = []
    place = []
    manner = []
    voice = []
    len_dict = dict()
    wordIndex = 0
    data.sort(key=lambda x: len(x['phoneme']))
    for i in range(len(data)):
        strings.append(','.join(data[i]['phoneme']))
        # print(isinstance(data[i]['word'],str))
        if givenWord == data[i]['word']:
            wordIndex = i
        words.append(data[i]['word'])
        place.append(data[i]['POA'])
        manner.append(data[i]['MOA'])
        voice.append(data[i]['VOA'])
        if len(data[i]['phoneme']) not in len_dict:
            len_dict[len(data[i]['phoneme'])] = [i, i]
        else:
            len_dict[len(data[i]['phoneme'])][1] = i

    print(wordIndex)
    wordPhonemes = data[wordIndex]['phoneme']
    lenPhoneme = len(wordPhonemes)
    lowerindex = len_dict[lenPhoneme][0]
    upperindex = len_dict[lenPhoneme][1] + 1
    phoneme1_set = {}
    poaPhoneme = data[wordIndex]['POA']
    voaPhoneme = data[wordIndex]['VOA']
    moaPhoneme = data[wordIndex]['MOA']
    minimal_dict = {}
    maximal_dict = {}
    for i in range(lowerindex, upperindex + 1):
        arr = data[i]['phoneme']
        if placeDiff(arr, wordPhonemes):
            if placeDiff(poaPhoneme, place[i]) and mannerDiff(moaPhoneme, manner[i]) and voiceDiff(voaPhoneme,
                                                                                                   voice[i]):
                if givenWord in maximal_dict:
                    maximal_dict[givenWord].append(words[i])
                else:
                    maximal_dict[givenWord] = [words[i]]
            elif placeDiff(poaPhoneme, place[i]) or mannerDiff(moaPhoneme, manner[i]) or voiceDiff(voaPhoneme,
                                                                                                   voice[i]):
                if givenWord in minimal_dict:
                    minimal_dict[givenWord].append(words[i])
                else:
                    minimal_dict[givenWord] = [words[i]]

    print("Minimal")
    print(minimal_dict)
    print("Maximal")
    print(maximal_dict)

    # if len(minimal_dict) == 0:
    #   print("No Minimal Pairs in this Category")
    # else:
    #   with open('P_T_animal.json', 'w') as json_file:
    #     json.dump(minimal_dict, json_file, indent=4)


mystring = "bat"
FindMinimalMaximal(mystring)

