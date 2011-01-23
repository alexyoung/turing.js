Turing is a JavaScript framework.  The source is available from GitHub at [alexyoung/turing.js](https://github.com/alexyoung/turing.js/).

The DOM, Events, and Anim modules are chainable, like this:

        turing('p')
          .fadeIn(2000)
          .animate(1000, { color: '#ff0000' })
          .click(function() { alert('clicked'); });

This is the easiest way to use Turing.

The DOM results can be manipulated with the `turing.enumerable` module methods:

        turing('p')
          .map(function(element) { return element.innerHTML; })
          .values();

The `values` method returns the results of the last operation, in this case each paragraph's `innerHTML`.

Arrays or objects can be iterated using `turing()`, too:

        turing([1, 2, 3])
          .map(function(n) { return n + 1; })
          .values();
        
        // => [2, 3, 4]


