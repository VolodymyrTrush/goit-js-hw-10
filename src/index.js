import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import countryListLayout from './template/country-list.hbs';
import countryCardLayout from './template/country-card.hbs';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

const clearField = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};
const createCountryField = country => (refs.countryInfo.innerHTML = countryCardLayout(country));
const createCountryList = countries => (refs.countryList.innerHTML = countryListLayout(countries));

const search = e => {
  e.preventDefault();
  if (e.target.value) {
    fetchCountries(e.target.value.trim()).then(selectCountry).catch(fetchError);
  }
  clearField();
};

const selectCountry = countries => {
  const countriesQuantity = countries.length;
  clearField();
  if (countriesQuantity > 10) {
    Notify.warning('Too many matches found. Please enter a more specific name.');
  } else if (countriesQuantity >= 2 && countriesQuantity <= 10) {
    createCountryList(countries);
    createSelectedCountry();
  } else if (countriesQuantity === 1) {
    createCountryField(countries);
  }
};

const createSelectedCountry = () => {
  const countriesList = refs.countryList.querySelectorAll('.country-title');
  return countriesList.forEach(selectedCountry => {
    const select = e => {
      e.preventDefault();
      const name = selectedCountry.textContent;
      fetchCountries(name).then(selectCountry).catch(fetchError);
      clearField();
      refs.searchInput.value = '';
    };
    selectedCountry.addEventListener('click', select);
  });
};

const fetchError = () => {
  Notify.failure('Oops! There is no country with that name!');
  clearField();
};

refs.searchInput.addEventListener('input', debounce(search, DEBOUNCE_DELAY));