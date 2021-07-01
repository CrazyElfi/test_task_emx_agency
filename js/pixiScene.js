let dropArea = document.getElementById('upload')
let buttonsColor = document.getElementById('colors-wrapper')
let cvs = document.querySelector('canvas')
const app = new PIXI.Application()

app.stage.sortableChildren = true
let style = {
  fontFamily: "Arial",
  fontSize: 60,
  fill : 'transparent',
  stroke : '#fd0127',
  strokeThickness : 1,
  wordWrap : true,
  wordWrapWidth : 440
}
let watermark = new PIXI.Text('Test_task_emx_agency', style);
watermark.x = 80;
watermark.y = 300;
watermark.visible = false
app.stage.addChild(watermark)

let areaPixi = dropArea.appendChild(app.view)
areaPixi.classList.add('hidden')

function toggleCanvas () {
  if (areaPixi.classList.contains('hidden')) {
    areaPixi.classList.remove('hidden')
    areaPixi.id = 'canvas-field'
  }
}

function drawArrow (data) {
  let line = new PIXI.Graphics()
  let arrow = new PIXI.Graphics()

  let startX = data.startX
  let endX = data.endX
  let startY = data.startY
  let endY = data.endY

  line.lineStyle(4, data.color, 1)
  line.moveTo(startX, startY)
  line.lineTo(endX, endY)

  let angle = Math.atan2(endY - startY, endX - startX)
  arrow.lineStyle(4, data.color, 1)
  arrow.moveTo((endX - 40), endY)
  arrow.lineTo(endX, endY)
  arrow.lineTo((endX), (endY + 40))

  let texture = app.renderer.generateTexture(arrow)
  let spriteArrow = new PIXI.Sprite(texture)

  spriteArrow.x = endX
  spriteArrow.y = endY
  spriteArrow.anchor.set(1, 0)
  spriteArrow.angle = angle * (180 / Math.PI) + 45//degress
  watermark.zIndex = app.stage.children.length

  app.stage.addChild(line)
  app.stage.addChild(spriteArrow)
}
