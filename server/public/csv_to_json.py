import csv
import json

json_data = {}
with open('words_with_class.csv', 'r') as infile:
    data = csv.reader(infile)
    for row in data:
        json_data[row[0]] = row[1]
    with open('words_with_class.json', 'w') as outfile:
        json.dump(json_data, outfile)