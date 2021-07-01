window.onload = () => {
  console.log('start')
  let buttonsColor =document.getElementById('colors-wrapper')
  let buttonsDownloaded = document.querySelector('.btns-wrapper')
  let imgUploaded = document.querySelector('img')
  let cvs = document.querySelector('canvas')

  buttonsColor.style.display = 'none'
  buttonsDownloaded.style.display = 'none'

  let dropArea = document.getElementById('upload')
  dropArea.ondragenter = dragenter_handler
  dropArea.ondragover = dragenter_handler
  dropArea.ondragleave = dragleave_handler
  dropArea.ondrop = drop_handler
  dropArea.onclick = load_handler
  let input = document.getElementById('fileElem')

  function load_handler () {
    input.click()
    input.addEventListener('change', (e) => {
      let file = input.files[0];

      console.log(file); // например, my.png

      let reader = new FileReader ()
      reader.readAsDataURL (file)

      reader.onload = () => {
        app.loader.add('image', reader.result).load((loader, resources) => {
          const image = new PIXI.Sprite(resources.image.texture);
          image.x = app.renderer.width / 2;
          image.y = app.renderer.height / 2;
          image.anchor.x = 0.5;
          image.anchor.y = 0.5;
          app.stage.addChild(image);
        });
      }

      let uploadedImage
      if(file) {
        uploadedImage = file.name
      }
      toggleCanvas ()
      imgUploaded.classList.add('hidden')
      buttonsColor.style.display = 'flex'
      buttonsDownloaded.style.display = 'flex'

      input.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
      })

      // input.stopPropagation();
      // input.preventDefault();
      return false;
    })
  }

  function dragenter_handler(e) {
    e.stopPropagation();
    e.preventDefault();
    dropArea.style.background='#ffffff';
    // console.log('drop enter', e)
  }
  function dragleave_handler() {
    dropArea.style.background='rgba(196, 196, 196, 0.36)';
  }
  function drop_handler(e) {
    let dt = e.dataTransfer;
    if(!dt && !dt.files) { return false ; }

    let fs = e.dataTransfer.files // Add event object's properties
    let reader = new FileReader () // FileReader interface to read the file
    reader.readAsDataURL (fs [0]) // file read as DataURL

    reader.onload = () => {
      app.loader.add('image', reader.result).load((loader, resources) => {
        const image = new PIXI.Sprite(resources.image.texture);
        image.x = app.renderer.width / 2;
        image.y = app.renderer.height / 2;
        image.anchor.x = 0.5;
        image.anchor.y = 0.5;
        app.stage.addChild(image);
      });
    }

    let files = dt.files;
    let uploadedImage
    for(let i = 0; i < files.length; i++) {
      uploadedImage = files[i].name
    }
    toggleCanvas ()
    imgUploaded.classList.add('hidden')
    buttonsColor.style.display = 'flex'
    buttonsDownloaded.style.display = 'flex'

    input.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
    })

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  let objdArrow = {
    color: '',
    startX: '',
    startY: '',
    endX: '',
    endY: '',
  }

  buttonsColor.addEventListener('click', e =>{
    let color = e.target.dataset.color
    let colorsArray = [
      {color: 'red', Hexadecimal: 0xfd1212},
      {color: 'green', Hexadecimal: 0x26AB10},
      {color: 'blue', Hexadecimal: 0x0F0BCA},
      {color: 'black', Hexadecimal: 0x000000},
      {color: 'white', Hexadecimal: 0xFFFFFF},
    ]
      for(let i = 0; i < colorsArray.length; i++) {
        if(color === colorsArray[i].color) {
          objdArrow.color = colorsArray[i].Hexadecimal
        }
      }
  })

  cvs.addEventListener('mousedown', e => {
    let coords = cvs.relMouseCoords(e)
    objdArrow.startX = coords.x
    objdArrow.startY = coords.y
  })
  cvs.addEventListener('mouseup', e => {
    let coords = cvs.relMouseCoords(e)
    objdArrow.endX = coords.x
    objdArrow.endY = coords.y
    drawArrow(objdArrow)
  })
}

function relMouseCoords(event){
  let totalOffsetX = 0
  let totalOffsetY = 0;
  let canvasX = 0;
  let canvasY = 0;
  let currentElement = this;

  do{
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  }
  while(currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function save() {
  console.log('save')
  watermark.visible = true
  saveCanvasInPng(app.renderer, app.stage, 'test')
  watermark.visible = false
  console.log(app.stage)
}

function saveCanvasInPng(renderer, sprite, fileName) {
  renderer.extract.canvas(sprite).toBlob(function(b){
    let a = document.createElement('a');
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(b);
    a.click();
    a.remove();
  }, 'image/png');
}

function saveMin () {
  saveCanvasInPngMin(app.renderer, app.stage, 'test_min')
}
function saveCanvasInPngMin(renderer, sprite, fileName) {
  renderer.extract.canvas(sprite).toBlob((b) =>{
    let a = document.createElement('a');

    const dataUrl = renderer.plugins.extract.base64(app.stage)
    // resizeImage(dataUrl, 100, 100, (dataUrl) => {
    resizeImage(dataUrl, app.view.width / 2, app.view.height / 2, (dataUrl) => {
      document.body.append(a);
      a.download = fileName;
      a.href = dataUrl;
      a.click();
      a.remove();
    })
  }, 'image/png', 0.5);
}

function resizeImage(url, width, height, callback) {
  let sourceImage = new Image();

  sourceImage.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
    callback(canvas.toDataURL());
  }
  sourceImage.src = url;
}
