# import csv
# import re
# from nltk.stem import PorterStemmer
# from nltk.corpus import stopwords
#
# porter = PorterStemmer()
#
#
# def convert_string_to_tokens(string: str):
#     string = string.lower().strip()
#     string = re.sub(r"[^a-zA-Z0-9 ]", ' ', string)
#     string = re.sub(' +', ' ', string)
#     tokens = string.split(" ")
#     final_tokens = [porter.stem(token) for token in tokens if token not in stopwords.words('english') and token != '']
#     return final_tokens
#
#
# file_data = dict()
#
# with open("input_corpus.txt", "r") as file:
#     lines = csv.reader(file, delimiter='\t')
#     for line in lines:
#         print(line)
#         file_data[int(line[0])] = convert_string_to_tokens(line[1])
# file.close()
import pickle

tm = dict()
tm = {
	"ip":"34.130.232.182",
	"port": "9999",
	"name": "/execute_query"
}

f = open("project2_index_details.pickle", "wb")
pickle.dump(tm,f)
