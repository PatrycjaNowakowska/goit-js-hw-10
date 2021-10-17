import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');


const renderCountryInfo = data => {
  const markup = data
    .map(data => {
        return `<img class="country-info__flag" src="${data.flags.svg}" alt="Flag of ${
          data.name
        }" width="50" >
      <span class="country-info__name" style="color:red"><b>${data.name}</b></span>
      <p class="country-info__data"><b>Capital</b>: ${data.capital}</p>
      <p class="country-info__data"><b>Population</b>: ${data.population}</p>
      <p class="country-info__data"><b>Languages</b>: ${data.languages.map(
        language => language.name,
      )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

const renderCountryList = data => {
  const markup = data
    .map(data => {
      return `<li class="country-list__item">
      <img class="country-list__flag" src="${data.flags.svg}" alt="Flag of ${data.name}" width="50" >
      <p class="country-list__name">${data.name}</p>
      </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};


const countryFinder = () => {
  let name = searchBox.value.trim();
  if (name === '') {
      Notiflix.Notify.info('Please type in a country name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
  } else {
    fetchCountries(name) 
      .then(data => {
        if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
        } else if (data.length >= 2 && data.length <= 10) {
            renderCountryList(data);
            countryInfo.innerHTML = '';
        } else if ((data.length = 1)) {
            renderCountryInfo(data);
            countryList.innerHTML = '';
        }
      })
      .catch(err => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
};

searchBox.addEventListener('input', debounce(countryFinder, DEBOUNCE_DELAY));