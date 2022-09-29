const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
    return `SELECT DISTINCT ?item ?itemLabel ?minister ?ministerLabel (YEAR(?start) AS ?began) (YEAR(?end) AS ?ended) WHERE {
      ?item wdt:P31/wdt:P279* wd:Q192350; wdt:P1001 wd:${meta.jurisdiction.id}.
      OPTIONAL { ?item wdt:P2388 ?minister }
      OPTIONAL { ?item wdt:P571|wdt:P580 ?start }
      OPTIONAL { ?item wdt:P576|wdt:P582 ?end }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    ORDER BY ?itemLabel ?start`
}
