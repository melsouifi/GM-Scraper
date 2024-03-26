// get countries list 
import allCountries from "./countries.js";

// selectors
const searchBar = document.getElementById('search');
const submitButton = document.querySelector('button[type="submit"]');
const spinner = document.querySelector('.spinner');
const countrySelect = document.getElementById('country-select');
const citiesBox = document.querySelector('#cities-box');


// enable search by country
document.getElementById('search-by-country-checkbox').addEventListener('click', ()=>{ 
   let selectCountryBox =  document.getElementById('country-select');
   selectCountryBox.disabled = !selectCountryBox.disabled;
   citiesBox.innerHTML = '';
   countrySelect.querySelector('option').selected = true
 })

 

submitButton.addEventListener('click', async(e)=>{
    e.preventDefault();

    // check if there is any cities
    const citiesSelected = [];
    if(citiesBox.querySelectorAll('input')){
      citiesBox.querySelectorAll('input').forEach(city=>{
        if(city.checked){
          citiesSelected.push(city.value);
        }
      })
    }

    let displayScraping = document.getElementById('scraping-window-check').checked;
    if(displayScraping === false) displayScraping = 'new';
    if(displayScraping === true) displayScraping = false;
    const value = searchBar.value;
    if(!value) return 

    // disable the search bar and the click button 
   searchBar.disabled = true;
   submitButton.disabled = true;
   spinner.classList.remove('visually-hidden');
   
   await window.mainProcess.searchValues(value, displayScraping, countrySelect.value, citiesSelected);
   //await window.mainProcess.displayScraping(displayScraping);

   spinner.classList.add('visually-hidden');
      // disable the search bar and the click button 
      searchBar.disabled = false;
      submitButton.disabled = false;
})
 

// add countries list to select option
let options = ``
console.log(options)
allCountries.forEach((country, i)=>{
  options +=  `<option value="${country.country}" id=${country.id}>${country.country}</option>`
});

countrySelect.insertAdjacentHTML('beforeend', options);


// add event listener to selected country
countrySelect.addEventListener('change', (e)=>{
  let citiesHtml = ``
  const countryId = e.target.selectedOptions[0].id
  allCountries[countryId].cities.forEach((city)=>{
    console.log(city)
    citiesHtml += `<div><input type="checkbox"/ name="city" value="${city}"> ${city}</div>`;
  })


  citiesBox.innerHTML = ''
  citiesBox.insertAdjacentHTML("beforeend", citiesHtml)
})