import { PDFSculptor } from '../src/pdf-sculptor.js';



// catch 'drop' element
const drop = document.getElementById('drop');
if (drop.addEventListener) {
    drop.addEventListener('dragenter', handleDragover, false);
    drop.addEventListener('dragover', handleDragover, false);
    drop.addEventListener('drop', handleDrop, false);
}

// cath 'upload' element
const pdfFile = document.getElementById('upload');
pdfFile.addEventListener('change', handleFile, false);

// for PDF rendering
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.2;
const cvs = document.getElementById('pdf'),
    ctx = cvs.getContext('2d');

document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);


function handleDrop(e) {
    $('#result').text('Transfering file...');
    e.stopPropagation(); // stop passing event upward
    e.preventDefault(); // prevent default action for file
    var files = e.dataTransfer.files;
    var f = files[0];
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function (e) {
        var data = e.target.result;
        $('#text').text('Parsing PDF...');
        let pdf = new PDFSculptor();
        pdf.scultpPdf(data).then(text => {
            $('#text').text(text);
        })
    };
    reader.readAsArrayBuffer(f);
}

function handleDragover(e) {
    $('#text').text('Transfering file...');
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleFile(e) {
    $('#text').text('Transfering file...');
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function (e) {
        var data = e.target.result;
        $('#text').text('Parsing PDF...');
        let pdf = new PDFSculptor();
        pdf.scultpPdf(data).then(text => {
            $('#text').text(text);
            pdfDoc = pdf.getPageDoc();
            document.getElementById('page_count').textContent = pdf.getNumPages();
            renderPage(pageNum);
        })
    };
    reader.readAsArrayBuffer(f);
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport({ scale: scale });
        cvs.height = viewport.height;
        cvs.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Update page counters
    document.getElementById('page_num').textContent = num;
}