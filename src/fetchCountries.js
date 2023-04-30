export default function fetchCountries(name) {
  if (!name) {
    return Promise.reject(new Error('Empty name'));
  }
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(error.message);
    });
}