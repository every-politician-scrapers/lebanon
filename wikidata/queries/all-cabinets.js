const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
  let cabinet = meta.cabinet.parent ? `UNION { ?item wdt:P31 wd:${meta.cabinet.parent} }` : '';
  let govment = meta.cabinet.government ? `UNION { ?item wdt:P31 wd:${meta.cabinet.government} }` : '';

  return `SELECT DISTINCT ?ordinal ?item ?itemLabel
                  ?inception ?inceptionPrecision
                  ?abolished ?abolishedPrecision
                  ?replaces ?replacesLabel ?replacedBy ?replacedByLabel
  WHERE {
    { ?item wdt:P31/wdt:P279* wd:Q640506 ; wdt:P1001 wd:${meta.jurisdiction.id} }
    ${cabinet}
    ${govment}

    OPTIONAL { ?item p:P31/pq:P1545 ?ordinal }
    OPTIONAL { ?item p:P571 [ a wikibase:BestRank ; psv:P571 [wikibase:timeValue ?inception ; wikibase:timePrecision ?inceptionPrecision] ] }
    OPTIONAL { ?item p:P576 [ a wikibase:BestRank ; psv:P576 [wikibase:timeValue ?abolished ; wikibase:timePrecision ?abolishedPrecision] ] }

    OPTIONAL { ?item wdt:P1365 ?replaces     }
    OPTIONAL { ?item wdt:P1366 ?replacedBy   }

    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }
  # ${new Date().toISOString()}
  ORDER BY ?inception ?item`
}
