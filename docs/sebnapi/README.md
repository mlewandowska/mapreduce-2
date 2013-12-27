# MapReduce Example

continued from [aggregations-2/docs/sebnapi/README.md](https://github.com/nosql/aggregations-2/blob/master/docs/sebnapi/README.md)

##Flights and Plane Data

I downloaded 3 months (Jan-Mar) of flightdata for 2013 from the [Research and Innovative Technology Administration (RITA)](http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236) and plane data from the [Federal Aviation Administration](http://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/). By combining the `TAIL_NUM` with the `N-Number` from the aircraft registry, we get detailed informations about the plane used on the flight. I imported both datasets by this [script](../../data/sebnapi/import_rita.py) to mongodb resulting in Datasets like this:

```js
{
	"_id" : ObjectId("52bb4e7700d0b007a5977fc4"),
	"ORIGIN_CITY_NAME" : "Dallas/Fort Worth, TX",
	"FL_NUM" : "3324",
	"NAS_DELAY" : 0,
	"CANCELLED" : true,
	"ARR_DELAY" : -14,
	"DIVERTED" : true,
	"CRS_ELAPSED_TIME" : 200,
	"ORIGIN_CITY_MARKET_ID" : "30194",
	"WHEELS_ON" : "14:43",
	"AIR_TIME" : 175,
	"WHEELS_OFF" : "10:48",
	"PLANE" : {
		"N-NUMBER" : "923XJ",
		"UNIQUE ID" : "01007732",
		"ENG MFR MDL" : "30050",
		"ZIP CODE" : "303543743",
		"CERT ISSUE DATE" : "20091231",
		"STREET" : "1775 M H JACKSON SERVICE RD",
		"REGION" : "7",
		"OTHER NAMES(2)" : "",
		" KIT MODEL" : "",
		"FRACT OWNER" : "",
		"STATUS CODE" : "V",
		"MODE S CODE HEX" : "ACCB65",
		"SERIAL NUMBER" : "15177",
		"AIR WORTH DATE" : "20080514",
		"COUNTRY" : "US",
		"EXPIRATION DATE" : "20160531",
		"TYPE AIRCRAFT" : "5",
		"MODE S CODE" : "53145545",
		"STREET2" : "DEPT 595",
		"LAST ACTION DATE" : "20130501",
		"COUNTY" : "121",
		"STATE" : "GA",
		"TYPE ENGINE" : "5",
		"OTHER NAMES(4)" : "",
		"OTHER NAMES(3)" : "",
		"CITY" : "ATLANTA",
		"NAME" : "DELTA AIR LINES INC",
		"OTHER NAMES(5)" : "",
		"CERTIFICATION" : "1T",
		"OTHER NAMES(1)" : "",
		"TYPE REGISTRANT" : "3",
		"MFR MDL CODE" : "1390016",
		"KIT MFR" : "",
		"YEAR MFR" : 2008
	},
	"CARRIER_DELAY" : 0,
	"DEST_CITY_MARKET_ID" : "31703",
	"DEST_CITY_NAME" : "New York, NY",
	"ORIGIN" : "DFW",
	"DEP_TIME" : "10:38",
	"ACTUAL_ELAPSED_TIME" : 193,
	"ORIGIN_AIRPORT_SEQ_ID" : "1129803",
	"DEST" : "JFK",
	"ARR_DELAY_NEW" : 0,
	"FLIGHTS" : 1,
	"DEST_AIRPORT_SEQ_ID" : "1247802",
	"YEAR" : "2013",
	"AIRLINE_ID" : "20363",
	"DEP_DELAY_NEW" : 0,
	"FL_DATE" : "2013-01-17",
	"DISTANCE" : 1391,
	"DEST_AIRPORT_ID" : "12478",
	"DEP_DELAY" : -7,
	"WEATHER_DELAY" : 0,
	"CANCELLATION_CODE" : "",
	"ARR_TIME" : "14:51",
	"SECURITY_DELAY" : 0,
	"UNIQUE_CARRIER" : "9E",
	"CARRIER" : "9E",
	"ORIGIN_AIRPORT_ID" : "11298",
	"LATE_AIRCRAFT_DELAY" : 0,
	"TAIL_NUM" : "N923XJ"
}
```


I thought about a Map-Reduce Job that could find cascaded delays, where a arriving flight would delay other departuring flights. The Approach emits ...