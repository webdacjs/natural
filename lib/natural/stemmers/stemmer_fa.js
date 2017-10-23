/*
Copyright (c) 2011, Chris Umbel
Farsi Stemmer by Fardin Koochaki <me@fardinak.com>

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
*/

var stopwords = require('../util/stopwords_fa')
var Tokenizer = require('../tokenizers/aggressive_tokenizer_fa')
var stemmercommon = require('./stemmer_common.js')

module.exports = function () {
  var stemmer = this

  stemmer.stem = function (token) {
    return token
  }

  stemmer.tokenizeAndStem = function (text, params) {
    if (params === undefined) params = {}

    params.defaultWhiteListWords = []
    params.stopwords = stopwords.words
    var stopWhite = stemmercommon.getStopAndWhiteList(params)

    var returnTemplate = stemmercommon.getStemmerTemplate(stopWhite)
    var lowercaseText = text.toLowerCase()
    var tokens = new Tokenizer().tokenize(lowercaseText)

    returnTemplate.stemmedTokens = tokens.filter(
     function (t) { return stopWhite.stopwords.indexOf(t) === -1 }).map(
       function (t) {
         if (stopWhite.whiteListWords.indexOf(t) > -1) {
           return t
         } else {
           return stemmer.stem(t)
         }
       })

    return stemmercommon.getReturnResults(tokens, params, returnTemplate, stopWhite)
  }

  stemmer.attach = function () {
    String.prototype.stem = function () {
      return stemmer.stem(this)
    }

    String.prototype.tokenizeAndStem = function (params) {
      return stemmer.tokenizeAndStem(this, params)
    }
  }
}
