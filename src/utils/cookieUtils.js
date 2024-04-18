"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.getCookie = exports.setCookie = void 0;
const setCookie = (name, value, daysToLive) => {
    const cookieValue = encodeURIComponent(value);
    let cookieText = `${name}=${cookieValue}`;
    if (typeof daysToLive === "number") {
        cookieText += `; max-age=${daysToLive * 24 * 60 * 60}`;
    }
    document.cookie = cookieText + "; path=/";
};
exports.setCookie = setCookie;
const getCookie = (name) => {
    // Dodaj znak równości do nazwy, aby móc później dokładnie odnaleźć cookie
    const nameString = name + "=";
    // Podziel string document.cookie przy każdym średniku i przeszukaj wynikową tablicę
    const value = document.cookie.split('; ').find(row => row.startsWith(nameString));
    // Jeżeli cookie zostało znalezione, zwróć jego wartość po dekodowaniu
    return value ? decodeURIComponent(value.split('=')[1]) : null;
};
exports.getCookie = getCookie;
// Usuwanie cookie
const deleteCookie = (name) => {
    // Ustaw wartość cookie na pustą i 'max-age' na 0, aby natychmiast je usunąć
    document.cookie = name + '=; max-age=0; path=/';
};
exports.deleteCookie = deleteCookie;
function setSessionCookie(response, token) {
    response.cookie('sessionToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // Ochrona przed atakami CSRF
    });
}
//# sourceMappingURL=cookieUtils.js.map