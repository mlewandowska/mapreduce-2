
![A classroom in Saint Cloud, Minnesota, USA. 1919. National Geographic](/images/classroom-1919_mini.jpg)

Źródło:
[An Open Letter to Science Students and Science Teachers](http://phenomena.nationalgeographic.com/2013/05/31/an-open-letter-to-science-students-and-science-teachers/)


## Wprowadzenie do MapReduce

1. Co to jest platforma obliczeniowa MapReduce?
   [link](http://wbzyl.inf.ug.edu.pl/nosql/mongodb-mapreduce)
2. W jakim języku programujemy funkcje *map* i funkcje *reduce*?
   [link](https://github.com/languages)
3. Marijn Haverbeke,
   [Eloquent JavaScript](http://www.bt4.pl/kursy/javascript/wszystko-jasne/)
4. Proste MapReduce najczęściej wyliczają statystyki (średnie, sumy)
   zebranych danych. Klasyczny przykład – zliczanie częstości występowania słów.
5. Jak przedstawić wyniki obliczeń MapReduce:
  - [Data-Driven Documents](http://d3js.org/)
  - Włodzimierz Gajda,
    [Google Chart API — prosty sposób umieszczania wykresów na stronach WWW](http://gajdaw.pl/varia/google-chart-api/print.html)


### Proste MapReduce – częstości występowania słów

Korzystając z konsoli *mongo* łaczymy się z bazą:

```sh
mongo --username student --password sesja2013 153.19.1.202/test
```

W bazie *test* kolekcji *phrases* zostały zapisane dwa dokumenty:

```javascript
db.phrases.insert({ _id: 1, filename: "hamlet.txt",  content: "to be or not to be" });
db.phrases.insert({ _id: 2, filename: "phrases.txt", content: "to wit" });
```

Na konsoli mongo wklejamy kod funkcji map *m* i funkcji reduce *r*:

```js
m = function() {
  this.content.match(/[a-z]+/g).forEach(function(word) {
    emit(word, 1);
  });
};
r = function(key, values) {
  return Array.sum(values);
};
```

Następnie uruchamiamy obliczenia MapReduce:

```js
db.phrases.mapReduce(m, r, {out: {inline: 1}});
{
  "results": [
    { "_id": "be",  "value": 2 },
    { "_id": "not", "value": 1 },
    { "_id": "or",  "value": 1 },
    { "_id": "to",  "value": 3 },
    { "_id": "wit", "value": 1 }
  ],
  "timeMillis": 24,
  "counts": {
    "input": 2, "emit": 8, "reduce": 2, "output": 5
  },
  "ok": 1,
}
```

Wyniki możemy zapamiętać w zmiennej:

```js
var res = coll.mapReduce(m, r, {out: {inline: 1}});
```

![częstości występowania słów](http://chart.googleapis.com/chart?chxl=0:|be|not|or|to|wit&chxr=0,0,4|1,0,3&chxt=y,x&chbh=a&chs=640x180&cht=bhs&chco=C03000,000000&chds=0,3,0,0&chd=t:2,1,3,1,1|0,0,0,0,0&chma=100&chtt=częstości+występowania+słów)

Parametry wykresu z [chart wizard](https://developers.google.com/chart/image/docs/chart_wizard):

```
http://chart.googleapis.com/chart
   ?chxl=0:|be|not|or|to|wit
   &chxr=0,0,4|1,0,3
   &chxt=y,x
   &chbh=a
   &chs=640x180
   &cht=bhs
   &chco=C0300,000000
   &chds=0,3,0,0
   &chd=t:2,1,3,1,1|0,0,0,0,0
   &chma=100
   &chtt=częstości+występowania+słów
```

Opis [parametrów](https://developers.google.com/chart/image/docs/gallery/bar_charts?hl=pl):

```
cht=bhs                                // typ wykresu: bar chart stacked
chs=640x180                            // wymiary wykresu
chd=t:2,1,3,1,1|0,0,0,0,0              // dane wykresu

chco=C03000,000000                     // kolory
chxl=0:|be|not|or|to|wit|1:|0|1|2|3    // etykiety
chbh=a                                 // szerokości i odstępy słupków (automatycznie)
chma=100                               // lewy margines

chxt=y,x                               // osie
chds=0,3,0,0                           // scaling for stacked values: min,max,min,max
chxr=0,0,4|1,0,3                       // osie: y:0..4, x:0..3
```

## Obliczenia MapReduce & Google

* [MapReduce: Simplified Data Processing on Large Clusters](http://static.googleusercontent.com/external_content/untrusted_dlcp/research.google.com/pl//archive/mapreduce-osdi04.pdf)
* Wikipedia: [MapReduce](http://en.wikipedia.org/wiki/MapReduce)
* [Mining of Massive Datasets](http://infolab.stanford.edu/~ullman/mmds.html):
  - [Map-Reduce and the New Software Stack](http://infolab.stanford.edu/~ullman/mmds/ch2.pdf) (rozdział 2)
  - [Link Analysis](http://infolab.stanford.edu/~ullman/mmds/ch5.pdf) (rozdział 5)


## 4 Books from Project Gutenberg

* [4 Books from Project Gutenberg](https://github.com/nosql/map-reduce/blob/master/docs/wbzyl.md)

Łączymy się z bazą:

```sh
mongo --username student --password sesja2013 153.19.1.202/test
```

Tym razem będziemy wykonywać obliczenia na bazie *books*:

```js
db.books.count() // 18786

coll = db.books;
coll.find({n: 8});
coll.find({n: 8, author: /^Chest/});
```

Kopiujemy [kod funkcji map i reduce](http://wbzyl.inf.ug.edu.pl/nosql/mongodb-mapreduce)
(sekcja „Word Count”):

```js
m = function() {
  res = this.p.toLowerCase().match(/[\w\u00C0-\u017F]+/g);
  if (res) {
    res.forEach(function(word) {
      emit(word, 1);
    });
  }
};
r = function(key, values) {
  return Array.sum(values);
};
var res = db.books.mapReduce(m, r, {out: {inline: 1}});
```

Wyniki znajdziemy w tablicy *res.results*:

```js
var results = res.results;
results.length; // 22433
```

### Zadania

Może się przydać – ściąga
z [Array](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Predefined_Core_Objects):

* Iterating over arrays – *for*
* Array Methods – *sort*, *forEach*, *map*, *filter*, *reduce*


Wszystkie pytania odnoszą się do tablicy **results**
wyliczonej powyżej.

1\. Ile słów występuje raz, ile dwa razy, itd?

2\. Ile jest wszystkich słów w akapitach w kolekcji *books*?

3\. Które słowa występują najczęściej?

4\. Jaką część wszystkich słów stanowią słowa z „top 10”?


### Rozwiązania

1\. **7550**

```js
var ones = results.filter(function(x) { return x.value==1; });
ones.length;
ones[100];   // _forgiven_
```

2\. **925055**

```js
var total = results.reduce(function(acc, x) { return acc+x.value; }, 0);
```
