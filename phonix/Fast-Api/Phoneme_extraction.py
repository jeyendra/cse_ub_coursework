# from __future__ import annotations

import pysolr
from fastapi import FastAPI
import json
import requests
import re
import copy

app = FastAPI()
Solr = pysolr.Solr("http://xlabk8s2.cse.buffalo.edu:30007/solr/phonemes")


@app.get("/api/word/{word}")
async def word_details(word):
    results = Solr.search('word:' + word, rows=100)
    return results.docs[0]


@app.get("/api/phoneme/")
async def phoneme_details(include: str = None, exclude: str = None, sort_parameter: str = None, sort_order: str = None):
    contain_query = '*:*'
    if include:
        phoneme_list = include.split(',')
        contain_query = ' AND '.join([f'phoneme:"{p}"' for p in phoneme_list])
    fq = []
    if exclude:
        exclude_list = exclude.split(',')
        for p in exclude_list:
            fq.append(f'-phoneme:"{p}"')

    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({contain_query}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    if fq:
        fq_query = ' AND '.join(fq)
        results = Solr.search(final_query, rows=100, **sort_params, **{"fq": fq_query})
    else:
        results = Solr.search(final_query, rows=100, **sort_params)
    print(len(results.docs))
    return results.docs


# uvicorn.run(app, host='0.0.0.0', port=8000)
def find_indices(input_str, target_letter):
    return [index for index, letter in enumerate(input_str) if
            letter == target_letter and index not in {0, len(input_str) - 1}]


@app.get("/api/phoneme_pos/")
async def get_phonemes_by_position(initial: str = '[A-Z].*', middle: str = '[A-Z].*', final: str = '[A-Z].*',
                                   sort_parameter: str = None, sort_order: str = None):
    initial_pos, middle_pos, final_pos = '[A-Z].*', '[A-Z].*', '[A-Z].*'
    if initial != "NA":
        initial_pos = initial + ".*"
    if middle != "NA":
        middle_pos = ',' + middle + ',.*'
    if final != "NA":
        final_pos = ',' + final
    contain_query = 'phoneme_str:/' + initial_pos + middle_pos + final_pos + '/'

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({contain_query}) {additional_conditions}'
    # print(contain_query)
    sort_params = {"sort": "freq desc"}

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=200, **sort_params)

    for doc in results.docs:
        middle_indices = find_indices(doc.get("phoneme"), middle)
        # print(middle_indices)
        doc['highlight_indices'] = middle_indices
        if initial != "NA":
            doc['highlight_indices'] = [0] + doc['highlight_indices']
        if final != "NA":
            doc['highlight_indices'] = doc['highlight_indices'] + [len(doc.get("phoneme")) - 1]
        # doc['middle_index'] = middle_indices
        # doc['final_index'] = len(doc.get("phoneme")) - 1

    return results.docs


@app.get("/api/minimal/")
async def minimal_details(phoneme1: str, phoneme2: str, length: str):
    vowelsound = False
    vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']
    if phoneme1 in vowels:
        vowelsound = True
    query = (f'(phoneme:"{phoneme1}" OR phoneme:"{phoneme2}") AND '
             f'phoneme_length:"{length}"')

    sort_params = {"sort": "freq desc"}
    results = Solr.search(query, rows=10000, **sort_params)
    data = results.docs
    print(len(data))
    words = []
    strings = []
    place = []
    manner = []
    voice = []
    phonemes = []
    heights = []
    base = []
    roundness = []
    len_dict = dict()
    for i in range(len(data)):
        strings.append(','.join(data[i]['phoneme']))
        words.append(data[i]['word'])
        phonemes.append(data[i]['phoneme'])
        place.append(data[i]['POA'])
        manner.append(data[i]['MOA'])
        voice.append(data[i]['VOA'])
        heights.append(data[i]['H'])
        base.append(data[i]['B'])
        roundness.append(data[i]['R'])
        if len(data[i]['phoneme']) not in len_dict:
            len_dict[len(data[i]['phoneme'])] = [i, i]
        else:
            len_dict[len(data[i]['phoneme'])][1] = i
    res = []
    lowerindex = len_dict[int(length)][0]
    upperindex = len_dict[int(length)][1] + 1
    print(lowerindex)
    print(upperindex)
    phoneme1_set = {}
    for i in range(lowerindex, upperindex):
        # print(i)
        arr = data[i]['phoneme']

        pattern = re.compile(f'.*{re.escape(phoneme1)}.*')
        for substring in arr:
            if pattern.match(substring):
                phoneme1_set[tuple(data[i]['phoneme'])] = i
    poa1, poa2, moa1, moa2, voa1, voa2 = None, None, None, None, None, None
    h1, h2, b1, b2, r1, r2 = None, None, None, None, None, None
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
                            minimal_dict = dict()
                            minimal_dict['word1'] = words[index]
                            minimal_dict['phoneme1'] = phonemes[index]
                            poa1 = place[index][returnIndex(phonemes[index], i['phoneme'])]
                            moa1 = manner[index][returnIndex(phonemes[index], i['phoneme'])]
                            voa1 = voice[index][returnIndex(phonemes[index], i['phoneme'])]
                            h1 = heights[index][returnIndex(phonemes[index], i['phoneme'])]
                            b1 = base[index][returnIndex(phonemes[index], i['phoneme'])]
                            r1 = roundness[index][returnIndex(phonemes[index], i['phoneme'])]

                            minimal_dict['word2'] = i['word']
                            minimal_dict['phoneme2'] = i['phoneme']
                            poa2 = i['POA'][returnIndex(phonemes[index], i['phoneme'])]
                            moa2 = i['MOA'][returnIndex(phonemes[index], i['phoneme'])]
                            voa2 = i['VOA'][returnIndex(phonemes[index], i['phoneme'])]
                            h2 = i['H'][returnIndex(phonemes[index], i['phoneme'])]
                            b2 = i['B'][returnIndex(phonemes[index], i['phoneme'])]
                            r2 = i['R'][returnIndex(phonemes[index], i['phoneme'])]
                            minimal_dict['diffIndex'] = returnIndex(phonemes[index], i['phoneme'])
                            res.append(minimal_dict)
                            # minimal_dict[words[index]] = i['word']
                        arr[x] = substring.replace(phoneme1, phoneme2)

    if vowelsound:
        temp = {'H1': h1, 'H2': h2, 'B1': b1, 'B2': b2, 'R1': r1, 'R2': r2}
    else:
        temp = {'POA1': poa1, 'MOA1': moa1, 'VOA1': voa1, 'POA2': poa2, 'MOA2': moa2, 'VOA2': voa2}
    res.append(temp)
    return res


def placeDiff(placeList1, placeList2):
    if (len(placeList1) != len(placeList2)):
        return False
    count = 0
    for i in range(min(len(placeList1), len(placeList2))):
        if (placeList1[i] != placeList2[i]):
            count += 1

    if count == 1:
        return True
    else:
        return False


def returnIndex(placeList1, placeList2):
    for i in range(min(len(placeList1), len(placeList2))):
        if (placeList1[i] != placeList2[i]):
            return i
    return -1


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


@app.get("/api/minimal_word/")
async def minimal_maximal_word(word: str):
    query = f'word:"{word}"'
    results = Solr.search(query, rows=100)
    if len(results) > 0:
        phoneme_length = results.docs[0].get("phoneme_length", None)
        query = f'phoneme_length:"{phoneme_length}"'
        results = Solr.search(query, rows=10000000)
        data = results.docs
        words = []
        strings = []
        place = []
        manner = []
        voice = []
        phonemes = []
        len_dict = dict()
        wordIndex = 0
        data.sort(key=lambda x: len(x['phoneme']))
        for i in range(len(data)):
            strings.append(','.join(data[i]['phoneme']))
            # print(isinstance(data[i]['word'],str))
            if word == data[i]['word']:
                wordIndex = i
            words.append(data[i]['word'])
            place.append(data[i]['POA'])
            manner.append(data[i]['MOA'])
            voice.append(data[i]['VOA'])
            phonemes.append(data[i]['phoneme'])
            if len(data[i]['phoneme']) not in len_dict:
                len_dict[len(data[i]['phoneme'])] = [i, i]
            else:
                len_dict[len(data[i]['phoneme'])][1] = i

        wordPhonemes = data[wordIndex]['phoneme']
        poaPhoneme = data[wordIndex]['POA']
        voaPhoneme = data[wordIndex]['VOA']
        moaPhoneme = data[wordIndex]['MOA']
        lowerindex = len_dict[phoneme_length][0]
        upperindex = len_dict[phoneme_length][1] + 1
        minimal_dict = {}
        maximal_dict = {}
        res = []
        temp = dict()
        temp['mainWord'] = word
        temp['mainPhoneme'] = wordPhonemes
        res.append(temp)
        for i in range(lowerindex, upperindex):
            arr = data[i]['phoneme']
            if placeDiff(arr, wordPhonemes):
                if (placeDiff(poaPhoneme, place[i]) and mannerDiff(moaPhoneme, manner[i])
                        and voiceDiff(voaPhoneme, voice[i])):
                    if word in maximal_dict:
                        temp = dict()
                        temp['type'] = 'maximal'
                        temp['phoneme'] = data[i]['phoneme']
                        temp['word'] = words[i]
                        temp['diffIndex'] = returnIndex(data[i]['phoneme'], wordPhonemes)
                        res.append(temp)
                        maximal_dict[word].append(words[i])
                    else:
                        temp = dict()
                        temp['type'] = 'maximal'
                        temp['phoneme'] = data[i]['phoneme']
                        temp['word'] = words[i]
                        temp['diffIndex'] = returnIndex(data[i]['phoneme'], wordPhonemes)
                        res.append(temp)
                        maximal_dict[word] = [words[i]]
                elif (placeDiff(poaPhoneme, place[i]) or mannerDiff(moaPhoneme, manner[i])
                      or voiceDiff(voaPhoneme, voice[i])):
                    if word in minimal_dict:
                        temp = dict()
                        temp['type'] = 'minimal'
                        temp['phoneme'] = data[i]['phoneme']
                        temp['word'] = words[i]
                        temp['diffIndex'] = returnIndex(data[i]['phoneme'], wordPhonemes)
                        res.append(temp)
                        minimal_dict[word].append(words[i])
                    else:
                        temp = dict()
                        temp['type'] = 'minimal'
                        temp['phoneme'] = data[i]['phoneme']
                        temp['word'] = words[i]
                        temp['diffIndex'] = returnIndex(data[i]['phoneme'], wordPhonemes)
                        res.append(temp)
                        minimal_dict[word] = [words[i]]

        return res
    else:
        return {"message": f"No matching word found for: {word}"}


def minimal_maximal_cat_helper(category: str, length: str):
    # print(category)
    # print(length)
    query = f'phoneme_length:"{length}" AND category:"{category}"'
    sort_params = {"sort": "freq desc"}
    results = Solr.search(query, rows=100000, **sort_params)
    # results = Solr.search(query, rows=100)
    if len(results) > 0:
        data = results.docs
        words = []
        strings = []
        place = []
        manner = []
        voice = []
        phonemes = []
        len_dict = dict()
        data.sort(key=lambda x: len(x['phoneme']))
        for i in range(len(data)):
            strings.append(','.join(data[i]['phoneme']))
            words.append(data[i]['word'])
            place.append(data[i]['POA'])
            manner.append(data[i]['MOA'])
            voice.append(data[i]['VOA'])
            phonemes.append(data[i]['phoneme'])
            if len(data[i]['phoneme']) not in len_dict:
                len_dict[len(data[i]['phoneme'])] = [i, i]
            else:
                len_dict[len(data[i]['phoneme'])][1] = i

        minimal_dict = {}
        maximal_dict = {}
        lowerindex = len_dict[int(length)][0]
        upperindex = len_dict[int(length)][1] + 1
        phoneme1_set = {}
        res = []

        category_phonemes = []
        for i in range(lowerindex, upperindex):
            arr = data[i]['phoneme']
            if category in data[i]['category']:
                phoneme1_set[tuple(data[i]['phoneme'])] = i
                category_phonemes.append(data[i]['phoneme'])
        for i in range(len(category_phonemes)):
            for j in range(i + 1, len(category_phonemes)):
                if placeDiff(category_phonemes[i], category_phonemes[j]):
                    index_i = phoneme1_set[tuple(category_phonemes[i])]
                    index_j = phoneme1_set[tuple(category_phonemes[j])]
                    if (placeDiff(place[index_i], place[index_j]) and mannerDiff(manner[index_i],
                                                                                 manner[index_j]) and voiceDiff(
                            voice[index_i], voice[index_j])):
                        if words[index_i] in maximal_dict:
                            temp = dict()
                            temp['type'] = 'maximal'
                            temp['phoneme1'] = phonemes[index_i]
                            temp['word1'] = words[index_i]
                            temp['phoneme2'] = phonemes[index_j]
                            temp['word2'] = words[index_j]
                            res.append(temp)
                            maximal_dict[words[index_i]].append(words[index_j])
                        else:
                            temp = dict()
                            temp['type'] = 'maximal'
                            temp['phoneme1'] = phonemes[index_i]
                            temp['word1'] = words[index_i]
                            temp['phoneme2'] = phonemes[index_j]
                            temp['word2'] = words[index_j]
                            res.append(temp)
                            maximal_dict[words[index_i]] = [words[index_j]]
                    elif (placeDiff(place[index_i], place[index_j]) or mannerDiff(manner[index_i],
                                                                                  manner[index_j]) or voiceDiff(
                            voice[index_i], voice[index_j])):
                        if words[index_i] in minimal_dict:
                            temp = dict()
                            temp['type'] = 'minimal'
                            temp['phoneme1'] = phonemes[index_i]
                            temp['word1'] = words[index_i]
                            temp['phoneme2'] = phonemes[index_j]
                            temp['word2'] = words[index_j]
                            res.append(temp)
                            minimal_dict[words[index_i]].append(words[index_j])
                        else:
                            temp = dict()
                            temp['type'] = 'minimal'
                            temp['phoneme1'] = phonemes[index_i]
                            temp['word1'] = words[index_i]
                            temp['phoneme2'] = phonemes[index_j]
                            temp['word2'] = words[index_j]
                            res.append(temp)
                            minimal_dict[words[index_i]] = [words[index_j]]
        return res
    else:
        return []


@app.get("/api/minimal_cat/")
async def get_minimal_maximal_cat(category: str):
    res = []
    for i in range(3, 20):
        if len(minimal_maximal_cat_helper(category, str(i))) != 0:
            res.append(minimal_maximal_cat_helper(category, str(i)))
    return res


@app.get("/api/poa/")
async def poa_details(poa: str = '[A-Z].*', moa: str = '[A-Z].*', voa: str = '[A-Z].*', height: str = '[A-Z].*',
                      back: str = '[A-Z].*', round: str = '[A-Z].*', sort_parameter: str = None,
                      sort_order: str = None):
    conditions = []

    if poa != "NA":
        conditions.append(f'POA:"{poa}"')
    if moa != "NA":
        conditions.append(f'MOA:"{moa}"')
    if voa != "NA":
        conditions.append(f'VOA:"{voa}"')
    if height != "NA":
        conditions.append(f'H:"{height}"')
    if back != "NA":
        conditions.append(f'B:"{back}"')
    if round != "NA":
        conditions.append(f'R:"{round}"')

    contain_query = '*:*'
    if conditions:
        contain_query = f'({" AND ".join(conditions)})'

    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({contain_query}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=100, **sort_params)
    print(len(results.docs))

    return results.docs


@app.get("/api/category/")
async def category_details(category: str = None, sort_parameter: str = None, sort_order: str = None):
    contain_query = '*:*'
    print(category)
    if category:
        contain_query = f'category:"{category}"'

    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({contain_query}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=100, **sort_params)
    print(len(results.docs))

    return results.docs


@app.get("/api/words_by_pattern/")
async def get_words_by_pattern(pattern: str, sort_parameter: str = None, sort_order: str = None):
    regex_pattern = ''.join(
        [f'[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]' if c == 'c' else f'[aeiouAEIOU]' for c in pattern])

    sort_params = {"sort": "freq desc"}

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    solr_query = f'word:/{regex_pattern}/ AND freq:[1 TO *] AND phoneme_length:[* TO 20]'

    results = Solr.search(solr_query, rows=200, **sort_params)
    print(len(results))
    return results.docs


@app.get("/api/words_consonant_cluster/")
async def get_words_by_cluster(cluster: str, sort_parameter: str = None, sort_order: str = None):
    regex_str = 'phoneme_str:/' + "(^|.*,)" + cluster + "($|,.*)" + '/'
    print(regex_str)
    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({regex_str}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=200, **sort_params, fl=['word', 'phoneme_str'])
    return results.docs



@app.get("/api/words_consonent_cluster/")
async def get_words_consonent_cluster(cluster: str, sort_parameter: str = None, sort_order: str = None):
    regex_str = 'phoneme_str:/' + ".+"+ cluster +"($|.)" + '/'

    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({regex_str}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=200, **sort_params, fl=['word','phoneme_str'])
    return results.docs


@app.get("/api/pos/")
async def part_of_speech_details(pos: str = None, sort_parameter: str = None, sort_order: str = None):
    contain_query = '*:*'
    print(pos)
    # Noun, VERB, PROPN, ADJ, Adverb, ADV
    if pos:
        contain_query = f'POS:"{pos}"'

    sort_params = {"sort": "freq desc"}

    additional_conditions = ' AND freq:[1 TO *] AND phoneme_length:[* TO 20]'
    final_query = f'({contain_query}) {additional_conditions}'

    if sort_parameter:
        sort_params = {"sort": f"{sort_parameter} desc"}
    if sort_order:
        sort_params = {"sort": f"freq {sort_order}"}
    if sort_parameter and sort_order:
        sort_params = {"sort": f"{sort_parameter} {sort_order}"}

    results = Solr.search(final_query, rows=100, **sort_params)
    print(len(results.docs))

    return results.docs


