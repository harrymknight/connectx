from ratelimit import limits, sleep_and_retry
import json
import requests
import atexit
import sys
import time

def exit_handler():
    global counter
    with open('counter.txt', 'w') as cfile:
        cfile.write(str(counter))
    with open('words_with_class.json', 'w') as outfile:
        if (new_words):
            json.dump({**read_words, **new_words}, outfile)

@sleep_and_retry
@limits(calls=200, period=1)
def make_request(word):
    response = requests.get(f'https://en.wiktionary.org/api/rest_v1/page/definition/{word}')
    return response

atexit.register(exit_handler)
read_words = {}
new_words = {}
counter = 0
initial_counter = 0
initial_time = time.perf_counter()
with open('words_alpha.txt', 'r') as infile:
    with open('counter.txt', 'r') as cfile:
        counter = int(cfile.read().rstrip())
        initial_counter = counter
    with open('words_with_class.json', 'r') as outfile:
        outfile.seek(0)
        first_char = outfile.read(1)
        if first_char:
            outfile.seek(0)
            read_words = json.loads(outfile.read())
    lines = infile.readlines()
    for line in lines[counter:]:
        word = line.rstrip()
        try:
            result = make_request(word).json()
            try:
                word_class = result['en'][0]['partOfSpeech']
                if (word_class == 'Noun' or word_class == 'Adjective'):
                    new_words[word] = word_class.lower()
            except:
                pass
        except KeyboardInterrupt:
            rate = (counter - initial_counter) / (time.perf_counter() - initial_time)
            print(f'\n\
                number_of_words: {len(lines)} \n\
                initial_line: {initial_counter} \n\
                stopping_line: {counter} \n\
                words/sec: {rate} \n\
                eta (hours): {round((len(lines) - counter) / (rate * 3600), 3)}')
            sys.exit()
        counter += 1
    
