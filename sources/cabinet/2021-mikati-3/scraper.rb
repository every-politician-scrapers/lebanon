#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class MemberList
  class Members
    decorator RemoveReferences
    decorator UnspanAllTables
    decorator WikidataIdsDecorator::Links

    def member_container
      noko.xpath("//table[.//th[contains(.,'Portfolio')]]//tr[td]")
    end
  end

  class Member
    field :id do
      name_node.css('a/@wikidata').first
    end

    field :name do
      name_node.css('a').first.text.tidy
    end

    field :positionID do
    end

    field :position do
      tds[0].text.tidy
    end

    field :startDate do
    end

    field :endDate do
    end

    private

    def tds
      noko.css('td')
    end

    def name_node
      tds[1]
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url).csv
