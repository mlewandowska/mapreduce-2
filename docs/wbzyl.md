## 4 Books from Project Gutenberg

### *Włodzimierz Bzyl*

--------

Akapity z czterech książek:

1. Fyodor Dostoyevsky, *The Idiot*.
2. G.K. Chesterton, *The Man Who Knew Too Much*.
3. Leo Tolstoy, *War and Peace*.
4. Arthur C. Doyle, *The Sign of the Four*.

zapisano w formacie TSV w pliku _gutenberg-books.tsv_:

```tsv
n	title	author	p
4	The Idiot	Dostoyevsky, Fyodor	Some of the passengers by this particular train…
```

Następnie akapity zaimportowano do kolekcji *books* bazy *test*
za pomocą programu *mongoimport*:

```sh
mongoimport -c books --type tsv --headerline < gutenberg-books.tsv
```

Oto przykładowy dokument z kolekcji *books* po imporcie do bazy:

```js
{
  "n": 116,                          // akapit #116
  "title": "The Idiot",              // z tej książki
  "author": "Dostoyevsky, Fyodor",   // tego autora
  "p": "\"Now how on earth am I to announce a man like that?\" muttered the servant. …"
}
```

Przykładowe agregacje MapReduce danych z kolekcji *books*
są opisane w notatkach do wykładu
[MapReduce w przykładach](http://sinatra.local/nosql/mongodb-mapreduce).

*Uwagi:* 1. Pliki z tekstem książek pobrano za pomocą skryptu
[get-books.sh](/scripts/wbzyl/get-books.sh).
2. Zawartość pobranych plików skonwertowano do formatu TSV za pomocą
skryptu [books2tsv](/scripts/wbzyl/books2tsv.rb).
