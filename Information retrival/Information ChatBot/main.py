from textblob import TextBlob
from flask import Flask, request, render_template
import urllib.parse
import requests
from better_profanity import profanity
import pickle

# nltk.download('punkt')
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('corpus')
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize


model_dtc = pickle.load(open('dtc_classifier1.pkl', 'rb'))

max_min_rel = dict()
max_min_rel['Healthcare'] = [99, 0]
max_min_rel['Technology'] = [99, 0]
max_min_rel['Politics'] = [99, 0]
max_min_rel['Environment'] = [99, 0]

health_q = 0
politics_q = 0
education_q = 0
technology_q = 0
chit_chat = 0
no_results = 0
environment_q = 0

app = Flask(__name__)
core = "p4"
chit_chat_core = 'p4_chitchat'
ip_addr = "104.197.21.102"
port = "8983"


# def cosinesimilarity(X, Y):
#     # tokenization
#     X_list = word_tokenize(X)
#     Y_list = word_tokenize(Y)
#
#     # sw contains the list of stopwords
#     sw = stopwords.words('english')
#     l1 = [];
#     l2 = []
#
#     # remove stop words from the string
#     X_set = {w for w in X_list if not w in sw}
#     Y_set = {w for w in Y_list if not w in sw}
#
#     # form a set containing keywords of both strings
#     rvector = X_set.union(Y_set)
#     for w in rvector:
#         if w in X_set:
#             l1.append(1)  # create a vector
#         else:
#             l1.append(0)
#         if w in Y_set:
#             l2.append(1)
#         else:
#             l2.append(0)
#     c = 0
#     for i in range(len(rvector)):
#         c += l1[i] * l2[i]
#     cosine = c / float((sum(l1) * sum(l2)) ** 0.5)
#     return cosine


def detect_chit_chat(query):
    ip = [query]
    if model_dtc.predict(ip)[0] == 0:
        return True
    else:
        return False


queries_scores = []


def return_chit_chat(query):
    url = 'http://' + ip_addr + ":8983/solr/" + chit_chat_core + '/select?q.op=OR&q={!dismax}(' + urllib.parse.quote(
        query) + ')&qf=Question&fl=Answer,score'
    print(url)
    op = requests.get(url)
    print(len(op.json()['response']['docs']))
    if len(op.json()['response']['docs']) == 0:
        return "##NOT_FOUND##"
    if op.json()['response']['docs'][0]['score'] < 2:
        return "##NOT_FOUND##"
    global queries_scores
    queries_scores.append([query, op.json()['response']['docs'][0]['score']])
    return op.json()['response']['docs'][0]['Answer']


@app.route('/chatbot')
def hello():
    correction = False
    global environment_q
    global health_q
    global politics_q
    global education_q
    global technology_q
    global chit_chat
    global no_results
    global max_min_rel
    global queries_scores
    topic = request.args["topic"]
    if request.args["topic"] == "Politics":
        politics_q += 1
        topic = "politics"

    query = request.args["query"]
    corrected_query = TextBlob(query)
    corrected_query = str(corrected_query.correct())
    if corrected_query != query:
        correction = True
        query = corrected_query
    if detect_chit_chat(query):
        res = return_chit_chat(query)
        if res != "##NOT_FOUND##":
            chit_chat += 1
            return res

    solr_op = []
    url = ""
    if request.args["topic"] == "All":
        url = 'http://' + ip_addr + ":8983/solr/" + core + '/select?q.op=OR&q={!dismax}(' + urllib.parse.quote(
            query) + ')&qf=parent_body+selftext&%20fl%20=parent_body,topic,selftext,' \
                     'score&rows=10'
    else:
        url = 'http://' + ip_addr + ":8983/solr/" + core + '/select?q.op=OR&q={!dismax}(' + urllib.parse.quote(
            query) + ')&qf=parent_body+selftext&%20fl%20=parent_body,topic,selftext,' \
                     'score&facet=on&facet.field=topic&fq=topic:' + \
              topic + '&rows=10'
    print(url)
    op = requests.get(url)
    for i in op.json()['response']['docs']:
        if 'selftext' in i.keys():
            solr_op.append([i['selftext'], i['score']])
        if 'parent_body' in i.keys():
            solr_op.append([i['parent_body'], i['score']])

    solr_op.sort(key=lambda x: x[1], reverse=True)
    # print(solr_op)
    if len(solr_op) == 0 or solr_op[0][1] < 3.5:
        no_results += 1
        if len(solr_op) != 0:
            queries_scores.append([query, solr_op[0][1]])
        else:
            queries_scores.append([query, 0])
        return "i didnt understand"
    if request.args["topic"] == "Healthcare":
        health_q += 1
        if solr_op[0][1] < max_min_rel["Healthcare"][0]:
            max_min_rel["Healthcare"][0] = solr_op[0][1]
        if solr_op[0][1] > max_min_rel["Healthcare"][1]:
            max_min_rel["Healthcare"][1] = solr_op[0][1]
    elif request.args["topic"] == "Environment":
        environment_q += 1
        if solr_op[0][1] < max_min_rel["Environment"][0]:
            max_min_rel["Environment"][0] = solr_op[0][1]
        if solr_op[0][1] > max_min_rel["Environment"][1]:
            max_min_rel["Environment"][1] = solr_op[0][1]
    elif request.args["topic"] == "Technology":
        technology_q += 1
        if solr_op[0][1] < max_min_rel["Technology"][0]:
            max_min_rel["Technology"][0] = solr_op[0][1]
        if solr_op[0][1] > max_min_rel["Technology"][1]:
            max_min_rel["Technology"][1] = solr_op[0][1]
    elif request.args["topic"] == "Politics":
        if solr_op[0][1] < max_min_rel["Politics"][0]:
            max_min_rel["Politics"][0] = solr_op[0][1]
        if solr_op[0][1] > max_min_rel["Politics"][1]:
            max_min_rel["Politics"][1] = solr_op[0][1]
    queries_scores.append([query, solr_op[0][1]])
    output = profanity.censor(solr_op[0][0], '')
    if correction:
        output = corrected_query + '\n' + output
    return output


@app.route('/')
def render_html():
    return render_template("index.html")


@app.route('/analyse')
def analyse():
    global max_min_rel
    global queries_scores
    topic_q = dict()
    topic_q['politics'] = politics_q
    topic_q['technology'] = technology_q
    topic_q['Environment'] = environment_q
    topic_q['healthcare'] = health_q
    topic_q['chitchat'] = chit_chat
    topic_q['no results'] = no_results
    min_max_data = list()
    for i in max_min_rel:
        min_max_data.append([i, max_min_rel[i][1], max_min_rel[i][0]])

    line_data = list()
    score_data = queries_scores
    if len(queries_scores) > 10:
        score_data = queries_scores[len(queries_scores) - 10:]
    for i in range(len(score_data)):
        line_data.append([i,score_data[i][1]])
    return render_template("analyse.html", nan_json=topic_q, line_data=line_data, min_max_data=min_max_data)


# template_dir = os.path.abspath('./templates')
app.run(host='0.0.0.0', port=5000, debug=True)
#
# import json
#
# url = "http://104.197.21.102:8983/solr/p4/select?q.op=OR&q=selftext%3A%20(covid%20medicine)&fl=selftext,score"
# op = requests.get(url)
# print(json.dumps(op.json()))
# li = []
# for i in op.json()['response']['docs']:
#     li.append(i['selftext'])
# print(len(li))
