import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function resetMarkup() {
countryListEl.innerHTML = '';
countryInfoEl.innerHTML = '';
}

function searchCountry(e) {
let countryInSearch = e.target.value.trim();
fetchCountries(countryInSearch)
.then(country => {
if (country.length > 10) {
Notify.info(
'Too many matches found. Please enter a more specific name.'
);
resetMarkup();
} else if (country.length <= 10 && country.length >= 2) {
renderInfoMarkup(country);
} else {
renderCardMarkup(country);
}
})
.catch(error => {
Notify.failure('Oops, there is no country with that name');
console.log(error);
resetMarkup();
});
}

function renderInfoMarkup(countries) {
  const markup = countries
    .map(
      ({ name, flags }) => `<li>
        <img src="${flags.svg}" alt="flags" width ="20" height ="15">
        <p class="country-name">${name.official}</p>
        </li>`
    )
    .join('');
  resetMarkup();
  countryListEl.innerHTML = markup; 
}

function renderCardMarkup(countries) {
  const markup = countries
    .map(
      ({ name, capital, flags, population, languages }) => `<div>
        <img src="${flags.svg}" alt="flags" width ="30" height ="20">
            <h2 class="country-title">${name.official}</h2>
            </div>
            <ul>
            <li> <b>Capital</b>:
          <span>${capital}</span>
            </li>
            <li> <b>Population</b>:
          <span>${population.toLocaleString()}</span> // изменено
            </li>
            <li> <b>Languages</b>:
          <span>${Object.values(languages).join(', ')}</span>
            </li>
        </ul>`
    )
    .join('');
  resetMarkup();
  countryInfoEl.innerHTML = markup; 
}


inputEl.addEventListener('keydown', e => {
if (e.code === 'Enter') {
searchCountry(e);
}
});

inputEl.addEventListener('input', () => {
window.scrollTo({
top: 0,
behavior: 'smooth',
});
});