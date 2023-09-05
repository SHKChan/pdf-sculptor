// pdf-extraction.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
// Set the worker source path to the CDN URL
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.111/pdf.worker.js';

class PDFSculptor {
  _numPages;
  _pdfDoc;
  PDFSculptor() {
    this._numPages = 0;
    this._pdfDoc = null;
  }

  getNumPages() {
    return this._numPages;
  }

  getPageDoc() {
    return this._pdfDoc;
  }

  async scultpPdf(pdfBuffer) {

    // const response = await fetch(url);
    // const pdfData = await response.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    this._pdfDoc = pdfDocument;
    this._numPages = pdfDocument.numPages;

    const extractedText = [];

    for (let pageNumber = 1; pageNumber <= this._numPages; pageNumber++) {
      const page = await this._pdfDoc.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText.push(`\nPage ${pageNumber}\n${pageText}`);
    }

    return extractedText;
  }

}

export { PDFSculptor };
