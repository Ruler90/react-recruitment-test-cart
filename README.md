# Info - Marcin:

1. Fn ```fixPriceFormat``` znajduje się w folderze ```utils```, ponieważ używam jej w dwóch komponentach. Obsługuje ona też dwa dodatkowe formaty ceny, na jakie trafiłem kiedyś na portalu. Zmieniłem w ```cart.json``` dwie ceny, żeby móc je potem poprawić za pomocą tej fn:
    - pierwszy produkt - cena zmieniona z 89.99 na 89.9;
    - drugi produkt - cena zmieniona z 29.99 na 29.

2. Dodałem też link do zdjęcia każdego produktu w ```cart.json```.

3. Przy zwiększaniu / zmniejszaniu ilości produktów ustawiłem odpytywanie endpointu, czy ilość szt. jest poprawna, ale dodałem warunek, że ilość się zwiększy lub zmniejszy dopiero, jeśli odpowiedź z serwera będzie ```success```. Jednocześnie w przypadku błędu zamiast przywracać wartość minimalną dodałem dwa komunikaty błędu. Jeden informuje, że posiadamy tylko ileś szt. produktu (na podstawie wartości max) i wtedy zostaje najwyższa możliwa ilość. Z kolei dla zmniejszania jest info, że już osiągnięto minimalną ilość i pozostaje widoczna ostatnia akceptowana wartość (w tym przypadku wszędzie będzie to 1). Jednocześnie, jeśli po otrzymaniu odpowiedzi z endpointu okaże się, że już osiągnięto max, to button dodawania dostanie ```disabled```. Jeśli przy próbie zmniejszenia ilości będzie odpowiedź, że już jest minimalna ilość, to wtedy button odejmowania dostanie ```disabled```. Po udanym użyciu przeciwnego buttona ```disabled``` i komunikat błędu znika.

4. Zamiast debounce użyłem dodatkowego state (```loadingState```), który zmienia się w momencie wysłania zapytania i jeśli jest ```true```, to blokuje dany zestaw buttonów i wyświetla spinner informujący, że coś się przetwarza. Po otrzymaniu odpowiedzi z serwera i zmianie ilości lub wyświetleniu błędu state ustawia się z powrotem na ```false``` i buttony zostają odblokowane (chyba, że mamy gdzieś osiągnięte min lub max jak opisano w pkt. 3). Uniemożliwia to wielokrotne szybkie użycie buttonów, żeby wysyłać naraz wiele zapytań. W pewnym sensie jest to podobne do obecnej zmiany ilości w koszyku, jaką mamy na portalu, ponieważ tam user wybiera jakąś ilość z listy i dopiero wtedy wysyła zapytanie, więc tu obecne zwiększanie / zmniejszanie ilości o 1 działa na podobnej zasadzie.

5. Jeśli powyższe ```loadingState``` zostałoby przeniesione do contextu i stamtąd wywoływane przez buttony zwiększające / zmniejszające ilość, to wtedy spinner wyświetli się przy wszystkich zestawach buttonów naraz.

6. Zdaję sobie sprawę, że przez użycie contextu i owinięcie providerem wszystkich komponentów, dowolna zmiana w którymś z kontekstowych state re-renderuje całość "apki". To był podstawowy "Hookowy" sposób, jaki mi przyszedł do głowy, żeby komponenty wymieniały się danymi - przede wszystkim, żeby ```CartValue``` miał skąd wyliczać całkowitą cenę, jeśli zmienia się ilość produktów. Całość ma na tyle mało możliwych interakcji, że na takim małym kawałku kodu nie ma problemu z wydajnością.

==========================================

# Zadania

Zadania mogą być wykonane niezależnie, możesz użyć dowolnej biblioteki zewnętrznej. W miarę możliwości użyj Hook API.

* Rozszerz komponent App, aby lista produktów była pobierana z końcówki **/api/cart**, wyświetl nazwę produktu oraz jego cenę. Cena powinna być poprawnie sformatowana.
* Dodaj nowy komponent, który będzie wyświetlał liczbę sztuk produktu dodanych do koszyka. 

    * Komponent powinien wyświetlać dwa przyciski: plus i minus oraz tekst: "Obecnie masz X sztuk produktu".
    * Komponent będzie mógł przyjmować opcjonalne propsy min, max i isBlocked. Min i max mają określać minimalną i maksymalną liczbę sztuk.
    * Kliknięcia w plus i minus mają odpowiednio zwiększać i zmniejszać o 1 liczbę sztuk wyświetlaną w tekście w przedziale min i max.
    * Gdy wartość propsa isBlocked będzie true, przyciski zmiany ilości mają być zablokowane.

* Do powyższego komponentu dodaj sprawdzanie, czy wprowadzona liczba sztuk jest poprawna, w tym celu odpytaj końcówkę **/api/product/check**. W przypadku błędu liczba sztuk produktu powinna zostać wyzerowana do wartości minimalnej. Jeżeli to możliwe, dodaj funkcję debounce, aby zminimalizować liczbę zapytań.

* Do komponentu App dodaj zliczanie całkowitej sumy zamówienia. Suma powinna być wyświetlana pod listą produktów.

# Wymagania

Node wersja 12.x lub wyższa

# Uruchomienie

Instalacja zależności:

``` npm i ```


Uruchomienie projektu:

``` npm start ```

# API

W ramach projektu dostępne jest rest API:

## **GET** /api/cart

Zwraca zawartość koszyka.

### Odpowiedź

JSON z listą obiektów z polami:

* **pid** - identyfikator produktu
* **name** - nazwa produktu
* **price** - cena produktu
* **max** - maksymalna liczba sztuk produktu jaka może być dodana do koszyka
* **min** - minimalna liczba sztuk produktu jaka może być dodana do koszyka
* **isBlocked** - określa, czy można zmienić liczbę sztuk produktu dodanych do koszyka


Przykład zwracanych danych:
```
[
    {
        "pid": "8e5e1248-c799-4937-9acc-2b3ab0e034ff",
        "name": "Patelnia",
        "price": "89.99",
        "max": 10,
        "min": 1,
        
    }
]
```

## **POST** /api/product/check

Sprawdza, czy wprowadzona liczba sztuk produktu jest poprawna

### Zapytanie

Obiekt JSON z polami:

* **pid** - identyfikator sprawdzanego produktu
* **quantity** - wprowadzona liczba sztuk produktu

Przykład:

```
{
    "pid": "51630312-2166-4cae-9590-ad77fd9f4a55",
    "quantity": 1
}
```

### Odpowiedź

Obiekt JSON z polami:

* **isError** - określa czy wystąpił błąd
* **success** - określa czy wprowadzone dane są poprawne
* **message** - wiadomość (w przypadku wystąpienia błędu)
* **errorType** - typ błędu (INCORRECT_BODY, INCORRECT_TYPE, MISSING_PROPERTY, NOT_FOUND, INCORRECT_QUANTITY)

Przykład:

```
{
    "isError": true,
    "success": false,
    "message": "Product not found",
    "errorType": "NOT_FOUND"
}
```

