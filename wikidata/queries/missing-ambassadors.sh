#!/bin/bash

RESULTS=$(mktemp)

wd sparql wikidata/templates/ambassadors.js -f csv | sed -e 's^http://www.wikidata.org/entity/^^g' > $RESULTS
qsv join --left-anti item $RESULTS position <(qsv cat rows wikidata/*.csv) > wikidata/results/missing-ambassadors.csv
