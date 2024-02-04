import React, { useEffect, useState } from 'react';

const DailyVerse = () => {
  const [verse, setVerse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const apiKey = 'e010ebcc99898fd9568be0e0ada426e4'; // Twój klucz API
    const bibleId = '9879dbb7cfe39e4d-01'; // Podaj ID Biblia, dostosuj do potrzeb
    const verseId = [
        `JER.29.11`,
        `PSA.23`,
        `1COR.4.4-8`,
        `PHP.4.13`,
        `JHN.3.16`,
        `ROM.8.28`,
        `ISA.41.10`,
        `PSA.46.1`,
        `GAL.5.22-23`,
        `HEB.11.1`,
        `2TI.1.7`,
        `1COR.10.13`,
        `PRO.22.6`,
        `ISA.40.31`,
        `JOS.1.9`,
        `HEB.12.2`,
        `MAT.11.28`,
        `ROM.10.9-10`,
        `PHP.2.3-4`,
        `MAT.5.43-44`,
      ];
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId[1]}?api-key=${apiKey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          // Jeśli odpowiedź nie jest w porządku, rzuć błąd, aby przejść do bloku catch
          throw new Error('Network response was not ok');
        }
        console.log(response.json())
        return response.json();
      })
      .then(data => {
        // Przykład, jak można ustawić werset w stanie, zakładając że `data` ma właściwość `content`
        setVerse(data.content); // Dostosuj tę linijkę do struktury odpowiedzi API
      })
      .catch(error => {
        setError('Could not fetch the verse, please try again later. Maybe Mateusz zapomnial tego zrobic.');
        console.error('Error during fetch:', error);
      });
  }, []); // Pusta tablica zależności oznacza, że efekt uruchomi się tylko po pierwszym renderowaniu komponentu

  // Renderuj werset lub komunikat o błędzie
  return (
    <div>
      {verse ? <p>{verse}</p> : <p>{error}</p>}
    </div>
  );
};

export default DailyVerse;
