*This github repo was used to pass an [assignment](http://wbzyl.inf.ug.edu.pl/nosql/zadania) on my erasmus year.* 

# MapReduce Example

continued from [aggregations-2/docs/sebnapi/README.md](https://github.com/nosql/aggregations-2/blob/master/docs/sebnapi/README.md)

##Flights and Plane Data

I downloaded 3 months (Jan-Mar) of flightdata for 2013 from the [Research and Innovative Technology Administration (RITA)](http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236) and plane data from the [Federal Aviation Administration](http://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/). By combining the `TAIL_NUM` with the `N-Number` from the aircraft registry, we get detailed informations about the plane used on the flight. I imported both datasets by this [script](https://github.com/nosql/aggregations-2/blob/master/data/sebnapi/import_rita.py) to mongodb resulting in datasets like this:

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

## Map-Reduce Cascading Flight Delays

I thought about a Map-Reduce Job that could find cascaded delays, where a arriving flight would delay other departuring flights. The approach splits the day in 24 hour slices and emits delayed arrivals or departures on a composite key `airport-code`-`daytimeslice` `daytimeslice = 0-24`. If a flight arrvies 10:38 it's in the 11th hour of the day.

### Map

```js
map = function () {
    if(this.ARR_DELAY > 0){
        var x = {"flight_id": this._id , "delay": this.ARR_DELAY};
        var t = this.ARR_TIME.split(":");
        var part_of_day = Math.round((parseInt(t[0])*60+parseInt(t[1]))/60);
        emit(this.DEST+"-"+part_of_day, {"incomming" : x, "outgoing" : null});
    }
    if(this.DEP_DELAY > 0){
        var y = {"flight_id": this._id , "delay": this.DEP_DELAY};
        var t = this.DEP_TIME.split(":");
        var part_of_day = Math.round((parseInt(t[0])*60+parseInt(t[1]))/60);
        emit(this.ORIGIN+"-"+part_of_day, {"incomming" : null, "outgoing" : y});
    }
}
```

For every flight we have two datapoints on two different airports, the origin and the destination airport. On the origin airport a departure delay is an outgoing delay (which is maybe caused by an incomming delay). On the destination airport a arrival delay is an incoming delay (which can cause outgoing delays).

### Reduce

The reduce function is idempotent, returning the same type as the map emit function and the ordering of the resulting list can be arbitary. So the requirements for the reduce function are met. 

```js
reduce = function (key, values) {
    incomming = [];
    outgoing = [];
    for ( var i=1; i<values.length; i++ ) {
        if(values[i].incomming != null){
            incomming.push(values[i].incomming);
        }
        if(values[i].outgoing != null){
            outgoing.push(values[i].outgoing);
        }
    }
    
    if (incomming.length > 0 && outgoing.length > 0){
        return {"incomming":incomming,  "outgoing" : outgoing};
    }
}
```

The reduce function looks out for more than one delayed incomming flight and for more than one outgoing flight for the composite key `airport-code`-`daytimeslice`.

### Result

The result can be seen [here](../../data/sebnapi/map_reduce_cascading_delays_result.json).

An example part of the dataset returned by the [map reduce job](../../data/sebnapi/map_reduce_cascading_delays.js):
```js
{
    "_id": "ACV-15",
    "value": {
        "incomming": [
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d5af"),
            "delay": 5
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d5b6"),
            "delay": 13
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d5b7"),
            "delay": 26
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d5b9"),
            "delay": 25
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d5bf"),
            "delay": 12
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d66f"),
            "delay": 157
        }
        ],
        "outgoing": [
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d64d"),
            "delay": 151
        },
        {
            "flight_id": ObjectId("52bb521e00d0b007e231d65e"),
            "delay": 118
        }
        ]
    }
},

```

We can see 5 delayed incomming flights and two delayed outgoing flights for the Airport with the code ACV in the 15th hour of the day.

### Annotations

> MongoDB will not call the reduce function for a key that has only a single value. The values argument is an array whose elements are the value objects that are “mapped” to the key.

MongoDB has a weird policy for not calling the reduce function for keys that have only one value mapped, which results in output like this:

```js
{
    "_id": "ACV-7",
    "value": {
        "incomming": null,
        "outgoing": {
            "flight_id": ObjectId("52bb521d00d0b007e231c33f"),
            "delay": 74
        }
    }
},
```
These sets can be ignored.

#### Launch the script:

```bash
mongo --quiet map_reduce_cascading_delays.js > map_reduce_cascading_delays_result.json
```



