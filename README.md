natural
=======

[![NPM version](https://img.shields.io/npm/v/natural.svg)](https://www.npmjs.com/package/natural)
[![Build Status](https://travis-ci.org/NaturalNode/natural.png?branch=master)](https://travis-ci.org/NaturalNode/natural)

"Natural" is a general natural language facility for nodejs. Tokenizing,
stemming, classification, phonetics, tf-idf, WordNet, string similarity,
and some inflections are currently supported.

It's still in the early stages, so we're very interested in bug reports,
contributions and the like.

Note that many algorithms from Rob Ellis's [node-nltools](https://github.com/NaturalNode/node-nltools) are
being merged into this project and will be maintained from here onward.

At the moment, most of the algorithms are English-specific, but in the long-term, some diversity
will be in order. Thanks to Polyakov Vladimir, Russian stemming has been added!, Thanks to David Przybilla, Spanish stemming has been added!.

Aside from this README, the only documentation is [this DZone article](http://www.dzone.com/links/r/using_natural_a_nlp_module_for_nodejs.html), [this free course on Egghead.io](https://egghead.io/courses/natural-language-processing-in-javascript-with-natural), and [here on my blog](http://www.chrisumbel.com/article/node_js_natural_language_porter_stemmer_lancaster_bayes_naive_metaphone_soundex), which is a bit older.

### TABLE OF CONTENTS

* [Installation](#installation)
* [Tokenizers](#tokenizers)
* [String Distance](#string-distance)
* [Approximate String Matching](#approximate-string-matching)
* [Stemmers](#stemmers)
* [N-Grams](#n-grams)
* [tf-idf](#tf-idf)
* [Tries](#tries)* [WordNet](#wordnet)
* [Spellcheck](#spellcheck)
* [Acknowledgements/references](#acknowledgements-and-references)
* [Development](#development)
* [License](#license)


## Installation

If you're just looking to use natural without your own node application,
you can install via NPM like so:

    npm install natural

If you're interested in contributing to natural, or just hacking on it, then by all
means fork away!

## Tokenizers

Word, Regexp, and [Treebank tokenizers](http://www.cis.upenn.edu/~treebank/tokenization.html) are provided for breaking text up into
arrays of tokens:

```javascript
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
console.log(tokenizer.tokenize("your dog has fleas."));
// [ 'your', 'dog', 'has', 'fleas' ]
```

The other tokenizers follow a similar pattern:

```javascript
tokenizer = new natural.TreebankWordTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my', 'dog', 'has', 'n\'t', 'any', 'fleas', '.' ]

tokenizer = new natural.RegexpTokenizer({pattern: /\-/});
console.log(tokenizer.tokenize("flea-dog"));
// [ 'flea', 'dog' ]

tokenizer = new natural.WordPunctTokenizer();
console.log(tokenizer.tokenize("my dog hasn't any fleas."));
// [ 'my',  'dog',  'hasn',  '\'',  't',  'any',  'fleas',  '.' ]
```

## String Distance

Natural provides an implementation of the [Jaro–Winkler](http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) string distance measuring algorithm.
This will return a number between 0 and 1 which tells how closely the strings match (0 = not at all, 1 = exact match):

```javascript
var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx"))
console.log(natural.JaroWinklerDistance('not', 'same'));
```

Output:

```javascript
0.7466666666666666
0
```

Natural also offers support for Levenshtein distances:

```javascript
var natural = require('natural');
console.log(natural.LevenshteinDistance("ones","onez"));
console.log(natural.LevenshteinDistance('one', 'one'));
```

Output:

```javascript
1
0
```

The cost of the three edit operations are modifiable for Levenshtein:

```javascript
console.log(natural.LevenshteinDistance("ones","onez", {
    insertion_cost: 1,
    deletion_cost: 1,
    substitution_cost: 1
}));
```

Output:

```javascript
1
```

And Dice's co-efficient:

```javascript
var natural = require('natural');
console.log(natural.DiceCoefficient('thing', 'thing'));
console.log(natural.DiceCoefficient('not', 'same'));
```

Output:

```javascript
1
0
```

## Stemmers

Currently stemming is supported via the [Porter](http://tartarus.org/martin/PorterStemmer/index.html) and [Lancaster](http://www.comp.lancs.ac.uk/computing/research/stemming/) (Paice/Husk) algorithms.

```javascript
var natural = require('natural');
```

This example uses a Porter stemmer. "word" is returned.

```javascript
console.log(natural.PorterStemmer.stem("words")); // stem a single word
```

 in Spanish:

```javascript
console.log(natural.PorterStemmerEs.stem("jugaría"));
```

`attach()` patches `stem()` and `tokenizeAndStem()` to String as a shortcut to
`PorterStemmer.stem(token)`. `tokenizeAndStem()` breaks text up into single words
and returns an array of stemmed tokens.

```javascript
natural.PorterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

the same thing can be done with a Lancaster stemmer:

```javascript
natural.LancasterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("chainsaws".stem());
```

## N-Grams

n-grams can be obtained for either arrays or strings (which will be tokenized
for you):

```javascript
var NGrams = natural.NGrams;
```

### bigrams

```javascript
console.log(NGrams.bigrams('some words here'));
console.log(NGrams.bigrams(['some',  'words',  'here']));
```

Both of the above output: `[ [ 'some', 'words' ], [ 'words', 'here' ] ]`

### trigrams

```javascript
console.log(NGrams.trigrams('some other words here'));
console.log(NGrams.trigrams(['some',  'other', 'words',  'here']));
```

Both of the above output: `[ [ 'some', 'other', 'words' ],
  [ 'other', 'words', 'here' ] ]`

### arbitrary n-grams

```javascript
console.log(NGrams.ngrams('some other words here for you', 4));
console.log(NGrams.ngrams(['some', 'other', 'words', 'here', 'for',
    'you'], 4));
```

The above outputs: `[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ] ]`

### padding

n-grams can also be returned with left or right padding by passing a start and/or end symbol to the bigrams, trigrams or ngrams.

```javascript
console.log(NGrams.ngrams('some other words here for you', 4, '[start]', '[end]'));
```

The above will output:
```
[ [ '[start]', '[start]', '[start]', 'some' ],
  [ '[start]', '[start]', 'some', 'other' ],
  [ '[start]', 'some', 'other', 'words' ],
  [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

For only end symbols, pass `null` for the start symbol, for instance:
```javascript
console.log(NGrams.ngrams('some other words here for you', 4, null, '[end]'));
```

Will output:
```
[ [ 'some', 'other', 'words', 'here' ],
  [ 'other', 'words', 'here', 'for' ],
  [ 'words', 'here', 'for', 'you' ],
  [ 'here', 'for', 'you', '[end]' ],
  [ 'for', 'you', '[end]', '[end]' ],
  [ 'you', '[end]', '[end]', '[end]' ] ]
```

## tf-idf

[Term Frequency–Inverse Document Frequency (tf-idf)](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) is implemented to determine how important a word (or words) is to a
document relative to a corpus. The following example will add four documents to
a corpus and determine the weight of the word "node" and then the weight of the
word "ruby" in each document.

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');
tfidf.addDocument('this document is about node. it has node examples');

console.log('node --------------------------------');
tfidf.tfidfs('node', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log('ruby --------------------------------');
tfidf.tfidfs('ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:

```
node --------------------------------
document #0 is 1
document #1 is 0
document #2 is 1
document #3 is 2
ruby --------------------------------
document #0 is 0
document #1 is 1.2876820724517808
document #2 is 1.2876820724517808
document #3 is 0
```

This approach can also be applied to individual documents.

The following example measures the term "node" in the first and second documents.

```javascript
console.log(tfidf.tfidf('node', 0));
console.log(tfidf.tfidf('node', 1));
```

A TfIdf instance can also load documents from files on disk.

```javascript
var tfidf = new TfIdf();
tfidf.addFileSync('data_files/one.txt');
tfidf.addFileSync('data_files/two.txt');
```

Multiple terms can be measured as well, with their weights being added into
a single measure value. The following example determines that the last document
is the most relevant to the words "node" and "ruby".

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument('this document is about node.');
tfidf.addDocument('this document is about ruby.');
tfidf.addDocument('this document is about ruby and node.');

tfidf.tfidfs('node ruby', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:

```
document #0 is 1
document #1 is 1
document #2 is 2
```

The examples above all use strings, which causes natural to automatically tokenize the input.
If you wish to perform your own tokenization or other kinds of processing, you
can do so, then pass in the resultant arrays later. This approach allows you to bypass natural's
default preprocessing.

```javascript
var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

tfidf.addDocument(['document', 'about', 'node']);
tfidf.addDocument(['document', 'about', 'ruby']);
tfidf.addDocument(['document', 'about', 'ruby', 'node']);
tfidf.addDocument(['document', 'about', 'node', 'node', 'examples']);

tfidf.tfidfs(['node', 'ruby'], function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

It's possible to retrieve a list of all terms in a document, sorted by their
importance.

```javascript
tfidf.listTerms(0 /*document index*/).forEach(function(item) {
    console.log(item.term + ': ' + item.tfidf);
});
```

A TfIdf instance can also be serialized and deserialized for save and recall.

```javascript
var tfidf = new TfIdf();
tfidf.addDocument('document one', 'un');
tfidf.addDocument('document Two', 'deux');
var s = JSON.stringify(tfidf);
// save "s" to disk, database or otherwise

// assuming you pulled "s" back out of storage.
var tfidf = new TfIdf(JSON.parse(s));
```

## Tries

Tries are a very efficient data structure used for prefix-based searches.
Natural comes packaged with a basic Trie implementation which can support match collection along a path,
existence search and prefix search.

### Building The Trie

You need to add words to build up the dictionary of the Trie, this is an example of basic Trie set up:

```javascript
var natural = require('natural');
var Trie = natural.Trie;

var trie = new Trie();

// Add one string at a time
trie.addString("test");

// Or add many strings
trie.addStrings(["string1", "string2", "string3"]);
```

### Searching

#### Contains

The most basic operation on a Trie is to see if a search string is marked as a word in the Trie.

```javascript
console.log(trie.contains("test")); // true
console.log(trie.contains("asdf")); // false
```

### Find Prefix

The find prefix search will find the longest prefix that is identified as a word in the trie.
It will also return the remaining portion of the string which it was not able to match.

```javascript
console.log(trie.findPrefix("tester"));     // ['test', 'er']
console.log(trie.findPrefix("string4"));    // [null, '4']
console.log(trie.findPrefix("string3"));    // ['string3', '']
```

### All Prefixes on Path

This search will return all prefix matches along the search string path.

```javascript
trie.addString("tes");
trie.addString("est");
console.log(trie.findMatchesOnPath("tester")); // ['tes', 'test'];
```

### All Keys with Prefix

This search will return all of the words in the Trie with the given prefix, or [ ] if not found.

```javascript
console.log(trie.keysWithPrefix("string")); // ["string1", "string2", "string3"]
```

### Case-Sensitivity

By default the trie is case-sensitive, you can use it in case-_in_sensitive mode by passing `false`
to the Trie constructor.

```javascript
trie.contains("TEST"); // false

var ciTrie = new Trie(false);
ciTrie.addString("test");
ciTrie.contains("TEsT"); // true
```
In the case of the searches which return strings, all strings returned will be in lower case if you are in case-_in_sensitive mode.

## Spellcheck

A probabilistic spellchecker based on http://norvig.com/spell-correct.html

This is best constructed with an array of tokens from a corpus, but a simple list of words from a dictionary will work.

```javascript
var corpus = ['something', 'soothing'];
var spellcheck = new natural.Spellcheck(corpus);
```

It uses the trie datastructure for fast boolean lookup of a word

```javascript
spellcheck.isCorrect('cat'); // false
```

It suggests corrections (sorted by probability in descending order) that are up to a maximum edit distance away from the input word. According to Norvig, a max distance of 1 will cover 80% to 95% of spelling mistakes. After a distance of 2, it becomes very slow.

```javascript
spellcheck.getCorrections('soemthing', 1); // ['something']
spellcheck.getCorrections('soemthing', 2); // ['something', 'soothing']
```

## Development

When developing, please:

+ Write unit tests
+ Make sure your unit tests pass

The current configuration of the unit tests requires the following environment variable to be set:

    export NODE_PATH=.


## License

Copyright (c) 2011, 2012 Chris Umbel, Rob Ellis, Russell Mull

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
