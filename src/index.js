import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

// Получить ссылки на элементы DOM
const countriesList = document.querySelector('.countries-list');
const searchInput = document.querySelector('.search-input');

// Создать функцию для отображения информации о странах на странице
function displayCountries(countries) {
  const html = countries
    .map(
      country => `
        <div class="country">
          <img class="flag" src="${country.flags.png}" alt="${country.name.common} Flag">
          <h2 class="name">${country.name.common}</h2>
          <p class="population">Population: ${country.population.toLocaleString()}</p>
          <p class="region">Region: ${country.region}</p>
          <p class="capital">Capital: ${country.capital}</p>
        </div>
      `
    )
    .join('');
  countriesList.innerHTML = html;
}

// Создать функцию для фильтрации стран по введенному пользователем тексту
function searchCountries(countries, searchText) {
  return countries.filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()));
}

// Создать функцию для обработки событий ввода текста в поле поиска
function handleSearch() {
  const searchText = searchInput.value.trim();
  const filteredCountries = searchCountries(countries, searchText);
  if (filteredCountries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (filteredCountries.length === 0) {
    Notify.failure('No matches found. Please enter a valid name.');
    return;
  }
  displayCountries(filteredCountries);
}

// Инициализировать приложение
let countries = [];

fetchCountries().then(data => {
  countries = data;
  displayCountries(countries);
});

searchInput.addEventListener('input', debounce(handleSearch, 500));
