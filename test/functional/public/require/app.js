require(['turing.anim'], function(anim) {
  turing('#results').html('Turing has loaded with the DOM module.');
  turing.anim.chain(turing('#animate')[0]).move(1000, { x: '100px', y: '100px', easing: 'ease-in-out' });
});
