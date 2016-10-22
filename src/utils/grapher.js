import $ from 'jquery';

let resetCount = 0;
const COLORS = ['red', 'blue', 'green']

export default function Grapher (canvas, options={}) {
  if (!canvas) {
    throw new Error('grapher requires canvas');
  }
  this.canvas_ = canvas;
  this.ctx_ = canvas.getContext('2d');
  this.width_ = canvas.getAttribute('width');
  this.height_ = canvas.getAttribute('height');
  this.origin_ = this.height_ / 2;

  // this.x_ = 0;

  this.options_ = options;

  $(document).click(() => {
    this.drawLine();
  });
};

Grapher.prototype.graph = function (data) {
  const style = this.options_.style || COLORS[resetCount % COLORS.length];

  const ctx = this.ctx_;
  const origin = this.origin_;

  const yVals = data.map(val => origin - origin * val);

  ctx.strokeStyle = style;

  ctx.clearRect(0, 0, this.width_, this.height_);

  ctx.beginPath();
  ctx.moveTo(0, yVals[0]);

  const step = 3;

  const last = Math.min(yVals.length, (this.width_ + 1) * step);
  for (let i = 0; i < last; i += step) {
    const x = i / step;
    ctx.lineTo(x, yVals[i]);
  }
  ctx.stroke();
};

function drawLine(ctx, x, height) {
  ctx.strokeStyle = 'yellow';
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

Grapher.prototype.reset = function (options) {
  resetCount++;
  console.log('reset');
  // this.x_ = 0;
  this.options_ = options;
};

Grapher.prototype.drawLine = function () {
  drawLine(this.ctx_, this.x_, this.height_);
}
