const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
    return `SELECT DISTINCT ?item ?itemLabel ?ministry ?ministryLabel ?country ?jurisdiction (YEAR(?start) AS ?began) (YEAR(?end) AS ?ended) WHERE {
      ?item p:P361/ps:P361 wd:${meta.cabinet.parent}
      OPTIONAL { ?item wdt:P2389 ?ministry }
      OPTIONAL { ?item wdt:P571|wdt:P580 ?start }
      OPTIONAL { ?item wdt:P576|wdt:P582 ?end }
      OPTIONAL { ?item wdt:P17 ?country }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    ORDER BY ?itemLabel ?start ?item`
}
