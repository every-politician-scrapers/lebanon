module.exports = (...ids) => {
  return `SELECT DISTINCT ?position ?positionLabel ?ofLabel ?jurisdictionLabel ?people ?example
  WITH {
    SELECT DISTINCT ?position ?of ?jurisdiction
      (COUNT(DISTINCT ?person) AS ?people)
      (MAX(xsd:integer(STRAFTER(STR(?person), 'Q'))) AS ?example)
    WHERE {
      VALUES ?person { ${ids.map(value => `wd:${value}`).join(' ')} }
      ?person p:P39 ?ps .
      ?ps ps:P39 ?position .
      FILTER NOT EXISTS { ?ps wikibase:rank wikibase:DeprecatedRank }

      OPTIONAL { ?ps pq:P642 ?of }
      OPTIONAL { ?position wdt:P1001 ?jurisdiction }
    } # ${new Date().toISOString()}
    GROUP BY ?position ?of ?jurisdiction
  } AS %inner
  WHERE {
    INCLUDE %inner .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,es,de,et,ru,ar". }
  }
  ORDER BY DESC(?people) ?positionLabel ?ofLabel`
}
