window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var transform = Modernizr.prefixed('transform');
transform = transform.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');


var AnimatedDelaunay = function(width, height, vSize){
    this.width = width;
    this.height = height;
    this.vSize = vSize;
    this.vBuffer = new Array(180); // ~ 3 seconds
    this.vertices = new Array(vSize);
    this.speeds = new Array(vSize);
    this.couples = [[0,1],[1,2],[2,0]];
    this.initializeVertices();
    this.x = 0;
    this.y = 0;
    this.k = 0;
};

AnimatedDelaunay.prototype.initializeVertices = function(){
    for(this.x=0; this.x < this.vSize; this.x++){
        this.vertices[this.x] = [Math.random() * this.width, Math.random() * this.height];            
        this.speed = Math.random() * 0.5;
        this.speeds[this.x] = [this.speed - 0.25, 0.25 - this.speed];
    }
};

AnimatedDelaunay.prototype.updatePositions = function(){
  for(this.x=0; this.x < this.vertices.length; this.x++){
      this.vertices[this.x][0] += this.speeds[this.x][0]; 
      this.vertices[this.x][1] += this.speeds[this.x][1];
      if(this.vertices[this.x][0] > this.width || this.vertices[this.x][0] < 0){
          this.speeds[this.x][0] = -1 * this.speeds[this.x][0];
      }
      if(this.vertices[this.x][1] > this.height || this.vertices[this.x][1] < 0){ 
          this.speeds[this.x][1] = -1 * this.speeds[this.x][1];
      }
  }
};

AnimatedDelaunay.prototype.updateLines = function(){
  for(this.y=0; this.y < this.triangles.length; this.y++){
      for(this.x =0; this.x < this.couples.length; this.x++){
          this.point1 = this.triangles[this.y][this.couples[this.x][0]];
          this.point2 = this.triangles[this.y][this.couples[this.x][1]];
          this.lines[(this.y * this.couples.length) + this.x] = this.point1[1] > this.point2[1] ? [this.point2,this.point1] : [this.point1,this.point2];
      }
  }
};

AnimatedDelaunay.prototype.updateStrings = function(){
  for(this.k=0; this.k < this.lines.length; this.k++){
      if(this.lines[this.k]){
          this.line = this.lines[this.k];
          this.squarea = Math.pow(this.line[1][0] - this.line[0][0],2);
          this.squareb = Math.pow(this.line[1][1] - this.line[0][1],2);
          this.length = Math.sqrt(this.squarea + this.squareb);
          this.pos = this.line[0];
          this.cosangle = (Math.pow(this.length,2) + this.squarea - this.squareb) / (2*this.length*(this.line[1][0] - this.line[0][0]));
          this.angle = Math.acos(this.cosangle) * (180/Math.PI);
          this.strings[this.k] = [this.pos, this.length, this.angle];
      }
  }
};

AnimatedDelaunay.prototype.calculateTriangles = function(){
  this.updatePositions();
  this.triangles = d3.geom.delaunay(this.vertices);
  this.strings = [];
  this.lines = [];
  this.updateLines(); 
  this.updateStrings();
};

AnimatedDelaunay.prototype.render = function(){
  var divs = d3.selectAll("delaunay").data(this.strings)
  divs.enter().append('div')
  divs.exit().remove()
  divs.style(transform, function(d){ 
        return "translateZ(0)  translate(" + d[0][0] + "px," + d[0][1] + "px)  rotate(" + d[2] + "deg) scaleX(" + d[1] + ")";
  });
  divs = undefined;
};

function render(){
    var raf = requestAnimFrame(render);
    raf = undefined;
    ad.calculateTriangles();
    ad.render();
}

var ad = new AnimatedDelaunay(window.innerWidth + 100,window.innerHeight + 100, 50);
render();

document.addEventListener('mousemove', function(evt){
    ad.vertices[0] = [evt.clientX,evt.clientY];
});
