const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mainProcess", {
  searchValues: (
    searchValue,
    displayScraping,
    countrySelected,
    citiesSelected
  ) =>
    ipcRenderer.invoke(
      "search-values",
      searchValue,
      displayScraping,
      countrySelected,
      citiesSelected
    ),
  scrapeAllReviews: (getAll) => ipcRenderer.send("getAllReviews", getAll),
  scrapeSomeReviews: (getSome) => ipcRenderer.send("getSomeReviews", getSome),
  reviewsProcess: (callback) =>
    ipcRenderer.on("reviews-process", (e, value) => callback(value)),
});

contextBridge.exposeInMainWorld("data", {
  allData: (callback) =>
    ipcRenderer.on("data-g", (e, value) => callback(value)),
  data_reviews: (callback) =>
    ipcRenderer.on("data-reviews", (e, value) => callback(value)),
  timeExecuted: (callback) =>
    ipcRenderer.on("process-time", (e, value) => callback(value)),
  reviewsTimeExecuted: (callback) =>
    ipcRenderer.on("reviews-process-time", (e, value) => callback(value)),
});

contextBridge.exposeInMainWorld("downloadProcess", {
  download: (method) => ipcRenderer.send("download-method", method),
  downloadReviews: (method) => ipcRenderer.send("download-reviews", method),
});

ipcRenderer.on("update_available", () => {
  alert("A new update is available. Downloading now...");
});

ipcRenderer.on("update_downloaded", () => {
  const userResponse = confirm(
    "Update downloaded. It will be installed on restart. Restart now?"
  );
  if (userResponse) {
    ipcRenderer.send("restart_app");
  }
});
