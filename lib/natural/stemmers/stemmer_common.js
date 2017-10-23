/*
Copyright (c) 2017, Juan Convers

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
var getStemmerTemplate = function (stopWhite) {
  var stemmedTokensObject = {
    stemmedTokens: [],
    whitelistwords: stopWhite.whiteListWords
  }
  return stemmedTokensObject
}

var getStopAndWhiteList = function (params) {
  var stopWhiteListObject = {
    whiteListWords: params.whiteListWords || params.defaultWhiteListWords
  }
  if (params.keepStops) {
    stopWhiteListObject.stopwords = []
  } else {
    stopWhiteListObject.stopwords = params.stopwords
  }
  return stopWhiteListObject
}

var getReturnResults = function (tokens, params, returnTemplate, stopWhite) {
  if (!params.debug) {
    return returnTemplate.stemmedTokens
  } else {
    returnTemplate.stoppedTokens = tokens.filter(
      function (t) { return stopWhite.stopwords.indexOf(t) > -1 })
    return returnTemplate
  }
}

module.exports = {
  getStemmerTemplate,
  getStopAndWhiteList,
  getReturnResults
}
