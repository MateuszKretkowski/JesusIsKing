export const setCookie = (name: string, value: boolean, daysToLive?: number): void => {
    const cookieValue = encodeURIComponent(value);
    let cookieText = `${name}=${cookieValue}`;
    if (typeof daysToLive === "number") {
        cookieText += `; max-age=${daysToLive * 24 * 60 * 60}`;
    }
    document.cookie = cookieText + "; path=/";
};

export const getCookie = (name: string): string | null => {
    // Dodaj znak równości do nazwy, aby móc później dokładnie odnaleźć cookie
    const nameString = name + "=";
    // Podziel string document.cookie przy każdym średniku i przeszukaj wynikową tablicę
    const value = document.cookie.split('; ').find(row => row.startsWith(nameString));
    // Jeżeli cookie zostało znalezione, zwróć jego wartość po dekodowaniu
    return value ? decodeURIComponent(value.split('=')[1]) : null;
};

// Usuwanie cookie
export const deleteCookie = (name: string): void => {
    // Ustaw wartość cookie na pustą i 'max-age' na 0, aby natychmiast je usunąć
    document.cookie = name + '=; max-age=0; path=/';
};

function setSessionCookie(response, token) {
    response.cookie('sessionToken', token, {
      httpOnly: true,
      secure: true, // Używaj tylko w przypadku HTTPS
      sameSite: 'strict', // Ochrona przed atakami CSRF
    });
  }