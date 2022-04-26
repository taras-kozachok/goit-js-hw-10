import fetchCountries from "./fetchCountries";
import debounce from "lodash.debounce";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const countryInfo = document.querySelector('.country-info');
const inputBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const DELAY_DEBOUNCE = 300;

inputBox.addEventListener('input', debounce(onInputBoxChange, DELAY_DEBOUNCE));

function onInputBoxChange() {
  const isInput = inputBox.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (isInput) {
    fetchCountries(isInput).then(dataProc)
      .catch(error => {
        Notify.failure("Oops, there is no country with that name");
        console.log(error);
      });
  }

  function dataProc(data) {
    if (data.length > 10) {
      Notify.info("Too many matches found. Please enter a more specific name.");
      return;
    }
    markup(data);
  }

  function markup(data) {
    const markupData = data.map(({ flags: { svg }, name: { official } }) => {
      return `<li><img src="${svg}" alt="${official}>" width = "20" height = "10"/>${official}</li>`;
    })
      .join('');
    if (data.length === 1) {
      const languages = Object.values(data[0].languages).join(', ');
      const markupInfo = `<ul> <li>Capital: ${data[0].capital}</li> <li>Population: ${data[0].population}</li> <li>Languages: ${languages}</li> </ul>`;
      countryInfo.insertAdjacentHTML('afterbegin', markupInfo);
    }
    return countryList.insertAdjacentHTML('afterbegin', markupData);
  }
}
