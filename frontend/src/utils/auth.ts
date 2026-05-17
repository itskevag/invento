export function saveToken(token: string) {
  localStorage.setItem("invento_token", token);
}

export function getToken() {
  return localStorage.getItem("invento_token");
}

export function removeToken() {
  localStorage.removeItem("invento_token");
}

export function isLoggedIn() {
  return Boolean(getToken());
}