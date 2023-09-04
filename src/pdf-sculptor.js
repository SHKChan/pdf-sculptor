// pdf-extraction.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];

async function extractTextFromPDF(pdfBuffer) {
  // const response = await fetch(url);
  // const pdfData = await response.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument(pdfBuffer).promise;
  const numPages = pdfDocument.numPages;

  const extractedText = [];

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    extractedText.push(`Page ${pageNumber}: ${pageText}`);
  }
  return extractedText;
}

export { extractTextFromPDF };
