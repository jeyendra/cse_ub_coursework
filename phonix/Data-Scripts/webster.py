import requests
import re
import json

# Specify the URL of the GitHub raw file you want to scrape
github_raw_url = "https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/WebstersEnglishDictionary.txt"

# Make an HTTP GET request to fetch the content
response = requests.get(github_raw_url)

# Check if the request was successful (status code 200)
words =[]
if response.status_code == 200:
    # Extract words with capital letters using regular expressions
    content = response.text
    words_with_caps = re.findall(r'^\b[A-Z][A-Z]+\b', content,re.MULTILINE)

    # Print or process the extracted words as needed
    for word in words_with_caps:
        words.append(word)
else:
    print("Failed to fetch the GitHub raw file. Status code:", response.status_code)

res = [word for word in words if not (word.endswith('.') or len(word) == 1 or re.match(r'(\w)\1+', word))]


word_dict = {"words": res}



# Save the dictionary to a JSON file
with open('words4.json', 'w') as json_file:
    json.dump(word_dict, json_file, indent=4)
