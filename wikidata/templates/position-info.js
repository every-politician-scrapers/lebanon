module.exports = (...ids) => {
  return `
    SELECT DISTINCT ?position ?positionLabel
                    ?country ?countryLabel
                    ?jurisdiction ?jurisdictionLabel
                    ?inception ?abolished
                    ?predecessor ?predecessorLabel
                    ?successor ?successorLabel
                    ?deputy ?deputyLabel
                    ?list ?listLabel
    WITH {
        SELECT DISTINCT ?position
                        (MIN(?raw_country) AS ?country)
                        (MIN(?raw_jurisdiction) AS ?jurisdiction)
                        (MAX(?raw_deputy) AS ?deputy)
                        (MIN(?raw_list) AS ?list)
                        (MIN(?raw_prev) AS ?predecessor)
                        (MIN(?raw_next) AS ?successor)
                        (MIN(?raw_inception) AS ?inception)
                        (MAX(?raw_abolished) AS ?abolished)
         WHERE {
              VALUES ?position { ${ids.map(value => `wd:${value}`).join(' ')} }
              OPTIONAL { ?position wdt:P17   ?raw_country }
              OPTIONAL { ?position wdt:P1001 ?raw_jurisdiction }
              OPTIONAL { ?position wdt:P571 ?raw_inception }
              OPTIONAL { ?position wdt:P576 ?raw_abolished }
              OPTIONAL { ?position wdt:P1365 ?raw_prev }
              OPTIONAL { ?position wdt:P1366 ?raw_next }

              OPTIONAL { ?position wdt:P2098 ?raw_deputy }
              OPTIONAL { ?position wdt:P2354 ?raw_list }
         }
         GROUP BY ?position
    } AS %inner
    WHERE {
        INCLUDE %inner .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,de,es,pt,ru". }
    }
    ORDER BY xsd:integer(STRAFTER(STR(?position), "Q"))
  `
}
