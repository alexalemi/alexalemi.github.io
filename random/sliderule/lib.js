
const powerMeter = document.getElementById("power");

// Fine mode state variables
var fineMode = false;
var shiftKeyPressed = false;
var fineToggleButton = null;

function addPower(increment) {
  powerMeter.valueAsNumber = powerMeter.valueAsNumber + increment
}

// Function to toggle fine mode
function toggleFineMode() {
  fineMode = !fineMode;
  updateFineModeVisual();
}

// Update fine mode button visual state
function updateFineModeVisual() {
  if (!fineToggleButton) {
    fineToggleButton = document.getElementById('fineToggle');
  }

  if (fineToggleButton) {
    if (fineMode || shiftKeyPressed) {
      fineToggleButton.classList.add('active');
      fineToggleButton.textContent = 'Precision Mode';
    } else {
      fineToggleButton.classList.remove('active');
      fineToggleButton.textContent = 'Fine Mode';
    }
  }
}

// Handle shift key press and release
document.addEventListener('keydown', function(event) {
  if (event.key === 'Shift' && !shiftKeyPressed) {
    shiftKeyPressed = true;
    updateFineModeVisual();
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'Shift' && shiftKeyPressed) {
    shiftKeyPressed = false;
    updateFineModeVisual();
  }
});

const radians = 2 * Math.PI / 360;
  margin = 50,
  radius = 200,
  width = (radius+margin)*2,
  height = (radius+margin)*2,
  originTickLength = 90,
  majorTickLength = 40,
  innerMajorLabelRadius = radius - majorTickLength - 20,
  innerOriginLabelRadius = radius - originTickLength - 5,
  halfTickLength = 0.8 * majorTickLength,
  mediumTickLength = 0.5 * majorTickLength,
  minorTickLength = 0.2 * majorTickLength,
  innerMinorLabelRadius = radius - minorTickLength - 25,
  specialTickLength = majorTickLength * 0.9,
  innerSpecialLabelRadius = radius - mediumTickLength - specialTickLength - 15;
  specialTickPad = 5,
  indicatorLength = 15,
  indicatorBleed = 20,
  handBack = 100,
  handBleed = 10,
  handOverlayRadius = 5,
  ringOriginTickLength = 40,
  ringOriginLabelRadius = radius + 30,
  ringMajorTickLength = majorTickLength,
  // ringMajorLabelRadius = -ringMajorTickLength - 20,
  ringMajorLabelRadius = ringOriginLabelRadius,
  ringMinorLabelRadius = radius + minorTickLength + 10;

    

const innerScale = d3.scaleLog()
  .domain([1, 10])
  .range([0, 360])

var innerPosition = 0.0;
var handPosition = 0.0;

// History stacks for positions
var handPositionHistory = []; // History stack for needle positions
var facePositionHistory = []; // History stack for dial positions
var maxHistoryLength = 20;    // Maximum number of positions to remember

// State tracking for clicks
var centerClickState = 0;     // 0: normal, 1: reset to 1 mark
var outerClickState = 0;      // 0: normal, 1: align with needle, 2: align with index

function rotate(d, offset) {
  let angle = innerScale(d) + offset;
  return 'rotate(' + angle + ')';
}

function drawClock(){ //create all the clock elements
  const smallerDim = Math.min(window.innerWidth, window.innerHeight);

  var svg = d3.select("#dial").append("svg")
    .attr('width', "100%")
    .attr('height', "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  var rule = svg.append('g')
    .attr('id','slide-outer')
    .attr('transform','translate(' + (radius + margin) + ',' + (radius + margin) + ')')

  var face = rule.append('g').attr('id', 'slide-face').attr('class', 'animate');
  var ring = rule.append('g').attr('id', 'slide-ring').attr('class', 'animate');

	face.append('g').attr('id','face-overlay')
    .append('circle')
    .attr('class', 'edge')
    .attr('x', 0)
    .attr('y', 0)
    .attr('r', radius);

  // FACE TICKS and LABELS
  // Home Tick
  face.selectAll('.origin-tick')
    .data([1]).enter()
    .append('line')
    .attr('class', 'tick origin-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + originTickLength)
    .attr('transform', d => rotate(d, innerPosition));
	face.selectAll('.origin-label')
		.data([1])
			.enter()
			.append('text')
			.attr('class', 'label origin-label')
			.attr('text-anchor','left')
			.text(function(d){ return d; })
      .attr('x', 2)
      .attr('y', -innerOriginLabelRadius)
      .attr('transform', d => rotate(d, innerPosition));
    

  // Major Ticks
  face.selectAll('.major-tick')
    .data(d3.range(2,10)).enter()
    .append('line')
    .attr('class', 'tick major-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + majorTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Major Labels
	face.selectAll('.major-label')
		.data(d3.range(2,10))
			.enter()
			.append('text')
			.attr('class', 'label major-label')
			.attr('text-anchor','middle')
			.text(function(d){ return d; })
      .attr('x', 0)
      .attr('y', -innerMajorLabelRadius)
      .attr('transform', d => rotate(d, innerPosition));

  // Half Ticks
  face.selectAll('.half-tick')
    .data(d3.range(2.5,10.5,1)).enter()
    .append('line')
    .attr('class', 'tick half-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + halfTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Medium Ticks
  face.selectAll('.med-tick')
    .data(d3.range(1.1, 6.0, 0.1)).enter()
    .append('line')
    .attr('class', 'tick medium-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + mediumTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Minor Ticks
  face.selectAll('.minor-tick')
    .data(d3.range(1.025, 2.0, 0.025).concat(d3.range(2.05, 6.0, 0.05)).concat(d3.range(6.1, 10.0, 0.1))).enter()
    .append('line')
    .attr('class', 'tick minor-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + minorTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Minor Labels
  face.selectAll('.minor-labels')
    .data(d3.range(1, 10)).enter()
    .append('text')
    .attr('class', 'label minor-label')
    .attr('text-anchor','middle')
    .text(function(d){ return d; })
    .attr('x', 0)
    .attr('y', -innerMinorLabelRadius)
    .attr('transform', d => rotate(1 + d/10, innerPosition));

  let specialLocs = [Math.PI, Math.E, Math.sqrt(4 / Math.PI), Math.PI / 180, 180 / Math.PI, Math.log(10), Math.log10(Math.E)] // , 9.81, 746]
  let specialLabels = ["π", "e", "c", "Q", "r", "L", "l", "g", "Hp"]
  // Pi
  face.selectAll('.special-ticks')
    .data(specialLocs).enter()
    .append('line')
    .attr('class', 'tick special-tick')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', -radius + mediumTickLength + specialTickPad)
    .attr('y2', -radius + mediumTickLength + specialTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Pi Label
  face.selectAll('.special-labels')
    .data(specialLocs).enter()
    .append('text')
    .attr('class', 'label special-label')
    .attr('text-anchor','middle')
    .text(function(d, i){ return specialLabels[i]; })
    .attr('x', 0)
    .attr('y', -innerSpecialLabelRadius)
    .attr('transform', d => rotate(d, innerPosition));

  // OUTER RING
  // Home Tick
  ring.selectAll('.origin-tick')
    .data([1]).enter()
    .append('line')
    .attr('class', 'tick origin-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - ringOriginTickLength)
    .attr('transform', d => rotate(d, innerPosition));
	ring.selectAll('.origin-label')
		.data([1])
			.enter()
			.append('text')
			.attr('class', 'label origin-label')
			.attr('text-anchor','left')
			.text(function(d){ return d; })
      .attr('x', 2)
      .attr('y', -ringOriginLabelRadius)
      .attr('transform', d => rotate(d, innerPosition));
  // Major Ticks
  ring.selectAll('.major-tick')
    .data(d3.range(2,10)).enter()
    .append('line')
    .attr('class', 'tick major-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - ringMajorTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Major Labels
	ring.selectAll('.major-label')
		.data(d3.range(2,10))
			.enter()
			.append('text')
			.attr('class', 'label major-label')
			.attr('text-anchor','left')
			.text(function(d){ return d; })
      .attr('x', 5)
      .attr('y', -ringMajorLabelRadius)
      .attr('transform', d => rotate(d, innerPosition));

  // Half Ticks
  ring.selectAll('.half-tick')
    .data(d3.range(2.5,10.5,1)).enter()
    .append('line')
    .attr('class', 'tick half-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - halfTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Medium Ticks
  ring.selectAll('.med-tick')
    .data(d3.range(1.1, 6.0, 0.1)).enter()
    .append('line')
    .attr('class', 'tick medium-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - mediumTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Minor Ticks
  ring.selectAll('.minor-tick')
    .data(d3.range(1.025, 2.0, 0.025).concat(d3.range(2.05, 6.0, 0.05)).concat(d3.range(6.1, 10.0, 0.1))).enter()
    .append('line')
    .attr('class', 'tick minor-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - minorTickLength)
    .attr('transform', d => rotate(d, innerPosition));

  // Minor Labels
  ring.selectAll('.minor-labels')
    .data(d3.range(1, 10)).enter()
    .append('text')
    .attr('class', 'label minor-label')
    .attr('text-anchor','left')
    .text(function(d){
      return d;
    })
    .attr('x', 5)
    .attr('y', -ringMinorLabelRadius)
    .attr('transform', d => rotate(1 + d/10, innerPosition));

  // INDICATOR
  var indicator = rule.append('g')
    .attr('id', 'indicator')
    .append('line')
    .attr('class', 'indicator')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', -radius - indicatorBleed)
    .attr('y2', -radius + indicatorLength);


  // HAND
  var hand = rule.append('g').attr('id', 'hand').attr('class', 'animate')

  hand.append('line')
    .attr('class', 'hand')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', -radius - handBleed)

  hand.append('line')
    .attr('class', 'hand hand-back')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', handBack)
    .attr('y2', 0);

  rule.append('g').attr('id','hand-overlay')
    .append('circle')
    .attr('class', 'hand hand-overlay')
    .attr('x', 0)
    .attr('y', 0)
    .attr('r', handOverlayRadius);

  // History position markers
  var handHistoryMarker = rule.append('g')
    .attr('id', 'hand-history-marker')
    .attr('class', 'history-marker')
    .style('opacity', 0); // Initially hidden

  handHistoryMarker.append('path')
    .attr('d', 'M-5,-' + (radius-20) + ' L0,-' + (radius-10) + ' L5,-' + (radius-20))
    .attr('class', 'history-chevron hand-history-chevron');

  var faceHistoryMarker = rule.append('g')
    .attr('id', 'face-history-marker')
    .attr('class', 'history-marker')
    .style('opacity', 0); // Initially hidden

  faceHistoryMarker.append('path')
    .attr('d', 'M-5,-' + (radius+20) + ' L0,-' + (radius+10) + ' L5,-' + (radius+20))
    .attr('class', 'history-chevron face-history-chevron');

  return [face, hand, handHistoryMarker, faceHistoryMarker];
}

var [face, hand, handHistoryMarker, faceHistoryMarker] = drawClock();

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

function isFineMode() {
  // Return true if either shift is pressed or fine mode is toggled on
  return shiftKeyPressed || fineMode;
}

function wheelDistance(evt) {
  // Use fine mode scaling (1/20) if fine mode or shift key is active
  const fineFactor = isFineMode() ? 20 : 1;
  return evt.deltaY / 10 / fineFactor;
}

function softplus(x) {
  return Math.log(1 + Math.exp(x))/Math.log(2)
}

function touchDistance(dX, dY, shiftKey) {
  // Use fine mode scaling (1/20) if fine mode is active or shift key is pressed
  const fineFactor = isFineMode() || shiftKey ? 20 : 1;
  return 0.5 * dY * softplus(0.01 * dX) / fineFactor;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function optimalMove(frm, to) {
  let diff = to.mod(360) - frm.mod(360);
  if (Math.abs(diff) < 360/2.0) {
    return frm + diff;
  } else {
    return frm - Math.sign(diff) * (360 - Math.abs(diff));
  }
}

const faceReading = document.getElementById('faceReading');
const handReading = document.getElementById('handReading');

// Functions to manage position history
function saveHandPosition(position) {
  handPositionHistory.unshift(position); // Add to start of array
  if (handPositionHistory.length > maxHistoryLength) {
    handPositionHistory.pop(); // Remove oldest item
  }
}

function saveFacePosition(position) {
  facePositionHistory.unshift(position); // Add to start of array
  if (facePositionHistory.length > maxHistoryLength) {
    facePositionHistory.pop(); // Remove oldest item
  }
}

// Functions to update history markers
function updateHandHistoryMarker() {
  if (centerClickState === 1 && handPositionHistory.length > 0) {
    // Show and position the hand history marker
    handHistoryMarker
      .style('opacity', 0.5)
      .attr('transform', 'rotate(' + handPositionHistory[0] + ')');
  } else {
    // Hide the marker
    handHistoryMarker.style('opacity', 0);
  }
}

function updateFaceHistoryMarker() {
  if (outerClickState > 0 && facePositionHistory.length > 0) {
    // Show and position the face history marker
    faceHistoryMarker
      .style('opacity', 0.5)
      .attr('transform', 'rotate(' + facePositionHistory[0] + ')');
  } else {
    // Hide the marker
    faceHistoryMarker.style('opacity', 0);
  }
}

// Reset both history states
function resetHistoryStates() {
  centerClickState = 0;
  outerClickState = 0;
  updateHandHistoryMarker();
  updateFaceHistoryMarker();
}

function setFace(position) {
  innerPosition = optimalMove(innerPosition, position);
  face.attr('transform', 'rotate(' + innerPosition + ')');
  faceReading.innerHTML = d3.format(".3f")(innerScale.invert((handPosition-innerPosition).mod(360)));
}

function setHand(position) {
  handPosition = optimalMove(handPosition, position);
  hand.attr('transform', 'rotate(' + handPosition + ')');
  faceReading.innerHTML = d3.format(".3f")(innerScale.invert((handPosition-innerPosition).mod(360)));
  handReading.innerHTML = d3.format(".3f")(innerScale.invert(handPosition.mod(360)));
}

var page = document.getElementById('page');
var dial = document.getElementById('dial');
var faceElement = document.getElementById('slide-face');

dial.onwheel = (evt) => {
  evt.preventDefault();
  // Reset both history states when wheel is used on either component
  resetHistoryStates();

  if (isDescendant(faceElement, evt.target)) {
    setFace(innerPosition + wheelDistance(evt));
  } else {
    setHand(handPosition + wheelDistance(evt));
  }
};

var ongoingTouches = [];

function copyTouch({ identifier, pageX, pageY, target }) {
  return { identifier, pageX, pageY, target, handPosition, innerPosition,
    startX:pageX, startY:pageY, prevX:pageX, prevY:pageY, speed:1 };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}


function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i=0; i<touches.length; i++) { 
     ongoingTouches.push(copyTouch(touches[i]));
     if (isDescendant(faceElement, touches[i].target)) {
      face.classed('animate', false);
     } else {
      hand.classed('animate', false);
     }
  }
}

function handleEnd(evt) {
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);
    } else {
      console.log("Can't figure out which touch to end.");
    }
  }
}


function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      let ongoingTouch = ongoingTouches[idx];

      let dY = touches[i].pageY - ongoingTouch.prevY;
      let dX = touches[i].pageX - ongoingTouch.prevX;
      let dXtotal = touches[i].pageX - ongoingTouch.startX;
      
      let speed = softplus(0.01 * dXtotal)
      // Apply fine mode factor to touch movements as well
      const fineFactor = isFineMode() || evt.shiftKey ? 20 : 1;
      let delta = 0.5 * dY * speed / fineFactor;

      ongoingTouch.prevY = touches[i].pageY;
      ongoingTouch.prevX = touches[i].pageX;
      ongoingTouch.speed = speed;

      // Reset both history states when touch is used on either component
      resetHistoryStates();

      if (isDescendant(faceElement, ongoingTouch.target)) {
        ongoingTouch.innerPosition += delta;
        setFace(ongoingTouch.innerPosition);
      } else {
        ongoingTouch.handPosition += delta;
        setHand(ongoingTouch.handPosition);
      }
    } else {
      console.log("Can't figure out which touch to continue.");
    }
  }
}


function handleEnd(evt) {
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);
       if (isDescendant(faceElement, touches[i].target)) {
        face.classed('animate', true);
       } else {
        hand.classed('animate', true);
       }
    } else {
      console.log("Can't figure out which touch to end.");
    }
  }
}

function handleCancel(evt) {
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);
     if (isDescendant(faceElement, touches[i].target)) {
      face.classed('animate', true);
     } else {
      hand.classed('animate', true);
     }
  }
}


// Original simple reset functions
function resetHand() {
  setHand(innerPosition);
}

function resetFace() {
  if ((innerPosition - handPosition).mod(360) === 0) {
    setFace(0);
  } else {
    setFace(handPosition);
  }
}

// Functions that simulate direct clicks with history preservation
function simulateHandClick() {
  // Exactly mimic what happens in reset() for center clicks
  if (centerClickState === 0) {
    // Save current position before resetting
    saveHandPosition(handPosition);
    resetHand(); // Reset to align with dial's 1 mark
    centerClickState = 1;
    updateHandHistoryMarker(); // Show the history marker
  } else {
    // Restore previous position
    if (handPositionHistory.length > 0) {
      setHand(handPositionHistory[0]); // Use most recent saved position
    }
    centerClickState = 0;
    updateHandHistoryMarker(); // Hide the history marker
  }
}

function simulateFaceClick() {
  // Exactly mimic what happens in reset() for outer clicks
  switch (outerClickState) {
    case 0:
      // Save current position before resetting
      saveFacePosition(innerPosition);
      // Reset to align with needle
      setFace(handPosition);
      outerClickState = 1;
      updateFaceHistoryMarker(); // Show the history marker
      break;

    case 1:
      // Align with outer index (0 position)
      setFace(0);
      outerClickState = 2;
      updateFaceHistoryMarker(); // Update the history marker
      break;

    case 2:
      // Restore previous position
      if (facePositionHistory.length > 0) {
        setFace(facePositionHistory[0]); // Use most recent saved position
      }
      outerClickState = 0;
      updateFaceHistoryMarker(); // Hide the history marker
      break;
  }
}

function reset(evt) {
  evt.preventDefault();

  // Don't process clicks on buttons or their children
  if (evt.target.tagName === 'BUTTON' || evt.target.closest('button')) {
    return;
  }

  // Reuse our simulation functions for consistency
  if (isDescendant(faceElement, evt.target)) {
    // Center circle click
    simulateHandClick();
  } else {
    // Outer area click
    simulateFaceClick();
  }
}

// Add main event listeners
dial.addEventListener("click", reset, false);
dial.addEventListener("touchstart", handleStart, false);
dial.addEventListener("touchend", handleEnd, false);
dial.addEventListener("touchcancel", handleCancel, false);
dial.addEventListener("touchmove", handleMove, false);

// No extra button listeners needed

// Initialize fine toggle button when page loads
window.addEventListener("load", function() {
  fineToggleButton = document.getElementById('fineToggle');
  updateFineModeVisual();
});
