var makeSound = function() {
  var sound = {};

  sound.init = function() {
    sound.makeThePhillipGlassThing();
    sound.collide = sound.makeCollision();
  };

  sound.makeThePhillipGlassThing = function() {
    var _sound;
    
    timbre.rec(function(output) {
      var midis = [49, 71, 80, 76, 69, 73, 72, 76].scramble();
      var msec  = timbre.timevalue("bpm120 l08");
      var synth = T("OscGen", {env:T("perc", {r:msec, ar:true})});

      T("interval", {interval:msec}, function(count) {
        if (count < midis.length) {
          synth.noteOn(midis[count], 80);
        } else {
          output.done();
        }
      }).start();

      output.send(synth);
    }).then(function(result) {
      var L = T("buffer", {buffer:result, loop:true});
      var R = T("buffer", {buffer:result, loop:true});

      var num = 400;
      var duration = L.duration;

      R.pitch = (duration * (num - 1)) / (duration * num);

      _sound = T("delay", {time:"bpm120 l16", fb:0.1, cross:true},
        T("pan", {pos:-0.6}, L), T("pan", {pos:+0.6}, R)
      );
      _sound.play();
      sound.bg = _sound;
    });
  };

  sound.pauseBackground = function() {
    if (sound.bg !== undefined) {
      sound.bg.pause();
    }
  };

  sound.resumeBackground = function() {
    if (sound.bg !== undefined) {
      sound.bg.play();
    }
  };

  sound.makeCollision = function() {
    var sine1 = T("sin", {freq:540, mul:0.7});
    var sine2 = T("sin", {freq:260, mul:0.5});

    return T("perc", {r:500}, sine1, sine2).on("ended", function() {
      this.pause();
    });
  };

  sound.playCollide = function() {
    sound.collide.bang().play();
  };

  sound.init();
  return sound;
};