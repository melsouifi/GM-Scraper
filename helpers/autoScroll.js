module.exports = async (page, selector) => {
  await page.evaluate(async (selector) => {
    const delay = (seconds) => {
      return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
      });
    };
    const boxSelector = document.querySelector(selector);
    if (document.querySelector(selector)) {
      while (
        boxSelector.offsetHeight + boxSelector.scrollTop <
        boxSelector.scrollHeight
      ) {
        boxSelector.scroll({
          top: boxSelector.scrollHeight + 300,
        });
        await delay(3);
      }
    }
  }, selector);
};
