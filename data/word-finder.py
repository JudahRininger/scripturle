import sys
import string

def find_words(path, num_letters):
    file = open(path, "r")

    lines = file.readlines()

    all_words = {}

    for line in lines:
        for word in line.split():
            clear_word = word.translate(str.maketrans('', '', string.punctuation))
            all_words[clear_word] = clear_word

    found_words = []

    for word in all_words:
        # remove punctuation
        if len(word) == num_letters: 
            found_words.append(word)

    file.close()

    sorted_words = sorted(found_words)

    return sorted_words

if __name__ == "__main__":   
    path = sys.argv[1]
    num_letters = int(sys.argv[2])

    print(path)
    print(num_letters)

    words = find_words(path, num_letters)

    for word in words:
        print(word)