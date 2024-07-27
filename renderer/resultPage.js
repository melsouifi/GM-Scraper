const  cutStr = (str) =>{
    if (str.length <= 25) {
        return str; // Return the original string if it's 15 characters or less
    } else {
        return str.substring(0, 25) + "..."; // Truncate the string and add ellipsis
    }
}


// selectors 
const xlBtn = document.getElementById('xl-btn');
const scrapeReviewsBtn = document.getElementById('scrapReviewsBtn');
const selectAllItemsCheckbox = document.querySelector('.select-all-items-checkbox');

// rows numbers
const rowsNumSection = document.querySelector('#rows-num strong');
const timeSection = document.querySelector('#time-section strong');

// table 
let table  = document.querySelector('.table tbody');

window.data.allData((data)=>{
    
    rowsNumSection.innerText = data.length
    data.forEach((item,i ) => {
        // Create HTML content for the <p> element
        const row = 
        ` <tr>
        <td scope="col">${i + 1}</td>
        <td scope="col">
        <a target="_blank" alt="${item['Map Url']}" href="${item['Map Url']}">
        ${cutStr(item['Map Url'])}
        </a>
        </td>
        <td scope="col">${cutStr(item['Place Name'])}
        </td>
        <td scope="col">${item['Category']}
        </td>
        <td scope="col">${item['rating']}
        </td>
        <td scope="col">${item['Number Of Reviews']}</td>
        <td scope="col">
        <a  target="_blank" href="${item['Website']}">
        ${cutStr(item['Website'])}
        </a>
        </td>
        <td scope="col">${item['Phone Number']}</td>
        <td scope="col">${cutStr(item['Address'])}</td>
        <td scope="col">${item['Latitude']}</td>
        <td scope="col">${item['Longitude']}</td>
        <td scope="col">${item['email 1'] ? item['email 1'] : ''}</td>
        <td scope="col">${item['email 2'] ? item['email 2'] : ''}</td>
        <td scope="col">${item['email 3'] ? item['email 3'] : ''}</td>
        <td scope="col"> <a  target="_blank" href="${item['Main Image']}">${cutStr(item['Main Image'])}</a></td>
        <td scope="col">=> <input type="checkbox" class="item-checkbox"/><td/>
      </tr>
    `

        // Insert the HTML content into the output div
        table.insertAdjacentHTML('beforeend', row);
    });
})

window.data.timeExecuted((time)=>{
    timeSection.innerText = time
})



xlBtn.addEventListener('click', (e)=>{
    e.preventDefault();

     window.downloadProcess.download('xl');
})



selectAllItemsCheckbox.addEventListener('change', (e)=>{
    const itemsCheckboxes  = document.querySelectorAll('.item-checkbox')
    for(let i = 0 ; i < itemsCheckboxes.length; i++){
        selectAllItemsCheckbox.checked ? itemsCheckboxes[i].checked = true : itemsCheckboxes[i].checked = false
    }
})


scrapeReviewsBtn.addEventListener('click', async(e)=>{
    // check if all data selected
    if(selectAllItemsCheckbox.checked){
        scrapeReviewsBtn.disabled = true;
        document.querySelectorAll('input[type="checkbox"]').disabled = true;
        await window.mainProcess.scrapeAllReviews('');
        return
    }

    // check selected items 
    const itemsCheckboxes  = document.querySelectorAll('.item-checkbox');
    const itemsSelectedIndexes = [];
    for(let i = 0; i < itemsCheckboxes.length; i++){
        if(itemsCheckboxes[i].checked) itemsSelectedIndexes.push([i]);
    }
    if(itemsSelectedIndexes.length > 0){
        scrapeReviewsBtn.disabled = true;
        await window.mainProcess.scrapeSomeReviews(itemsSelectedIndexes);
    }
    
})

window.mainProcess.reviewsProcess((condition)=>{
    console.log(condition)
    scrapeReviewsBtn.disabled = false
  })
  
