import csv
import json

with open('words_with_class.json', 'r') as infile:
    data = json.load(infile)
    outfile = csv.writer(open('words_with_class.csv', 'w'))
    for row in data:
        outfile.writerow([row, data[row]])