import csv
import json
import math

from LinkedList import *
import re
from flask import Flask, request
import time
import nltk
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords

porter = PorterStemmer()


def fun(ele):
    return ele[1]


def create_copy(head):
    ans_head = Node(-1)
    tmp = head
    tmp1 = ans_head
    while tmp is not None:
        tmp1.next = tmp
        tmp1 = tmp1.next
        tmp1.tf_idf_score = tmp.tf_idf_score
        tmp = tmp.next
    return ans_head.next


def daat_and_merge(token_postings):
    ans = dict()
    num_of_comparisions = 0
    num_of_elements = 0
    tmp = token_postings[0][0].head
    for i in range(1, len(token_postings)):
        tmp = LinkedList(tmp).merge_without_skip(token_postings[i][0].head)
        num_of_comparisions += tmp[1]
        num_of_elements = tmp[2]
        tmp = tmp[0]
    ans["results"] = convert_linked_list_to_list(tmp)
    ans["num_docs"] = num_of_elements
    ans["num_comparisons"] = num_of_comparisions
    return [ans, tmp, num_of_elements, num_of_comparisions]


def daat_and_merge_with_skip(token_postings):
    ans = dict()
    num_of_comparisions = 0
    num_of_elements = 0
    tmp = token_postings[0][0].head
    for i in range(1, len(token_postings)):
        tmp = LinkedList(tmp).merge_with_skip(token_postings[i][0].head)
        num_of_comparisions += tmp[1]
        num_of_elements = tmp[2]
        tmp = tmp[0]
    ans["results"] = convert_linked_list_to_list(tmp)
    ans["num_docs"] = num_of_elements
    ans["num_comparisons"] = num_of_comparisions
    return [ans, tmp, num_of_elements, num_of_comparisions]


def daat_and(query, ans):
    num_of_comparisions = 0
    num_of_elements = 0
    tokens = convert_string_to_tokens(query)
    token_postings = list()
    for token in tokens:
        linked_list = inverted_idx.get(token)
        if linked_list is not None:
            token_postings.append([linked_list, linked_list.posting_list_length])
        else:
            ans["daatAndTfIdf"][query] = dict()
            ans["daatAndTfIdf"][query]["results"] = []
            ans["daatAndTfIdf"][query]["num_docs"] = 0
            ans["daatAndTfIdf"][query]["num_comparisons"] = 0
            ans["daatAndSkip"][query] = dict()
            ans["daatAndSkip"][query]["results"] = []
            ans["daatAndSkip"][query]["num_docs"] = 0
            ans["daatAndSkip"][query]["num_comparisons"] = 0
            ans["daatAnd"][query] = dict()
            ans["daatAnd"][query]["results"] = []
            ans["daatAnd"][query]["num_docs"] = 0
            ans["daatAnd"][query]["num_comparisons"] = 0
            ans["daatAndSkipTfIdf"][query] = dict()
            ans["daatAndSkipTfIdf"][query]["results"] = []
            ans["daatAndSkipTfIdf"][query]["num_docs"] = 0
            ans["daatAndSkipTfIdf"][query]["num_comparisons"] = 0
            return ans
    token_postings.sort(key=fun)
    daat_merge_output = daat_and_merge(token_postings)
    ans["daatAnd"][query] = daat_merge_output[0]

    sorted_ll = merge_sort(daat_merge_output[1])
    ans["daatAndTfIdf"][query] = dict()
    ans["daatAndTfIdf"][query]["results"] = convert_linked_list_to_list(sorted_ll)
    ans["daatAndTfIdf"][query]["num_docs"] = daat_merge_output[2]
    ans["daatAndTfIdf"][query]["num_comparisons"] = daat_merge_output[3]

    daat_merge_skip_output = daat_and_merge_with_skip(token_postings)
    ans["daatAndSkip"][query] = daat_merge_skip_output[0]

    sorted_ll = merge_sort(daat_merge_skip_output[1])
    # temp = sorted_ll
    # print("++++++")
    # while temp is not None:
    #     print(temp.tf_idf_score, temp.data)
    #     temp = temp.next

    ans["daatAndSkipTfIdf"][query] = dict()
    ans["daatAndSkipTfIdf"][query]["results"] = convert_linked_list_to_list(sorted_ll)
    ans["daatAndSkipTfIdf"][query]["num_docs"] = daat_merge_skip_output[2]
    ans["daatAndSkipTfIdf"][query]["num_comparisons"] = daat_merge_skip_output[3]


def calculate_tf_idf_score():
    global inverted_idx
    global token_frequency_in_docs
    for key in index:
        hd = index[key]
        node = hd.head
        while node is not None:
            node.tf_idf_score = (node.token_frequency_in_doc / doc_token_freq[node.data]) * (
                    TOTAL_NUMBER_OF_DOCS / hd.posting_list_length)
            node = node.next


def get_posting_skip_list(tokens):
    posting_list = dict()
    global inverted_idx
    for token in tokens:
        tmp = index.get(token)
        if tmp is None:
            posting_list[token] = list()
        else:
            posting_list[token] = convert_linked_list_to_skip_list(tmp.head)
    return posting_list


def get_posting_list(tokens):
    posting_list = dict()
    global inverted_idx
    for token in tokens:
        tmp = index.get(token)
        if tmp is None:
            posting_list[token] = list()
        else:
            posting_list[token] = convert_linked_list_to_list(tmp.head)
    return posting_list


def convert_string_to_tokens(string: str):
    string = string.lower().strip()
    string = re.sub(r"[^a-zA-Z0-9 ]", ' ', string)
    string = re.sub(' +', ' ', string)
    tokens = string.split(" ")
    final_tokens = [porter.stem(token) for token in tokens if token not in stopwords.words('english') and token != '']
    return final_tokens


def add_skip_pointers():
    global inverted_idx
    for token in index:
        len = int(round(math.sqrt(index[token].posting_list_length)))
        # print(token +  " *" +str(index[token].posting_list_length))
        first_node = index[token].head
        second_node = index[token].head
        while second_node is not None:
            i = 0
            while i < len and second_node is not None:
                i += 1
                second_node = second_node.next
            first_node.skip_pointer = second_node
            first_node = second_node


start_time = time.time()
# convert_string_to_tokens("...hey     hii... [~How! @are# $you% ^doing& *today\(). _I- +hope=| <everything> `is....""")

file_data = dict()
with open("input_corpus.txt", "r") as file:
    lines = csv.reader(file, delimiter='\t')
    for line in lines:
        # print(line)
        file_data[int(line[0])] = convert_string_to_tokens(line[1])
file.close()

TOTAL_NUMBER_OF_DOCS = len(file_data.keys())
token_frequency_in_docs = dict()
docs_ids = sorted(file_data.keys())

inverted_idx = dict()
last_node = dict()
for doc in docs_ids:
    # TOTAL_NUMBER_OF_TOKEN += len(file_data[doc])
    token_frequency_in_docs[doc] = len(file_data[doc])
    for token in file_data[doc]:
        if inverted_idx.get(token) is not None:
            if last_node[token].data == doc:
                last_node[token].token_frequency_in_doc += 1
                continue
            prev_node = last_node[token]
            node_new = Node(doc)
            prev_node.next = node_new
            last_node[token] = node_new
            inverted_idx[token].posting_list_length += 1
            last_node[token].token_frequency_in_doc += 1
        else:
            new_node = Node(doc)
            new_node.token_frequency_in_doc = 1
            inverted_idx[token] = LinkedList(new_node)
            last_node[token] = new_node
            inverted_idx[token].posting_list_length = 1

add_skip_pointers()
calculate_tf_idf_score()

app = Flask(__name__)


@app.route("/execute_query", methods=["POST"])
def hello_world():
    queries = request.json["queries"]
    ans = dict()
    ans["postingsList"] = dict()
    ans["daatAnd"] = dict()
    ans["postingsListSkip"] = dict()
    ans["daatAndTfIdf"] = dict()
    ans["daatAndSkip"] = dict()
    ans["daatAndSkipTfIdf"] = dict()
    for query in queries:
        tokens = convert_string_to_tokens(query)
        toke_post = get_posting_list(tokens)
        skip_list = get_posting_skip_list(tokens)
        for key in toke_post:
            ans["postingsList"][key] = toke_post[key]
            ans["postingsListSkip"][key] = skip_list[key]


        daat_and(query, ans)

    ans = json.dumps(ans)
    return ans


app.run(host='0.0.0.0', port=9999, debug=True)

end_time = time.time()
print("The time of execution of above program is :", (end_time - start_time) * 10 ** 3, "ms")

# 1->2->3->4->5->6->7->8->9
