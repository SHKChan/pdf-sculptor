import { extractTextFromPDF } from './pdf-sculptor.js';


function main() {
    // catch 'drop' element
    const drop = document.getElementById('drop');
    if (drop.addEventListener) {
        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
    }

    const pdfFile = document.getElementById('pdf-file');
    pdfFile.addEventListener('change', handleFile, false);
}

function handleDrop(e) {
    $('#result').text('Transfering file...');
    e.stopPropagation(); // stop passing event upward
    e.preventDefault(); // prevent default action for file
    var files = e.dataTransfer.files;
    var f = files[0];
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;
            $('#result').text('Parsing PDF...');
            extractTextFromPDF(data).then(text => {
                $('#result').text(text);
            })
        };
        reader.readAsArrayBuffer(f);
    }
}

function handleDragover(e) {
    $('#result').text('Transfering file...');
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleFile(e) {
    $('#result').text('Transfering file...');
    var files = e.target.files;
    var f = files[0];
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;
            $('#result').text('Parsing PDF...');
            extractTextFromPDF(data).then(text => {
                $('#result').text(text);
            })
        };
        reader.readAsArrayBuffer(f);
    }
}

main();