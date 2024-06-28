# Data-Scripts
This folder contains scripts related to data collection and organization.

## conceptnet_parsing_Unioning_words.ipynb

### Description

This script combines words from various sources, including the Webster dictionary, ConceptNet, CMUdict from NLTK, and WordNet. The goal is to create a unified dataset of words, filtering out words with special characters or numbers.

### Data Sources

1. Webster Dictionary (GitHub Link): [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary/blob/master/WebstersEnglishDictionary.txt)
2. ConceptNet
3. CMUdict (from NLTK)
4. WordNet

### Packages Used

- NLTK
- JSON

## Overview

The script starts with data from `data.json`, which is sourced from the Webster dictionary. Then, it adds data from ConceptNet by downloading the entire ConceptNet dataset in CSV format. The script filters and includes only the rows related to the 'IsA' relation, adding these words to the final dataset.

The NLTK library is utilized to include data from WordNet and CMUdict.

## Usage

To run the script, follow these steps:

1. Clone or download the Webster dictionary data from [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary/blob/master/WebstersEnglishDictionary.txt) and save it as `data.json`.
2. Download the ConceptNet dataset in CSV format and specify the file path in the script.
3. Execute the script to generate the unified dataset of words.
---

## Webster Scraping Part - Webster.py


This python script is designed to scrap the words  [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary/blob/master/WebstersEnglishDictionary.txt) used regular expressions and 
words that start with capital letters only

---

## Generating Phonemes using words - Add_PhoneticData.py

This python script is used to generate phonemes to a given word using speechbrain g2p model. [speechbrain-g2p](https://huggingface.co/speechbrain/soundchoice-g2p)

### Prerequisites 

Before using the script you need to have the following prerequisites:

- Speechbrain
- Transformes
- You can install both of them using pip install speechbrain, pip install transofmers

#### Citation for Speechbrain

```
@misc{speechbrain,
  title={{SpeechBrain}: A General-Purpose Speech Toolkit},
  author={Mirco Ravanelli and Titouan Parcollet and Peter Plantinga and Aku Rouhe and Samuele Cornell and Loren Lugosch and Cem Subakan and Nauman Dawalatabad and Abdelwahab Heba and Jianyuan Zhong and Ju-Chieh Chou and Sung-Lin Yeh and Szu-Wei Fu and Chien-Feng Liao and Elena Rastorgueva and François Grondin and William Aris and Hwidong Na and Yan Gao and Renato De Mori and Yoshua Bengio},
  year={2021},
  eprint={2106.04624},
  archivePrefix={arXiv},
  primaryClass={eess.AS},
  note={arXiv:2106.04624}
}
```

The soundchoice g2p paper on which this pretrained model is based 

```
@misc{ploujnikov2022soundchoice,
      title={SoundChoice: Grapheme-to-Phoneme Models with Semantic Disambiguation}, 
      author={Artem Ploujnikov and Mirco Ravanelli},
      year={2022},
      eprint={2207.13703},
      archivePrefix={arXiv},
      primaryClass={cs.SD}
}
```
---

## IPA to Articulation Data Conversion Script - Articulation.py


This Python script is designed to convert phoneme data from an input JSON file into IPA (International Phonetic Alphabet) symbols and lookup corresponding articulation information. It then saves the transformed data into a new JSON file.

### Prerequisites

Before using this script, you need to have the following prerequisites:

- Python 3.x
- Two JSON data files: "ipa_phoneme.json" and "Arti_data.json," containing IPA symbol mappings and articulation data, respectively.
- An input JSON data file, e.g., "final_data.json," containing word entries with a "phoneme" field.

### Usage

1. Ensure that you have all the prerequisites mentioned above.

2. Place the "ipa_phoneme.json," "Arti_data.json," and your input data file ("final_data.json") in the same directory as this script.

3. Run the script by executing the following command in your terminal:

   python script_name.py
---

## Parts of Speech Tagger - README
### Overview
This script is a Python utility for tagging parts of speech (POS) to words in a dataset. It utilizes two libraries: nltk for accessing WordNet and spacy for additional POS tagging. The script processes a JSON file containing words, adds POS tags, and outputs a modified JSON file with the added information.

#### Prerequisites
To run this script, you need Python installed on your system along with the following packages:

1. NLTK (Natural Language Toolkit)
2. spaCy
3. WordNet (accessible via NLTK)

##### Installation
###### Before running the script, install the required libraries using pip:

- bash
- Copy code
- pip install nltk spacy

###### After installing NLTK, download the WordNet dataset:

- python
- Copy code
- import nltk
- nltk.download('wordnet')
For spaCy, you need to download the small English model:

- bash
- Copy code
- python -m spacy download en_core_web_sm

## How to Use
1. Ensure you have a JSON file with a list of words. Each word should be a dictionary with at least a key named 'word'.
2. Update the script to point to your input JSON file at with open("data.json", "r") as f.
3. Run the script. It will process each word, tag it with parts of speech from either WordNet or spaCy, and output the results in a new JSON file.

### Functionality
1. get_parts_of_speech_from_wordnet(word): Fetches POS tags from WordNet for a given word.
2. get_parts_of_speech_from_spacy(word): Fetches POS tags from spaCy for a given word.
3. get_parts_of_speech(word): Determines POS tags using WordNet; if none found, uses spaCy.
4. The script reads a list of words from a JSON file, processes each word to find its POS tags, and appends this information along with the source of the POS (WordNet or spaCy) to each word entry.
5. It handles errors gracefully and prints the progress at intervals of every 10,000 words processed.
Output
6. The script outputs a JSON file (data2.json) with the original list of words, each augmented with POS tags and the source of these tags.

---

## File Structure of the Project:

# 1. Data Scripts
    a. Solr Scripts: Contains scripts for setting up Solr and defining the schema for the data.
    b. scraping-scripts: Scripts for scraping, parsing, and unioning data from various sources, including CMUdict, Webster, ConceptNet, WordNet, parts of speech, articulation, and minimal and maximal pairs.
# 2. Deployment Files: 
Configuration files and setup instructions
    a. FastAPI
    b. Frontend
    c. Node 
# 3. Documentation 
# 4. Fast-Api: 
APIs for all the features
# 5. Frontend: 
Source code for all UI pages.
