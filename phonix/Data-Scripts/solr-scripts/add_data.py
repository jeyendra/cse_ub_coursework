from pysolr import Solr
import  json
# Create a Solr object
solr = Solr('http://xlabk8s2.cse.buffalo.edu:30007/solr/phonemes', always_commit=True)
# alldata.json is the file that contains all the words and related information.
f = open("alldata.json", 'r')
data = json.loads(f.read())
for i in data:
    i.pop('source')
solr.add(data)
solr.commit()
