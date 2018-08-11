/*
Copyright (c) 2012, David Przybilla, Chris Umbel

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

var stopwords_es = require('../util/stopwords_es')
var stopwords_fr = require('../util/stopwords_fr')
var stopwords_en = require('../util/stopwords')
var stopwords_de = require('../util/stopwords_de')

var languagedetector = {}

const intersection = (a, b) => {
  var ai = 0, bi = 0
  var result = new Array()

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) { ai++ } else if (a[ai] > b[bi]) { bi++ } else /* they're equal */
     {
      result.push(a[ai])
      ai++
      bi++
    }
  }
  return result
}

languagedetector.main = function (text) {
  var array2 = text.toLowerCase().split(' ')
  array2.sort()
  let detectedLanguage
  const textlength = array2.length
  const intersectionEn = intersection(stopwords_en.words.sort(), array2).length
  const intersectionEs = intersection(stopwords_es.words.sort(), array2).length
  const intersectionFr = intersection(stopwords_fr.words.sort(), array2).length
  const intersectionDe = intersection(stopwords_de.words.sort(), array2).length

  var ratio = 0
  detectedLanguage = 'English'
  if ((intersectionFr / textlength) > ratio) {
    ratio = intersectionFr / textlength
    detectedLanguage = 'French'
  }
    // console.log("Fr: " + intersectionFr / textlength);
  if ((intersectionEs / textlength) > ratio) {
    ratio = intersectionEs / textlength
    detectedLanguage = 'Spanish'
  }
    // console.log("Es: " + intersectionEs / textlength);
  if ((intersectionDe / textlength) > ratio) {
    ratio = intersectionDe / textlength
    detectedLanguage = 'German'
  }
    // console.log("De: " + intersectionDe / textlength);
  if ((intersectionEn / textlength) > ratio) {
    ratio = intersectionEn / textlength
    detectedLanguage = 'English'
  }
    // console.log("En: " + intersectionEn / textlength);
    // console.log(detectedLanguage);
  return detectedLanguage
}

module.exports = languagedetector.main
