const ExcelJS = require("exceljs");
const prompt = require("electron-prompt");

module.exports = async (data_reviews, e) => {
  e.preventDefault();
  const filePath = await prompt({
    title: "Save Excel File",
    label: "Enter file name:",
    inputAttrs: {
      type: "text",
    },
    type: "input",
  });

  const workbook = new ExcelJS.Workbook();

  data_reviews.forEach((d, i) => {
    const worksheet = workbook.addWorksheet(
      `${d["Place Name"].substring(0, 25)}_${i}`
    );

    worksheet.getCell("A1").value = "Place Url";
    worksheet.mergeCells("B1:E1");
    worksheet.getCell("B1").value = d["Map Url"];

    // Check if reviews exist and are not empty
    if (Array.isArray(d.reviews) && d.reviews.length > 0) {
      // Add column headers
      const headers = Object.keys(d.reviews[0]);
      worksheet.addRow(headers);

      // Add data to worksheet
      d.reviews.forEach((row) => {
        const rowData = headers.map((header) => row[header]);
        worksheet.addRow(rowData);
      });
    } else {
      // Add a message if there are no reviews
      worksheet.getCell("A3").value = "No reviews available";
    }
  });

  // Save workbook to file
  workbook.xlsx
    .writeFile(`${require("os").homedir()}/Desktop/${filePath}.xlsx`)
    .then(() => {
      console.log(`Excel file saved successfully`);
    })
    .catch((err) => {
      console.error("Error saving Excel file:", err);
    });
};
