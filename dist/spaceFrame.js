// Generated by CoffeeScript 1.4.0

/*
# * spaceFrame
# * https://github.com/brewster1134/jquery-space-frame
# *
# * Copyright (c) 2012 Ryan Brewster
# * Licensed under the MIT license.
*/


(function() {

  window.log = function() {
    log.history = log.history || [];
    log.history.push(arguments_);
    if (this.console) {
      return console.log(Array.prototype.slice.call(arguments_));
    }
  };

  (function($) {
    var clipPanel, clipPanels, methods;
    methods = {
      init: function(options) {
        var defaults;
        defaults = {
          speed: 500
        };
        return this.each(function() {
          var $sf, bottomPanels, contents, data, leftPanels, panelIndex, rightPanels, scrubber, topPanels;
          $sf = $(this);
          $sf.options = $.extend(options, defaults);
          data = $sf.data('space-frame');
          if (!data) {
            $sf.data('space-frame', {
              target: $sf
            });
            scrubber = $sf.find('.space-scrubber');
            contents = $sf.find('.space-panel');
            $sf.panelOne = $(contents.get(0));
            $sf.panelTwo = $(contents.get(1));
            $sf.panelThree = $(contents.get(2));
            $sf.panelFour = $(contents.get(3));
            leftPanels = $sf.panelOne.add($sf.panelThree);
            rightPanels = $sf.panelTwo.add($sf.panelFour);
            topPanels = $sf.panelOne.add($sf.panelTwo);
            bottomPanels = $sf.panelThree.add($sf.panelFour);
            $sf.maxContentWidth = null;
            $sf.maxContentHeight = null;
            panelIndex = contents.length;
            if ($sf.hasClass('x')) {
              if (contents.length !== 2) {
                console.warn('There should only be 2 panels for an x axis space frame!');
              }
              $sf.restrictAxis = 'x';
            } else if ($sf.hasClass('y')) {
              if (contents.length !== 2) {
                console.warn('There should only be 2 panels for a y axis space frame!');
              }
              $sf.restrictAxis = 'y';
            }
            $sf.css({
              width: function() {
                contents.each(function() {
                  if (!$(this).is(':empty')) {
                    return $sf.maxContentWidth = Math.max($sf.maxContentWidth, $(this).width());
                  }
                });
                return $sf.maxContentWidth;
              },
              height: function() {
                contents.each(function() {
                  if (!$(this).is(':empty')) {
                    return $sf.maxContentHeight = Math.max($sf.maxContentHeight, $(this).height());
                  }
                });
                return $sf.maxContentHeight;
              }
            });
            scrubber.css({
              display: 'block',
              marginTop: (scrubber.height() / 2) * -1,
              marginBottom: (scrubber.height() / 2) * -1,
              marginLeft: (scrubber.width() / 2) * -1,
              marginRight: (scrubber.width() / 2) * -1,
              top: $sf.maxContentHeight,
              left: $sf.maxContentWidth
            });
            contents.css({
              clip: 'rect(0px, ' + $sf.maxContentWidth + 'px, ' + $sf.maxContentHeight + 'px, 0px)'
            });
            contents.each(function() {
              $(this).css({
                zIndex: panelIndex
              });
              return panelIndex--;
            });
            leftPanels.css({
              left: 0
            });
            rightPanels.css({
              right: 0
            });
            topPanels.css({
              top: 0
            });
            bottomPanels.css({
              bottom: 0
            });
            scrubber.draggable({
              containment: 'parent',
              drag: function(e, ui) {
                return clipPanels($sf, ui.position.left, ui.position.top, false);
              }
            });
            if ($sf.restrictAxis) {
              scrubber.draggable('option', 'axis', $sf.restrictAxis);
            }
            return scrubber.on({
              touchmove: function(e) {
                return console.log(e);
              }
            });
          }
        });
      },
      animate: function(positionArray) {
        return this.each(function() {
          var $sf, xPos, yPos;
          if ($(this).data('space-frame')) {
            $sf = $(this).data('space-frame').target;
            xPos = positionArray[0];
            yPos = positionArray[1];
            return clipPanels($sf, xPos, yPos, true);
          }
        });
      },
      refresh: function() {
        return this.each(function() {
          var $sf;
          $sf = $(this);
          if ($(this).data('space-frame')) {
            $sf.data('space-frame', null);
          }
          return $sf.spaceFrame('init');
        });
      },
      destroy: function() {
        return this.each(function() {
          var $sf;
          $sf = $(this);
          $sf.find('.space-scrubber').hide();
          $sf.find('.space-panel').css('clip', '');
          return $sf.data('space-frame', null);
        });
      }
    };
    $.fn.spaceFrame = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist for the spaceFrame");
      }
    };
    clipPanels = function(sf, xPos, yPos, animate) {
      if (animate == null) {
        animate = true;
      }
      if (sf.restrictAxis === 'x') {
        clipPanel(sf.panelOne, 0, xPos, sf.maxContentHeight, 0, animate);
        clipPanel(sf.panelTwo, 0, sf.maxContentWidth, sf.maxContentHeight, xPos, animate);
      } else if (sf.restrictAxis === 'y') {
        clipPanel(sf.panelOne, 0, sf.maxContentWidth, yPos, 0, animate);
        clipPanel(sf.panelTwo, yPos, sf.maxContentWidth, sf.maxContentHeight, 0, animate);
      } else {
        clipPanel(sf.panelOne, 0, xPos, yPos, 0, animate);
        clipPanel(sf.panelTwo, 0, sf.maxContentWidth, yPos, xPos, animate);
        clipPanel(sf.panelThree, yPos, xPos, sf.maxContentHeight, 0, animate);
        clipPanel(sf.panelFour, yPos, sf.maxContentWidth, sf.maxContentHeight, xPos, animate);
      }
      if (animate) {
        return sf.find('.space-scrubber').animate({
          top: yPos,
          left: xPos
        }, sf.options.speed);
      }
    };
    return clipPanel = function(panel, top, right, bottom, left, animate) {
      var clipCss, sf;
      sf = panel.parent().data('space-frame').target;
      clipCss = function(panel) {
        return panel.css({
          clip: 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)'
        });
      };
      if (animate) {
        return panel.stop(true).animate({
          clip: 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)'
        }, {
          duration: sf.options.speed,
          step: function(now, fx) {
            var clipRE, endRE, startRE;
            clipRE = /rect\(([0-9.]{1,})(px|em)[,]? ([0-9.]{1,})(px|em)[,]? ([0-9.]{1,})(px|em)[,]? ([0-9.]{1,})(px|em)\)/;
            startRE = fx.start.match(clipRE);
            endRE = fx.end.match(clipRE);
            top = parseInt(startRE[1], 10) + fx.pos * (parseInt(endRE[1], 10) - parseInt(startRE[1], 10));
            right = parseInt(startRE[3], 10) + fx.pos * (parseInt(endRE[3], 10) - parseInt(startRE[3], 10));
            bottom = parseInt(startRE[5], 10) + fx.pos * (parseInt(endRE[5], 10) - parseInt(startRE[5], 10));
            left = parseInt(startRE[7], 10) + fx.pos * (parseInt(endRE[7], 10) - parseInt(startRE[7], 10));
            return clipCss(panel);
          }
        });
      } else {
        return clipCss(panel);
      }
    };
  })(jQuery);

}).call(this);
