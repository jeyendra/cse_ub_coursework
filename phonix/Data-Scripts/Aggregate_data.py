import json

f = open("data1.json")
articulation_data = json.loads(f.read())

fd = open("data3.json")
semantics_data = json.loads(fd.read())

for i in range(0,len(articulation_data)):
    if (articulation_data[i]['word'] == semantics_data[i]['word']):
        semantics_data[i]['phoneme'] = articulation_data[i]['phoneme']
        semantics_data[i]['POA'] = articulation_data[i]['POA']
        semantics_data[i]['MOA'] = articulation_data[i]['MOA']
        semantics_data[i]['VOA'] = articulation_data[i]['VOA']

with open('final_data.json', 'w') as final_file:
    json.dump(semantics_data, final_file, indent=2)


