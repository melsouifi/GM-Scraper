const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");

const selectors = require("./selectors");
const delay = require("../helpers/delay");
const autoScroll = require("../helpers/autoScroll");
const getEmails  = require('../helpers/getEmails');
const scrapeGM = async (searchTerm, displayScraping, countrySelected, city) => {
  const browser = await puppeteer.launch({
    headless: displayScraping,
  });
  const page = await browser.newPage();

  try {
  await page.goto("https://www.google.com/maps");

  const allData = [];

 
    countrySelected = countrySelected ? `in ${countrySelected}` : "";
    console.log(city);
    city = city ? `in (${city})` : "";
    await page.type(
      selectors.searchInput,
      `${searchTerm} ${countrySelected} ${city}`
    );
    await page.click(selectors.searchButton);
    await delay(3);

    await autoScroll(page, selectors.resultsBox);

    // collect all urls for each section
    const allUrls = await page.evaluate(() => {
      let allUrls = Array.from(document.querySelectorAll("a.hfpxzc"));
      return allUrls.map((url) => url.href);
    });

    for (let j = 0; j < allUrls.length; j++) {
      await page.goto(allUrls[j]);
      await delay(2);
      
      try {
        placeName = await page.$eval(selectors.placeName, (el) =>
          el.textContent.trim()
        );
      } catch (e) {
        placeName = "";
      }
      let category;
      try{
        const selector = await page.evaluate(()=>{
          if(document.querySelector('span [jsaction="pane.wfvdle7.category"]')) return 'span [jsaction="pane.wfvdle7.category"]'
          return 'span [jsaction="pane.wfvdle8.category"]'
        })
        
        category = await page.$eval(selector, (el)=>el.textContent.trim())
      }catch(e){
        category = ''
      }

      let rating;
      try {
        rating = await page.$eval(selectors.ratingsNumber, (el) =>
          el.textContent.trim().slice(0, 3)
        );
      } catch (e) {
        rating = "";
      }

      let reviewsNumber;
      try {
        reviewsNumber = await page.$eval(
          selectors.ratingsNumber,
          (el) => el.textContent.trim().match(/\(([^)]+)\)/)[1]
        );
      } catch (e) {
        reviewsNumber = "";
      }

      let fullAddress;
      try {
        fullAddress = await page.$eval(selectors.fullAddress, (el) =>
          el.textContent.trim().replace(/^[^a-zA-Z0-9]+/, "")
        );
      } catch (e) {
        fullAddress = "";
      }

      let website;
      try {
        website = await page.$eval(selectors.website, (el) => el.href);

        if (website.includes("business.google.com")) {
          website = "";
        }

      } catch (e) {
        website = "";
      }

      let phoneNumber;
      try {
        phoneNumber = await page.evaluate(() => {
          let sections = document.querySelectorAll("button.CsEnBe");
          let phone;
          for (let i = 0; i < sections.length; i++) {
            if (sections[i].dataset.itemId.includes("phone")) {
              phone = sections[i].textContent
                .trim()
                .replace(/^[^a-zA-Z0-9]+/, "");
            }
          }
          return phone || "";
        });
      } catch (e) {
        phoneNumber = "";
      }
      // const url =  page.url()
    
      // const long_lat = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      // const latitude = long_lat[1];
      // const longitude = long_lat[2];

      // navigate to website to coolect emails 
      let emails = [];
      if(website){
        emails = await getEmails(website, page);

      }
      const data = {
        ["Map Url"]: allUrls[j],
        ["Place Name"]: placeName,
        ["Category"]: category,
        ["rating"]: rating,
        ["Number Of Reviews"]: reviewsNumber,
        ["Website"]: website,
        ["Phone Number"]: phoneNumber,
        ["Address"]: fullAddress,
        // ['Latitude']: latitude,
        // ['Longitude']: longitude,
        ['Emails']: emails,
        ['City']: `${city}`
       // ["_id"]: uuidv4(),
      }
      if(emails[0]){
        data['emails 1'] = emails[0]
      }
      if(emails[1]){
        data['emails 2'] = emails[1]
      }
      if(emails[2]){
        data['emails 3'] = emails[2]
      }

    if(emails.length > 0){
      allData.unshift(data)
    }else{
      allData.push(data);
    }
      
    }
    
    await browser.close();

    return allData;
  } catch (e) {
    await browser.close();
    console.log(e);
    return [];
  }

};

module.exports = scrapeGM;
