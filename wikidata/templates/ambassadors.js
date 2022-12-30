const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function() {
  return `
    SELECT DISTINCT ?item ?toLabel ?countryLabel ?itemLabel WHERE {
      ?item wdt:P31 ?from; wdt:P31 ?to .
      ?from wdt:P279*/wdt:P31 wd:Q29918328 ; wdt:P17 wd:${meta.jurisdiction.id} .
      FILTER (?to != ?from)
      OPTIONAL { ?to wdt:P17 ?country }

      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY ?countryLabel
  `
}
