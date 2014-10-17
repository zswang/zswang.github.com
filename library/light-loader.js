var lightLoader = lightLoader || {};

void function (exports) {
  /**
   * 加载进度条
   * @see http://codepen.io/jackrugile/pen/BlDjk
   */

  var rand = function(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
  };

  var format = function(template, data) {
    return String(template).replace(/#\{([\w-_]*)\}/g, function(all, key) {
      return data[key];
    });
  };

  var hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
  };

  function createLightLoader(options) {
    if (!options) {
      throw new Error('The options is not specified.');
    }
    if (!options.canvas) {
      throw new Error('The options.canvas is not specified.');
    }

    var canvas = options.canvas;
    var context = canvas.getContext('2d');
    var loaded = 10; // 是否加载完成
    var gravity = 0.15 * 0.06;  // 重力加速度，单位：像素/毫秒
    // 进度条速度
    var loaderSpeed = options['loaderSpeed'] || options['loader-speed'] || 0.02;
    // 进度条高宽
    var loaderHeight = options['loaderHeight'] || options['loader-height'] || 10;
    var loaderWidth = options['loaderWidth'] || options['loader-width'] || 310;

    var hueStart = options['hueStart'] || options['hue-start'] || 0; // 最小色调
    var hueEnd = options['hueEnd'] || options['hue-end'] || 120; // 最大色调
    var hue = 0; // 色调
    var particleRate = options['particleRate'] || options['particle-rate'] || 4; // 粒子比率
    var particleLift = options['particleLift'] || options['particle-lift'] || 180;

    var loader = {
      x: (canvas.width - loaderWidth) / 2,
      y: (canvas.height - loaderHeight) / 2
    };

    var clear = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    var renderLoader = function() {
      context.save();
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = '#000';
      context.fillRect(
        loader.x, loader.y,
        loaderWidth, loaderHeight
      );

      hue = hueStart + (loaded / 100) * (hueEnd - hueStart);

      var newWidth = (loaded / 100) * loaderWidth;
      context.fillStyle = format('hsla(#{hue}, 100%, 40%, 1)', { hue: hue });
      context.fillRect(loader.x, loader.y, newWidth, loaderHeight);

      context.fillStyle = '#222';
      context.fillRect(loader.x, loader.y, newWidth, loaderHeight / 2);

      context.restore();
    };

    var updateLoader = function(dur) {
      loaded = (loaded + dur * loaderSpeed) % 100;
    };

    var particles = [];

    var createParticles = function(dur) {
      var i = parseInt(particleRate * dur * 0.06 + 0.5);
      var x = loader.x + (loaded / 100 * loaderWidth) - rand(0, 1);
      var y = canvas.height / 2 + rand(0, loaderHeight) - loaderHeight / 2;
      while (i--) {
        particles.push({
          b: new Date,
          x0: x, // 初始位置
          y0: y,
          x: x, // 当前位置
          y: y,
          vx: (rand(0, 4) - 2) / 100 * 0.06, // 初速度
          vy: (rand(0, particleLift) - particleLift * 2) / 100 * 0.06,
          ax: ((rand(0, 6) - 3) / 100) * 0.06 / 25, // 加速度
          ay: gravity / 15,
          hue: hue,
          width: rand(1, 4) / 2,
          height: rand(1, 4) / 2,
        });
      }
    };

    var updateParticles = function(dur) {
      var now = new Date;
      particles = particles.filter(function(particle) {
        var t = now - particle.b;
        particle.x = particle.x0 + particle.vx * t + 0.5 * particle.ax * t * t;
        particle.y = particle.y0 + particle.vy * t + 0.5 * particle.ay * t * t;
        return particle.y <= canvas.height;
      });
    };

    var renderParticles = function() {
      context.save();

      particles.forEach(function(particle) {
        context.fillStyle = format('hsla(#{hue}, 100%, #{lightness}%, #{alpha})', {
          hue: particle.hue,
          lightness: rand(50, 70),
          alpha: rand(20, 100) / 100
        });
        // console.log(particle.x, particle.y, particle.width, particle.height);
        context.fillRect(particle.x, particle.y, particle.width, particle.height);
      });
      context.restore();
    };

    var req;
    return {
      toggle: function() {
        if (req) {
          this.stop();
        } else {
          this.start();
        }
      },
      start: function() {
        if (req) {
          return;
        }
        req = jframes.request(function(frame) {

          clear();

          createParticles(frame.dur);
          updateParticles(frame.dur);
          updateLoader(frame.dur);

          renderLoader();
          renderParticles();

          frame.next();
        });
      },
      stop: function() {
        if (!req) {
          return;
        }

        jframes.release(req);
        req = false;
      }
    }
  }

  function create(options) {
    return createLightLoader(options);
  }

  exports.create = create;

}(lightLoader);
