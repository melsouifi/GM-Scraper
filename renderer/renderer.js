// get countries list
import allCountries from "./countries.js";

// selectors
const searchBar = document.getElementById("search");
const submitButton = document.querySelector('button[type="submit"]');
const spinner = document.querySelector(".spinner");
const countrySelect = document.getElementById("country-select");
const citiesBox = document.querySelector("#cities-box");
const searchCityBar = document.getElementById("search-city");
// enable search by country
document
  .getElementById("search-by-country-checkbox")
  .addEventListener("click", () => {
    searchCityBar.classList.add("hide");
    searchCityBar.value = "";
    if (document.getElementById("select-all-section")) {
      document.getElementById("select-all-section").remove();
    }
    let selectCountryBox = document.getElementById("country-select");
    selectCountryBox.disabled = !selectCountryBox.disabled;
    citiesBox.innerHTML = "";
    countrySelect.querySelector("option").selected = true;
  });

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // check if there is any cities
  const citiesSelected = [];
  if (citiesBox.querySelectorAll("input")) {
    citiesBox.querySelectorAll("input").forEach((city) => {
      if (city.checked) {
        citiesSelected.push(city.value);
      }
    });
  }

  let displayScraping = document.getElementById(
    "scraping-window-check"
  ).checked;
  if (displayScraping === false) displayScraping = "new";
  if (displayScraping === true) displayScraping = false;
  const value = searchBar.value;
  if (!value) return;

  // disable the search bar and the click button
  searchBar.disabled = true;
  submitButton.disabled = true;
  spinner.classList.remove("visually-hidden");

  await window.mainProcess.searchValues(
    value,
    displayScraping,
    countrySelect.value,
    citiesSelected
  );
  //await window.mainProcess.displayScraping(displayScraping);

  spinner.classList.add("visually-hidden");
  // disable the search bar and the click button
  searchBar.disabled = false;
  submitButton.disabled = false;
});

// add countries list to select option
let options = ``;
allCountries.forEach((country, i) => {
  options += `<option value="${country.country}" id=${country.id}>${country.country}</option>`;
});

countrySelect.insertAdjacentHTML("beforeend", options);

// add event listener to selected country
countrySelect.addEventListener("change", (e) => {
  let citiesHtml = ``;
  const countryId = e.target.selectedOptions[0].id;
  allCountries[countryId].cities.forEach((city) => {
    citiesHtml += `<div class="city" id="${city.replaceAll(
      " ",
      "-"
    )}"><input type="checkbox" name="city" value="${city}"/> ${city}</div>`;
  });
  if (document.getElementById("select-all-section")) {
    document.getElementById("select-all-section").remove();
  }
  const selectAllCheckBoxHtml =
    '<div id="select-all-section">Select All <input type="checkbox" id="select-all" /> </div>';
  // const searchCityHtml =
  //   '<input type="text" id="searchCity" placeholder="Search By City"/>';
  citiesBox.insertAdjacentHTML("beforebegin", selectAllCheckBoxHtml);
  //citiesBox.insertAdjacentHTML("beforebegin", searchCityHtml);
  citiesBox.innerHTML = "";
  citiesBox.insertAdjacentHTML("beforeend", citiesHtml);

  const selectAllCheckbox = document.getElementById("select-all");

  // display  city search

  searchCityBar.classList.remove("hide");
  searchCityBar.addEventListener("keyup", (e) => {
    const citySearch = e.target.value.trim();
    if (citySearch === "") {
      return;
    }

    const allCities = document.querySelectorAll(".city");
    allCities.forEach((city) => {
      if (
        city.textContent.trim() !== "" &&
        city.textContent
          .toLocaleLowerCase()
          .includes(citySearch.toLocaleLowerCase())
      ) {
        document
          .querySelector(
            `#${city.textContent
              .trim()
              .replaceAll(" ", "-")
              .replace(/\d+/g, "")}`
          )
          .scrollIntoView({ behavior: "smooth" });
      }
      if (
        city.textContent.toLocaleLowerCase().trim() ===
        citySearch.toLocaleLowerCase()
      ) {
        document.querySelector(
          `#${city.textContent.trim().replaceAll(" ", "-").replace(/\d+/g, "")}`
        ).style.color = "black";
        document.querySelector(
          `#${city.textContent.trim().replaceAll(" ", "-").replace(/\d+/g, "")}`
        ).style.fontWeight = "bold";
      }
    });
  });

  selectAllCheckbox.addEventListener("click", (e) => {
    const allCities = document.querySelectorAll('input[name="city"]');
    for (let i = 0; i < allCities.length; i++) {
      allCities[i].checked = selectAllCheckbox.checked ? true : false;
    }
  });

  // search bar for cities

  // document.getElementById("searchCity").addEventListener("input", function () {
  //   let searchValue = this.value.trim().toLowerCase();
  //   let items = citiesBox.querySelectorAll("input[name='city']");

  //   for (let item of items) {
  //     let text = item.textContent.toLowerCase();
  //     if (text.includes(searchValue)) {
  //       // item.style.display = "block";
  //       // Scroll to the matched word
  //       item.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }
  //     // } else {
  //     //     item.style.display = "none";
  //     // }
  //   }
  // });
});
