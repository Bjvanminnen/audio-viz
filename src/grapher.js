import $ from 'jquery';

var resetCount = 0;
var COLORS = ['red', 'blue', 'green']


var Grapher = function (canvas) {
  this.canvas_ = canvas;
  this.ctx_ = canvas.getContext('2d');
  this.width_ = canvas.getAttribute('width');
  this.height_ = canvas.getAttribute('height');
  this.origin_ = this.height_ / 2;

  this.x_ = 0;

  this.options_ = {};

  var self = this;
  $(document).click(function () {
    self.onClick();
  });
};
module.exports = Grapher;

Grapher.prototype.graph = function (data) {
  // console.log('graph ' + this.x_);
  var options = this.options_ || {};
  options.style = options.style || COLORS[resetCount % COLORS.length];

  var ctx = this.ctx_;
  var origin = this.origin_;

  var yFromData = function (index) {
    return origin - origin * data[index];
  };

  // drawLine(ctx, this.x_);

  ctx.strokeStyle = options.style;

  ctx.clearRect(this.x_, 0, data.length * 5, this.height_);

  ctx.beginPath();
  ctx.moveTo(this.x_, yFromData(0));

  var step = 1;

  var x, y;
  for (var i = 0; i < data.length; i += step) {
    x = this.x_ + i / step;
    y = yFromData(i);
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  this.x_ = x;

  if (this.x_ > this.width_) {
    this.x_ = 0;
  }
};

function drawLine(ctx, x, height) {
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

Grapher.prototype.reset = function (options) {
  resetCount++;
  console.log('reset');
  this.x_ = 0;
  this.options_ = options;
};

Grapher.prototype.onClick = function () {
  drawLine(this.ctx_, this.x_, this.height_);
};
