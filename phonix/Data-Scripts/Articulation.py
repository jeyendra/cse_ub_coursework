# Load the data from the JSON files
import json
with open("ipa_phoneme.json", "r") as ipa_file:
    ipa_data = json.load(ipa_file)

with open("Arti_data.json", "r") as articulation_file:
    articulation_data = json.load(articulation_file)


# Function to convert a word's "phoneme" field to IPA symbols and lookup articulation information
def word_to_ipa_and_articulation(entry):
    ipa_representation = []
    poa_list = []  # List to store Place of Articulation
    moa_list = []  # List to store Manner of Articulation
    voa_list = []  # List to store Voicing

    for phoneme in entry["phoneme"]:
        ipa_symbol = ipa_data["IPA_symbols"].get(phoneme, None)
        if ipa_symbol:
            ipa_representation.append(ipa_symbol)

            for articulation_entry in articulation_data:
                if articulation_entry["Symbol"] == ipa_symbol:
                    poa = articulation_entry.get("Place_of_Articulation", "")
                    moa = articulation_entry.get("Manner_of_Articulation", "")
                    voa = articulation_entry.get("Voicing", "")

                    poa_list.append(poa)
                    moa_list.append(moa)
                    voa_list.append(voa)

    return ipa_representation, poa_list, moa_list, voa_list


# Initialize an empty list to store the results
word_data_list = []

# Load the data from data2.json
with open('data2.json', 'r') as json_file:
    data2 = json.load(json_file)

# Process each entry in data2
for entry in data2:
    ipa_representation, poa_list, moa_list, voa_list = word_to_ipa_and_articulation(entry)

    word_data = {
        "word": entry["word"],
        "source": entry["source"],
        "phoneme": entry["phoneme"],
        "POA": poa_list,
        "MOA": moa_list,
        "VOA": voa_list
    }
    word_data_list.append(word_data)

# Save the data to data1.json
with open('data3.json', 'w') as json_file:
    json.dump(word_data_list, json_file, indent=4)

print("Data saved to data1.json")