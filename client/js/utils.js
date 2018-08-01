/* eslint-disable no-unused-vars */
const baseUrl = 'http://127.0.0.1:3000/api/v1';
const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieStringArray = decodedCookie.split(';');
  for (let i = 0; i < cookieStringArray.length; i + 1) {
    let cookieString = cookieStringArray[i];
    while (cookieString.charAt(0) === ' ') {
      cookieString = cookieString.substring(1);
    }
    if (cookieString.indexOf(name) === 0) {
      return cookieString.substring(name.length, cookieString.length);
    }
  }
  return '';
};
const setCookie = (cname, cvalue, exdays) => {
  const date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};
const checkCookie = (cname) => {
  const cookieName = getCookie(cname);
  if (cookieName !== '') {
    return true;
  }
  return false;
};
