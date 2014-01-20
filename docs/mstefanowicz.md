## Zadanie 3 mapreduce
Na potrzeby tego zadania wygenerowalem na stronie http://www.json-generator.com/ przykadowa liste uczniów w szkole podstawowej.

```json


        "id": 0,
        "name": "Vincent Ramos",
        "plec": "male",
        "numerdzien": 27,
        "rok": 5,
        "klasa": "A"
    
```

Wyswietlenie liczby uczniuw w klasach A, B, C na pierwszym roku.

```js
var mapFunction1 = function() { emit( this.klasa, this.rok) ; };
```

```js
var reduceFunction1 = function(key, values) {
    var licznik = 0;
    for(i in values) {
        if(values[i] > 0 && values[i] < 2) {
            licznik++;
        }
    }
    return licznik;
};
```
```js
db.szkola.mapReduce(
                     mapFunction1,
                     reduceFunction1,
                     { out: "print" }
                   )
                   
```
Wynik wywietlilem poleceniem 
```sh
db.print.find()
```
 Wynik:
```json
 
{"_id" : "A", "value" : 218}
{"_id" : "B", "value" : 215}
{"_id" : "C", "value" : 232}    
```    
Wyswietlenie liczby chlopców i dziewczynek w szkole
```js
var functionmap2 = function() {
  emit(this.plec, 1);
};
```
```js
var functionreduce1 = function(key,value) {
  var count = 0;
  for(i = 0; i < value.length; i++) {
    count += value[i];
  }
  return count;
};
```
```js
db.szkola.mapReduce(
  functionmap2,
  functionreduce1,
  { out : "plec" }
);
```
Wynik:
```json
{"_id" : "female", "value" : 2034}
{"_id" : "male", "value" : 1966}
```
Liczba chlopców i dziewczynek na 1 roku.

```js
var mapFunction3 = function() { emit( this.plec, this.rok) ; };
```
```js
var reduceFunction3 = function(key, values) {
    var licznik = 0;
    for(i in values) {
        if(values[i] > 0 && values[i] < 2) {
            licznik++;
        }
    }
    return licznik;
};
```
```js
db.szkola.mapReduce(
                     mapFunction3,
                     reduceFunction3,
                     {out: "print" }
                     )
```
Wynik:
```json
{"_id" : "female", "value" : 322}
{"_id" : "male", "value" : 343}
```
