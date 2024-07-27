const puppeteer = require("puppeteer");
const delay = require("./delay");
const sanitaizeEmail = require('./sanitaizeEmail');
module.exports =  getAllEmails = async(data)=>{
  const browser = await puppeteer.launch({
    headless:'new'
  });
  const page = await browser.newPage();
  for(let i = 0; i < data.length; i++){
    data[i]['email 1'] = ''
    data[i]['email 2'] = ''
    data[i]['email 3'] = ''
    let emails;
    if(data[i]['Website'].length > 0){
      emails = await getEmails(data[i]['Website'], page)
      if(emails[0]){
        data[i]['email 1'] = sanitaizeEmail(emails[0])
      }
      if(emails[1]){
        data[i]['email 2'] = sanitaizeEmail(emails[1])
      }
      if(emails[2]){
        data[i]['email 3'] = sanitaizeEmail(emails[2])
      }

    }
   
  }
  
  await browser.close()
  return data
}

const getEmails = async (url, page) => {
  try {
    await page.goto(url);
    await delay(1);
    const tags = [  'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'strong', 'em', 'b', 'i', 'u'];

    // const textContent = await page.evaluate(() => {
    //   return document.body.textContent;
    // });

    let emails = [];
    // Loop through each tag
    for (const tag of tags) {
        // Extract text content from elements matching the current tag
        const elements = await page.$$eval(tag, elements => elements.map(element => element.textContent));

        // Regular expression to match email addresses
        const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        
        // Search for emails in each element's text
        elements.forEach(elementText => {
            const matches = elementText.match(regex);
            if (matches) {
                emails = emails.concat(matches);
            }
        });
    }
    
    // Remove duplicates
    emails = [...new Set(emails)];
    
    // previous regex : /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    //  emails = textContent
    //   .split(" ")
    //   .join("\n")
    //   .match(/[\w.-]+@[a-zA-Z-]+\.[a-zA-Z]+/g);
    const finalEmails = [];

    for (let i = 0; i < 3; i++) {
      if (emails && emails.length > 0) {
        if (emails[i]) finalEmails.push(emails[i]);
      }
    }

    return finalEmails;
  } catch (e) {

    console.log(e);
    return [];
  }
};
