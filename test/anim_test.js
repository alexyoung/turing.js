Riot.require('../turing.core.js');
Riot.require('../turing.anim.js');

Riot.context('turing.anim.js', function() {
  given('a box to change', function() {
    /*setTimeout(function() {
    turing.anim.animate(box, 1000, { 'backgroundColor': '#00ff55' });
    }, 1000)
    */
    turing.anim.highlight(document.getElementById('test-results'));
    //turing.anim.fadeOut(box, 1000);
    //turing.anim.fadeIn(box, 1000);
  });

  given('a long hex colour', function() {
    should('convert to the correct RGB',
      turing.anim.parseColour('#ff00ff').toString()
    ).equals('rgb(255, 0, 255)');
  });

  given('a small hex colour', function() {
    should('convert to the correct RGB',
      turing.anim.parseColour('#fff').toString()
    ).equals('rgb(255, 255, 255)');
  });

  given('An RGB colour', function() {
    should('leave it alone',
      turing.anim.parseColour('rgb(255, 255, 255)').toString()
    ).equals('rgb(255, 255, 255)');
  });
});

Riot.run();
