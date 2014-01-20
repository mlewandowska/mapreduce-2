### Kamil Zdunek

Skorzystałem z bazy, która została także użyta przeze mnie w 1 zadaniu a mianowicie [airports.csv](http://www.ourairports.com/data/airports.csv)

Przykładowy rekord:

```json
{
        "_id" : ObjectId("528e8134556062edda13000d"),
        "continent" : "NA",
        "elevation_ft" : 150,
        "gps_code" : "00SC",
        "home_link" : "",
        "iata_code" : "",
        "id" : 6561,
        "ident" : "00SC",
        "iso_country" : "US",
        "iso_region" : "US-SC",
        "keywords" : "",
        "latitude_deg" : 34.0093994140625,
        "local_code" : "00SC",
        "longitude_deg" : -80.2671966552734,
        "municipality" : "Sumter",
        "name" : "Flying O Airport",
        "scheduled_service" : "no",
        "type" : "small_airport",
        "wikipedia_link" : ""
}
```


## Map Reduce nr 1 
Ilość występowania lotnisk pod względem 'gminy' w jakiej występują z uwzględnieniem 10 najpopularniejszych.

```js
var map = function() {
    emit(
        {gmina: this.municipality}, {count: 1}
    );
};
```

```js
var red = function(key, values) {
    var count = 0;
    values.forEach(function (val) {
        count += val['count'];
    });
    return {count: count};
};
```

```js
db.airports2.mapReduce(map, red, {out: "wc"});
```

Wynik wykonania:

```json
{
        "result" : "wc",
        "timeMillis" : 9600,
        "counts" : {
                "input" : 45434,
                "emit" : 45434,
                "reduce" : 10098,
                "output" : 21890
        },
        "ok" : 1,
}
```

Wynik:

```js
> db.wc.find().sort({value: -1}).limit(10)
```

```json
{ "_id" : { "typ" : "" }, "value" : { "count" : 4892 } }
{ "_id" : { "typ" : "Sao Paulo" }, "value" : { "count" : 222 } }
{ "_id" : { "typ" : "Houston" }, "value" : { "count" : 116 } }
{ "_id" : { "typ" : "Corumbá" }, "value" : { "count" : 78 } }
{ "_id" : { "typ" : "Los Angeles" }, "value" : { "count" : 66 } }
{ "_id" : { "typ" : "Wasilla" }, "value" : { "count" : 66 } }
{ "_id" : { "typ" : "Santiago" }, "value" : { "count" : 57 } }
{ "_id" : { "typ" : "Itaituba" }, "value" : { "count" : 51 } }
{ "_id" : { "typ" : "Rio De Janeiro" }, "value" : { "count" : 50 } }
{ "_id" : { "typ" : "Columbus" }, "value" : { "count" : 48 } }
```
Jak widać większość dokumentów ma po prostu to pole puste.

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad3wyk1.png)

## Map Reduce nr 2
Ilość lotnisk występujących w danym regionie, w US, z ograniczeniem do 10 najpopularniejszych.

```js
var map = function() {

	var u = this.iso_region; 
	var words = u.match(/US.[a-zA-Z]+/g);
	
	if (words == null) {
        return;
    }
	
    for (var i = 0; i < words.length; i++) {
        emit({ word:words[i] }, { count:1 });
    }
};
```

```js
var red = function(key, val) {
var u = 0;
    for (var i = 0; i < val.length; i++) {
        u = u + val[i].count;
    }
    return { count:u };
};

```

```js
db.airports2.mapReduce(map, red, {out: "ap"});
```

Wynik wykonania:
```json
{
        "result" : "ap",
        "timeMillis" : 2834,
        "counts" : {
                "input" : 45434,
                "emit" : 21418,
                "reduce" : 1452,
                "output" : 52
        },
        "ok" : 1,
}

```

Wynik:

```js
>db.ap.find().sort({value: -1}).limit(10)
```

```json
{ "_id" : { "word" : "US-TX" }, "value" : { "count" : 2115 } }
{ "_id" : { "word" : "US-CA" }, "value" : { "count" : 1010 } }
{ "_id" : { "word" : "US-FL" }, "value" : { "count" : 900 } }
{ "_id" : { "word" : "US-PA" }, "value" : { "count" : 885 } }
{ "_id" : { "word" : "US-IL" }, "value" : { "count" : 863 } }
{ "_id" : { "word" : "US-AK" }, "value" : { "count" : 768 } }
{ "_id" : { "word" : "US-OH" }, "value" : { "count" : 755 } }
{ "_id" : { "word" : "US-IN" }, "value" : { "count" : 676 } }
{ "_id" : { "word" : "US-NY" }, "value" : { "count" : 636 } }
{ "_id" : { "word" : "US-WI" }, "value" : { "count" : 596 } }
```

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad3wyk2.png)
