const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const saveDataToExcel = require("./main_process/saveDataToExcel");
const saveReviewsToExcel = require("./main_process/saveReviewsToExcel");

const calcTime = require("./helpers/calcTime");
const scrapeGM = require("./scrappers/mainData");
const getEmails = require('./helpers/getEmails')
const finalFilter = require('./helpers/finalFilter');
const sortByEmails = require('./helpers/sortByEmails');
const getSomeReviews = require('./main_process/getSomeReviews');
const getAllReviews = require('./main_process/getAllReviews');

const createWindow = async (width = 800, height = 1200) => {
  const win = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(__dirname, "images/map.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  return win;
};
app.whenReady().then(async () => {
  let data = [];
  let data_reviews;
  let resultWindow;
  
 
  ipcMain.handle(
    "search-values",
    async (
      e,
      searchValue,
      displayScraping,
      countrySelected,
      citiesSelected
    ) => {
      e.preventDefault();
      const startTime = new Date();
      data = [];
      

      if (citiesSelected.length > 0) {
          for (let i = 0; i < citiesSelected.length; i += 6) {
            const chunk = citiesSelected.slice(i, i + 6);

            // Open multiple browser instances simultaneously
            const promises = chunk.map(async (city) => {
              currentData = await scrapeGM(
                searchValue,
                displayScraping,
                countrySelected,
                city
              );
              data.push(...currentData);
            });
             await Promise.all(promises);

          }

          // filter data and remove  duplicates 

          data = finalFilter(data);
          data = await getEmails(data);
          data.sort(sortByEmails)
          const endTime = new Date();

          const timeExecuted = calcTime(startTime, endTime);
          // create new window
          resultWindow =  await createWindow(1400,1200)
          await resultWindow.loadFile("./pages/result.html");
          resultWindow.webContents.send("data-g", data);
          resultWindow.webContents.send("process-time", timeExecuted);
    

      } else {
        
          data = await scrapeGM(
            searchValue,
            displayScraping,
            countrySelected,
            ""
          );

           // filter data and remove  duplicates 

          data = finalFilter(data);

          data = await getEmails(data);
          data.sort(sortByEmails)
          const endTime = new Date();

        const timeExecuted = calcTime(startTime, endTime);
        // create new window
        resultWindow = await createWindow(1400,1200);
        await resultWindow.loadFile("./pages/result.html");
        resultWindow.webContents.send("data-g", data);
        resultWindow.webContents.send("process-time", timeExecuted);
      }
      return data;
    }
  );


  ipcMain.on("download-method", (e, method) => {
    saveDataToExcel(data, e, method);
  });

  ipcMain.on("download-reviews", (e) => {
    saveReviewsToExcel(data_reviews, e);
  });

  ipcMain.on("getAllReviews", async (e, getAll) => {
    data_reviews = await getAllReviews(getAll, data, data_reviews, resultWindow);
  });

  ipcMain.on('getSomeReviews', async (e, getSome)=>{
    data_reviews = await getSomeReviews(getSome,data, data_reviews, resultWindow);
    
  })


  const win = await createWindow();
  await win.loadFile("./pages/index.html");
});
