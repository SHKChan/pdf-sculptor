# pdf-sculptor
Your site is live at [pdf-sculptors](https://shkchan.github.io/pdf-sculptor/)

- How PDF is structured

  
| Header      | Body[Objects]                                              | XRef Table                    | Trailer                         |
| :---------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------- |
| PDF version | Sequence of Objects:                                       | mapping objId and byte offset | root objID, xRef byte offset    |
|             | fonts, drawing cmds, images, words, bookmarks, form fields |                               | root obj = ref to pages catalog |
|             |                                                            |                               |                                 |

- Processing in pdf.js
  1. Get plain Uint8Array via XHR2, build stream
  2. new PDFDoc(stream): read XRef, root object
  3. page = PDFDoc.getPage(N)
  4. page.startRendering(graphics)
     - read& convert all PDF cms => IR, this called PartialEvaluator
     - load required objects(fonts, images)
     - graphics.executeIR(IR), via CanvasGraphics back-end
- Images
  1. JPEG streams:
     - DOMImg.src = 'data:image/jpeg;base64,' + window.btoa(bytesToString(bytes));
  2. If not JPEG stream:
     - read bytes, convert to colorspace
     - imgData = canvas.getImageData()
     - fillWithPixelData(bytes, imgData)
     - canvas.putImageData(imgData)
