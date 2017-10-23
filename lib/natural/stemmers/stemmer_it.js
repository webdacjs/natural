var stopwords = require('../util/stopwords_it');
var Tokenizer = require('../tokenizers/aggressive_tokenizer_it');
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
         } else if (t.match(new RegExp('[a-zàèìòù0-9]+', 'gi'))) {
           return stemmer.stem(t)
         } else {
           return t
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
