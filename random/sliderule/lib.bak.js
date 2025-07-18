
const powerMeter = document.getElementById("power");

// Persistence keys
const STORAGE_KEY_PREFIX = 'sliderule_';
const STORAGE_KEYS = {
  FINE_MODE: STORAGE_KEY_PREFIX + 'fine_mode',
  DRAG_MODE: STORAGE_KEY_PREFIX + 'drag_mode',
  SCALE: STORAGE_KEY_PREFIX + 'scale',
  HAND_POSITION: STORAGE_KEY_PREFIX + 'hand_position',
  INNER_POSITION: STORAGE_KEY_PREFIX + 'inner_position',
  POWER: STORAGE_KEY_PREFIX + 'power'
};

const keyMove = 10.0;
const shiftKeyMove = 0.1 * keyMove;

// Mode state variables (with localStorage loading)
var fineMode = loadFromStorage(STORAGE_KEYS.FINE_MODE, false);
var dragMode = loadFromStorage(STORAGE_KEYS.DRAG_MODE, false);
var shiftKeyPressed = false;
var fineToggleButton = null;
var dragToggleButton = null;

// Function to load values from localStorage with default fallback
function loadFromStorage(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;

    // Parse the stored value based on type
    if (typeof defaultValue === 'boolean') {
      return storedValue === 'true';
    } else if (typeof defaultValue === 'number') {
      return parseFloat(storedValue);
    } else {
      return storedValue;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

// Function to save values to localStorage
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value.toString());
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function addPower(increment) {
  powerMeter.valueAsNumber = powerMeter.valueAsNumber + increment;

  // Save the power value
  saveToStorage(STORAGE_KEYS.POWER, powerMeter.valueAsNumber);
}

// Function to toggle fine mode
function toggleFineMode() {
  fineMode = !fineMode;
  updateModesVisual();

  // Save the preference
  saveToStorage(STORAGE_KEYS.FINE_MODE, fineMode);
}

// Function to toggle drag mode
function toggleDragMode() {
  dragMode = !dragMode;
  updateModesVisual();

  // Add or remove drag-mode class to the dial for visual feedback
  const dialElement = document.getElementById('dial');
  if (dialElement) {
    if (dragMode) {
      dialElement.classList.add('drag-mode');
    } else {
      dialElement.classList.remove('drag-mode');
    }
  }

  // Save the preference
  saveToStorage(STORAGE_KEYS.DRAG_MODE, dragMode);
}

// Update mode buttons visual state
function updateModesVisual() {
  // Fine mode button
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

  // Drag mode button
  if (!dragToggleButton) {
    dragToggleButton = document.getElementById('dragToggle');
  }

  if (dragToggleButton) {
    if (dragMode) {
      dragToggleButton.classList.add('active');
      dragToggleButton.textContent = 'Drag Mode';
    } else {
      dragToggleButton.classList.remove('active');
      dragToggleButton.textContent = 'Scrub Mode';
    }
  }
}

// Function to change the active scale
function changeScale(scaleKey) {
  try {
    if (!scales[scaleKey]) {
      console.error(`Scale ${scaleKey} not found`);
      return;
    }

    // Save current hand and inner positions to preserve them
    const savedHandPosition = handPosition;
    const savedInnerPosition = innerPosition;

    // Reset click states to avoid issues with history marker positions
    centerClickState = 0;
    outerClickState = 0;

    // Clear position histories to prevent issues after scale change
    // but first save the current positions if we need them later
    const savedHandHistory = [...handPositionHistory];
    const savedFaceHistory = [...facePositionHistory];
    handPositionHistory = [];
    facePositionHistory = [];

    // Only update the outer scale, inner stays as C/D
    outerScale = scales[scaleKey];
    currentScale = outerScale; // For backward compatibility
    innerScaleDefault = scales["C/D"]; // Always keep inner as C/D

    // Save scale preference
    saveToStorage(STORAGE_KEYS.SCALE, scaleKey);

    // Redraw the slide rule with the new scale
    redrawSlideRule();

    // Add a slight delay to ensure the DOM has been updated
    setTimeout(() => {
      try {
        // Restore hand and inner dial positions to maintain their state
        setHand(savedHandPosition);
        setFace(savedInnerPosition);

        // Force reset the click states to ensure consistent behavior
        centerClickState = 0;
        outerClickState = 0;

        // Start with fresh history after scale change
        // (prevents unexpected behavior when changing scales)
        handPositionHistory = [];
        facePositionHistory = [];

        // Save the current positions as history entries
        saveHandPosition(savedHandPosition);
        saveFacePosition(savedInnerPosition);

        // Update readings and hide any history markers
        updateReadings();
        updateHandHistoryMarker();
        updateFaceHistoryMarker();

        // Re-establish event listeners for the new elements
        const dialElement = document.getElementById('dial');
        if (dialElement) {
          dialElement.onwheel = (evt) => {
            evt.preventDefault();
            resetHistoryStates();
            if (isDescendant(faceElement, evt.target)) {
              setFace(innerPosition + wheelDistance(evt));
            } else {
              setHand(handPosition + wheelDistance(evt));
            }
          };
        }
      } catch (e) {
        console.error("Error in restoring positions after scale change:", e);
      }
    }, 10);
  } catch (e) {
    console.error("Error in changeScale:", e);
  }
}

// Function to update readings based on current positions and scale
function updateReadings() {
  // Calculate outer reading based on the outer scale
  // For outer reading, use only handPosition as the outer ring's 0 is fixed at the top
  const outerAngle = handPosition.mod(360);
  const outerValue = outerScale.valueFunction(outerAngle);

  // Calculate inner reading based on inner scale (always C/D)
  // For inner reading, use the relative position between hand and inner
  const innerAngle = (handPosition - innerPosition).mod(360);
  const innerValue = innerScaleDefault.valueFunction(innerAngle);

  // Apply power exponent to the reading value
  const powerValue = Math.pow(10, powerMeter.valueAsNumber);

  // Format values based on scale type
  let formattedOuterValue;
  let formattedInnerValue;

  // Handle special formatting for different scales - for outer
  if (outerScale.key === "S" || outerScale.key === "T") {
    // Trig functions - use degrees with precision
    formattedOuterValue = outerValue.toFixed(1);
    // Don't apply power to angular values
  } else if (outerScale.key === "L") {
    // Logarithm - show more decimal places
    formattedOuterValue = (outerValue * powerValue).toFixed(4);
  } else {
    // Standard numeric scales
    formattedOuterValue = (outerValue * powerValue).toFixed(3);
  }

  // Inner always uses C/D formatting (standard numeric)
  formattedInnerValue = (innerValue * powerValue).toFixed(3);

  // Add readings to the appropriate labels (without units):
  // faceReading = inner reading (between hand and dial)
  // handReading = outer reading (hand position on outer scale)
  faceReading.innerHTML = formattedInnerValue;  // Inner dial reading
  handReading.innerHTML = formattedOuterValue;  // Outer ring reading
}

// Handle shift key press and release
document.addEventListener('keydown', function(event) {
  if (event.key === 'Shift' && !shiftKeyPressed) {
    shiftKeyPressed = true;
    updateModesVisual();
  }
	if (event.key === 'w') {
		setFace(innerPosition + (isFineMode() ? shiftKeyMove : keyMove));
  }
	if (event.key === 's') {
		setFace(innerPosition - (isFineMode() ? shiftKeyMove : keyMove));
	}
	if (event.key === 'a') {
		setHand(handPosition - (isFineMode() ? shiftKeyMove : keyMove));
  }
	if (event.key === 'd') {
		setHand(handPosition + (isFineMode() ? shiftKeyMove : keyMove));
	}
	if (event.key === 'r') {
		toggleFineMode()
	}
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'Shift' && shiftKeyPressed) {
    shiftKeyPressed = false;
    updateModesVisual();
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
  tinyTickLength = 0.1 * majorTickLength,
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

// Define different scales for the slide rule
const scales = {
  "C/D": {
    key: "C/D",
    name: "C/D Standard",
    domain: [1, 10],
    tickFunction: x => innerScale(x),
    valueFunction: x => innerScale.invert(x),
    specialMarks: [Math.PI, Math.E, Math.sqrt(4 / Math.PI), Math.PI / 180, 180 / Math.PI, Math.log(10), Math.log10(Math.E)],
    specialLabels: ["π", "e", "c", "Q", "r", "L", "l"],
    tickDensity: {
      origin: [1],
      major: d3.range(2, 10),
      half: d3.range(2.5, 10.5, 1),
      medium: d3.range(1.1, 6.0, 0.1),
      minor: d3.range(1.020, 2.0, 0.020).concat(d3.range(2.05, 6.0, 0.05)).concat(d3.range(6.1, 10.0, 0.1)),
      // tiny: d3.range(1.01, 2.0, 0.01).concat(d3.range(2.02, 5.0, 0.02)).concat(d3.range(5.05, 10.0, 0.05))
			tiny: []
    },
    // Define which ticks should have labels and how they should be formatted
    labelDensity: {
      origin: {
        values: [1],
        format: (d) => d.toString()
      },
      major: {
        values: d3.range(2, 10),
        format: (d) => d.toString()
      },
      decimal: {
        values: d3.range(1.1, 2.0, 0.1),
        // format: (d) => (Math.round((d - 1) * 10)).toString()
        format: (d) => d.toFixed(1).toString()
      }
    },
    unit: ""
  },
  "A/B": {
    key: "A/B",
    name: "A/B Square",
    domain: [1, 100],
    tickFunction: x => innerScale(Math.sqrt(x)),
    valueFunction: x => Math.pow(innerScale.invert(x), 2),
    specialMarks: [Math.PI, Math.E, Math.sqrt(4 / Math.PI)],
    specialLabels: ["π", "e", "c"],
    // Define both tick marks and their labels in one structure
    tickDensity: {
      origin: [1],  // Origin mark at 1
			major: d3.range(2, 10, 1).concat(d3.range(10, 100, 10)),
			half: [],
			medium: d3.range(1.1, 2.0, 0.1).concat(d3.range(11, 20, 1)).concat(d3.range(1.5, 10, 1)).concat(d3.range(15,100,10)),
			minor: d3.range(1.02, 2, 0.02).concat(d3.range(10.20, 20.0, 0.20)).concat(d3.range(2.0, 10, 0.1)).concat(d3.range(21, 100, 1)),
			tiny: []
    },
    // Define which ticks should have labels and how they should be formatted
    labelDensity: {
      origin: {
        values: [1],
        format: (d) => d.toString()
      },
      major: {
        values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        format: (d) => d.toString()
      },
      decimal: {
        values: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9],
        format: (d) => d.toString()
      },
      teens: {
        values: [11, 12, 13, 14, 15, 16, 17, 18, 19],
        format: (d) => d.toString()
      }
    },
    unit: ""
  },
  "K": {
    key: "K",
    name: "K Cube",
    domain: [1, 1000],
    tickFunction: x => innerScale(Math.pow(x, 1/3)),
    valueFunction: x => Math.pow(innerScale.invert(x), 3),
    specialMarks: [Math.PI, Math.E],
    specialLabels: ["π", "e"],
    tickDensity: {
      origin: [1],
      major: [10, 100, 1000],
			half: d3.range(2, 10, 1).concat(d3.range(20, 100, 10)).concat(d3.range(200, 1000, 100)),
			medium: [],
      minor: d3.range(1.1, 2, 0.1).concat(d3.range(11, 20, 1)).concat(d3.range(110, 200, 10))
			  .concat(d3.range(2.2, 10, 0.2))
        .concat(d3.range(12, 100, 2))
        .concat(d3.range(120, 1000, 20)),
			tiny: d3.range(1.02, 2, 0.02).concat(d3.range(10.2, 20, 0.2)).concat(d3.range(102, 200, 2))
    },
    // Define which ticks should have labels and how they should be formatted
    labelDensity: {
      origin: {
        values: [1],
        format: (d) => d.toString()
      },
      major: {
        values: [10, 100],
        format: (d) => d.toString()
      },
      half: {
				values: d3.range(2, 10, 1).concat(d3.range(20, 100, 10)).concat(d3.range(200, 1000, 100)),
        format: (d) => d.toString()
      }
    },
    unit: ""
  },
  "L": {
    key: "L",
    name: "L Logarithm",
    domain: [1, 10],
    tickFunction: x => innerScale(Math.pow(10, x)),
    valueFunction: x => Math.log10(innerScale.invert(x)),
    specialMarks: [Math.log10(Math.E)],
    specialLabels: ["e"],
    tickDensity: {
      origin: [0],
      major: d3.range(0.1, 1.0, 0.1),
      half: d3.range(0.05, 1.0, 0.1),
      medium: d3.range(0.01, 1.0, 0.01),
      minor: d3.range(0.005, 1.0, 0.01),
			tiny: []
    },
    // Define which ticks should have labels and how they should be formatted
    labelDensity: {
      origin: {
        values: [0],
        format: (d) => d.toString()
      },
      major: {
        values: d3.range(0.1, 1.0, 0.1),
        format: (d) => d.toFixed(1)
      }
    },
    unit: ""
  },
  "S": {
    key: "S",
    name: "S Sine",
    domain: [0, 90],
    tickFunction: degrees => {
      const radians = degrees * Math.PI / 180;
      const sinValue = Math.sin(radians);
      if (sinValue <= 0) return 0;
      return innerScale(sinValue);
    },
    valueFunction: x => {
      const value = innerScale.invert(x);
      return Math.asin(value) * 180 / Math.PI;
    },
    specialMarks: [30, 45, 60],
    specialLabels: ["30°", "45°", "60°"],
    tickDensity: {
      origin: [90],
      major: [10, 20, 30, 40, 50, 60, 70, 80],
      half: [6, 7, 8, 9, 15, 25, 35, 45, 55, 65, 75],
      medium: d3.range(15, 90, 5),
      minor: d3.range(7, 70, 1),
			tiny: d3.range(6.1, 15, 0.1).concat(d3.range(15.2, 30, 0.2))
    },
    labelDensity: {
      origin: {
        values: [90],
        format: (d) => d.toString() + "°"
      },
      major: {
        values: [10, 20, 30, 40, 50, 60, 70],
        format: (d) => d.toString() + "°"
      },
      half: {
        values: [6, 7, 8, 9, 15, 25, 35, 45, 55, 65],
        format: (d) => d.toString() + "°"
      }
    },
    unit: "°"
  },
  "T": {
    key: "T",
    name: "T Tangent",
    domain: [0, 45],
    tickFunction: degrees => {
      const radians = degrees * Math.PI / 180;
      const tanValue = Math.tan(radians);
      if (tanValue <= 0) return 0;
      return innerScale(tanValue);
    },
    valueFunction: x => {
      const value = innerScale.invert(x);
      return Math.atan(value) * 180 / Math.PI;
    },
    specialMarks: [30, 45],
    specialLabels: ["30°", "45°"],
    tickDensity: {
      origin: [45],
      major: [6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40],
      half: [],
      medium: d3.range(11, 45, 1),
			minor: d3.range(6.1, 10, 0.1).concat(d3.range(10.1, 20, 0.1)).concat(d3.range(20.2, 45, 0.2)),
			tiny: []
    },
    labelDensity: {
      origin: {
        values: [45],
        format: (d) => d.toString() + "°"
      },
      major: {
        values: [10, 15, 20, 25, 30, 35, 40],
        format: (d) => d.toString() + "°"
      },
      half: {
        values: [6, 7, 8, 9], 
        format: (d) => d.toString() + "°"
      }
    },
    unit: "°"
  },
  "CI": {
    key: "CI",
    name: "CI Reciprocal",
    domain: [1, 10],
    tickFunction: x => innerScale(1/x),
    valueFunction: x => 1/innerScale.invert(x),
    specialMarks: [1/Math.PI, 1/Math.E],
    specialLabels: ["1/π", "1/e"],
    tickDensity: {
      origin: [1],
      major: d3.range(2, 10),
      half: d3.range(2.5, 10.5, 1),
      medium: d3.range(1.1, 6.0, 0.1),
      minor: d3.range(1.020, 2.0, 0.020).concat(d3.range(2.05, 6.0, 0.05)).concat(d3.range(6.1, 10.0, 0.1)),
			tiny: []
    },
    labelDensity: {
      origin: {
        values: [1],
        format: (d) => d.toString()
      },
      major: {
        values: d3.range(2, 10),
        format: (d) => d.toString()
      },
      decimal: {
        values: d3.range(1.1, 2.0, 0.1),
        format: (d) => (Math.round((d - 1) * 10)).toString()
      }
    },
    unit: ""
  },
  "ST": {
    key: "ST",
    name: "ST Small Angle",
    domain: [0, 6],
    tickFunction: degrees => {
      // For small angles, sin(θ) ≈ tan(θ) ≈ θ (in radians)
      const radians = degrees * Math.PI / 180;
      // We'll use sine for all calculations in this range
      const sinValue = Math.sin(radians);
      if (sinValue <= 0) return 0;
      return innerScale(sinValue);
    },
    valueFunction: x => {
      const value = innerScale.invert(x);
      // Use asin for the calculation as we're using sine values
      return Math.asin(value) * 180 / Math.PI;
    },
    specialMarks: [Math.PI/180, 1], // Special marks for 1 radian ≈ 0.01745 and 1 degree
    specialLabels: ["1 rad", "1°"],
    tickDensity: {
      origin: [6],
      major: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5],
      half: [1.2, 1.4, 1.6, 1.8, 2.2, 2.4, 2.6, 2.8],
      medium: d3.range(0.7, 6, 0.1),
      minor: d3.range(0.62, 3, 0.02).concat(d3.range(3.05, 6, 0.05)),
      tiny: []
    },
    labelDensity: {
      origin: {
        values: [6],
        format: (d) => d.toString() + "°"
      },
      major: {
        values: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5],
        format: (d) => d.toString() + "°"
      },
      half: {
        values: [],
        format: (d) => d.toString() + "°"
      }
    },
    unit: "°"
  }
};

// Load saved scale from localStorage or use default
const savedScaleKey = loadFromStorage(STORAGE_KEYS.SCALE, "C/D");

// Set default scales
var currentScale = scales[savedScaleKey] || scales["C/D"]; // For backward compatibility
var outerScale = scales[savedScaleKey] || scales["C/D"];   // Scale for the outer ring only
var innerScaleDefault = scales["C/D"];   // Inner scale default, always remains C/D

// Load saved positions or use defaults
var innerPosition = loadFromStorage(STORAGE_KEYS.INNER_POSITION, 0.0);
var handPosition = loadFromStorage(STORAGE_KEYS.HAND_POSITION, 0.0);

// History stacks for positions
var handPositionHistory = []; // History stack for needle positions
var facePositionHistory = []; // History stack for dial positions
var maxHistoryLength = 20;    // Maximum number of positions to remember

// State tracking for clicks
var centerClickState = 0;     // 0: normal, 1: reset to 1 mark
var outerClickState = 0;      // 0: normal, 1: align with needle, 2: align with index

// Function to calculate rotation angle for inner dial (always C/D scale)
function rotateInner(d, offset) {
  let angle = innerScaleDefault.tickFunction(d) + offset;
  return 'rotate(' + angle + ')';
}

// Function to calculate rotation angle for outer ring (based on selected scale)
function rotateOuter(d, offset) {
  // For outer ring, always use 0 offset to keep "1" at the top
  let angle = outerScale.tickFunction(d); // No offset for outer ring
  return 'rotate(' + angle + ')';
}

// Original rotate function for backward compatibility
function rotate(d, offset) {
  let angle = currentScale.tickFunction(d) + offset;
  return 'rotate(' + angle + ')';
}

// Function to redraw the slide rule with the current scale
function redrawSlideRule() {
  // First completely clear the SVG
  d3.select("#dial svg").remove();

  // Remove any existing elements in the dial
  document.getElementById('dial').innerHTML = '';

  // Redraw everything from scratch
  var [newFace, newHand, newHandHistoryMarker, newFaceHistoryMarker] = drawClock();

  // Update references
  face = newFace;
  hand = newHand;
  handHistoryMarker = newHandHistoryMarker;
  faceHistoryMarker = newFaceHistoryMarker;

  // Update the faceElement reference
  faceElement = document.getElementById('slide-face');

  // Re-establish event listeners
  const dialEl = document.getElementById('dial');
  if (dialEl) {
    dialEl.addEventListener("click", reset, false);
    dialEl.addEventListener("touchstart", handleStart, false);
    dialEl.addEventListener("touchend", handleEnd, false);
    dialEl.addEventListener("touchcancel", handleCancel, false);
    dialEl.addEventListener("touchmove", handleMove, false);

    dialEl.onwheel = (evt) => {
      evt.preventDefault();
      resetHistoryStates();
      if (isDescendant(faceElement, evt.target)) {
        setFace(innerPosition + wheelDistance(evt));
      } else {
        setHand(handPosition + wheelDistance(evt));
      }
    };
  }

  // Restore positions
  setFace(innerPosition);
  setHand(handPosition);
}

// Generic function to render labels for both inner and outer scales
function renderLabels(selection, labelType, values, format, params) {
  selection.selectAll(`.${labelType}-label`)
    .data(values)
    .enter()
    .append('text')
    .attr('class', `label ${labelType}-label`)
    .attr('text-anchor', params.anchor)
    .text(d => format(d))
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('transform', d => params.transformFn(d, params.offset));
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

  // FACE TICKS and LABELS (always use innerScaleDefault = C/D)
  // Home Tick
  face.selectAll('.origin-tick')
    .data(innerScaleDefault.tickDensity.origin).enter()
    .append('line')
    .attr('class', 'tick origin-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + originTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));


  // Major Ticks
  face.selectAll('.major-tick')
    .data(innerScaleDefault.tickDensity.major).enter()
    .append('line')
    .attr('class', 'tick major-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + majorTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Render all label types for the inner dial using the labelDensity configurations
  if (innerScaleDefault.labelDensity) {
    // Origin labels
    if (innerScaleDefault.labelDensity.origin) {
      renderLabels(face, 'origin',
        innerScaleDefault.labelDensity.origin.values,
        innerScaleDefault.labelDensity.origin.format,
        {
          anchor: 'middle',
          x: 0,
          y: -innerOriginLabelRadius,
          transformFn: rotateInner,
          offset: innerPosition
        }
      );
    }

    // Major labels
    if (innerScaleDefault.labelDensity.major) {
      renderLabels(face, 'major',
        innerScaleDefault.labelDensity.major.values,
        innerScaleDefault.labelDensity.major.format,
        {
          anchor: 'middle',
          x: 0,
          y: -innerMajorLabelRadius,
          transformFn: rotateInner,
          offset: innerPosition
        }
      );
    }

    // Decimal labels (1.1-1.9)
    if (innerScaleDefault.labelDensity.decimal) {
      renderLabels(face, 'decimal-minor',  // Use a consistent class name with outer dial
        innerScaleDefault.labelDensity.decimal.values,
        innerScaleDefault.labelDensity.decimal.format,
        {
          anchor: 'middle',
          x: 0,
          y: -innerMinorLabelRadius,
          transformFn: rotateInner,
          offset: innerPosition
        }
      );
    }

  }

  // Half Ticks
  face.selectAll('.half-tick')
    .data(innerScaleDefault.tickDensity.half).enter()
    .append('line')
    .attr('class', 'tick half-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + halfTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Medium Ticks
  face.selectAll('.med-tick')
    .data(innerScaleDefault.tickDensity.medium).enter()
    .append('line')
    .attr('class', 'tick medium-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + mediumTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Minor Ticks
  face.selectAll('.minor-tick')
    .data(innerScaleDefault.tickDensity.minor).enter()
    .append('line')
    .attr('class', 'tick minor-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + minorTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Tiny ticks
  face.selectAll('.tiny-tick')
    .data(innerScaleDefault.tickDensity.tiny).enter()
    .append('line')
    .attr('class', 'tick tiny-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius + tinyTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Minor Labels are now handled by the labelDensity.decimal configuration

  // Special ticks and labels
  face.selectAll('.special-ticks')
    .data(innerScaleDefault.specialMarks).enter()
    .append('line')
    .attr('class', 'tick special-tick')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', -radius + mediumTickLength + specialTickPad)
    .attr('y2', -radius + mediumTickLength + specialTickLength)
    .attr('transform', d => rotateInner(d, innerPosition));

  // Special Labels
  face.selectAll('.special-labels')
    .data(innerScaleDefault.specialMarks).enter()
    .append('text')
    .attr('class', 'label special-label')
    .attr('text-anchor','middle')
    .text(function(d, i){ return innerScaleDefault.specialLabels[i]; })
    .attr('x', 0)
    .attr('y', -innerSpecialLabelRadius)
    .attr('transform', d => rotateInner(d, innerPosition));

  // OUTER RING
  // Home Tick
  ring.selectAll('.origin-tick')
    .data(outerScale.tickDensity.origin).enter()
    .append('line')
    .attr('class', 'tick origin-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - ringOriginTickLength)
    .attr('transform', d => rotateOuter(d, 0));
  // Major Ticks
  ring.selectAll('.major-tick')
    .data(outerScale.tickDensity.major).enter()
    .append('line')
    .attr('class', 'tick major-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - ringMajorTickLength)
    .attr('transform', d => rotateOuter(d, 0));

  // Major Ticks
  ring.selectAll('.major-tick')
    .data(outerScale.tickDensity.major).enter()
    .append('line')
    .attr('class', 'tick major-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - ring)
    .attr('transform', d => rotateOuter(d, 0));



  // Render all label types for the outer ring using the labelDensity configurations
  if (outerScale.labelDensity) {
    // Origin labels
    if (outerScale.labelDensity.origin) {
      renderLabels(ring, 'origin',
        outerScale.labelDensity.origin.values,
        outerScale.labelDensity.origin.format,
        {
          anchor: 'left',
          x: 5,
          y: -ringOriginLabelRadius,
          transformFn: rotateOuter,
          offset: 0
        }
      );
    }

    // Major labels
    if (outerScale.labelDensity.major) {
      renderLabels(ring, 'major',
        outerScale.labelDensity.major.values,
        outerScale.labelDensity.major.format,
        {
          anchor: 'left',
          x: 5,
          y: -ringMajorLabelRadius,
          transformFn: rotateOuter,
          offset: 0
        }
      );
    }

    // Half-tick labels
    if (outerScale.labelDensity.half) {
      renderLabels(ring, 'half',
        outerScale.labelDensity.half.values,
        outerScale.labelDensity.half.format,
        {
          anchor: 'left',
          x: 3,
          y: -ringMinorLabelRadius,
          transformFn: rotateOuter,
          offset: 0
        }
      );
    }

    // Decimal labels (1.1-1.9)
    if (outerScale.labelDensity.decimal) {
      renderLabels(ring, 'decimal-minor',  // Use a specific class name that still gets minor styling
        outerScale.labelDensity.decimal.values,
        outerScale.labelDensity.decimal.format,
        {
          anchor: 'left',
          x: 3,
          y: -ringMinorLabelRadius,
          transformFn: rotateOuter,
          offset: 0
        }
      );
    }

    // Teen labels (11-19) - use a different class but with same visual styling as minor labels
    if (outerScale.labelDensity.teens) {
      renderLabels(ring, 'teen-minor',  // Use a specific class name that still gets minor styling
        outerScale.labelDensity.teens.values,
        outerScale.labelDensity.teens.format,
        {
          anchor: 'left',
          x: 3,
          y: -ringMinorLabelRadius,
          transformFn: rotateOuter,
          offset: 0
        }
      );
    }
  }

  // Half Ticks
  ring.selectAll('.half-tick')
    .data(outerScale.tickDensity.half).enter()
    .append('line')
    .attr('class', 'tick half-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - halfTickLength)
    .attr('transform', d => rotateOuter(d, 0));


  // Medium Ticks
  ring.selectAll('.med-tick')
    .data(outerScale.tickDensity.medium).enter()
    .append('line')
    .attr('class', 'tick medium-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - mediumTickLength)
    .attr('transform', d => rotateOuter(d, 0));

  // Minor Ticks
  ring.selectAll('.minor-tick')
    .data(outerScale.tickDensity.minor).enter()
    .append('line')
    .attr('class', 'tick minor-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - minorTickLength)
    .attr('transform', d => rotateOuter(d, 0));

  // Tiny Ticks
  ring.selectAll('.tiny-tick')
    .data(outerScale.tickDensity.tiny).enter()
    .append('line')
    .attr('class', 'tick tiny-tick')
    .attr('x1',0)
    .attr('x2',0)
    .attr('y1',-radius)
    .attr('y2',-radius - tinyTickLength)
    .attr('transform', d => rotateOuter(d, 0));


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

// Function to check if a point is near the needle
function isNearNeedle(x, y) {
  // In drag mode, simply use the outer area to control the needle
  // This is a much simpler approach that makes it easy to grab the needle

  // Get the center coordinates of the dial
  const dialRect = dial.getBoundingClientRect();
  const centerX = dialRect.left + dialRect.width / 2;
  const centerY = dialRect.top + dialRect.height / 2;

  // Calculate the relative position of the point to the center
  const relX = x - centerX;
  const relY = y - centerY;

  // Calculate the distance from center
  const distance = Math.sqrt(relX * relX + relY * relY);

  // Calculate the distance ratio relative to the radius
  // If the touch is in the outer third of the dial, control the needle
  // Use actual on-screen radius rather than the SVG radius constant
  const dialPixelRadius = Math.min(dialRect.width, dialRect.height) / 2;
  return distance > (dialPixelRadius * 0.7); // Outer 30% controls needle
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
  updateReadings();

  // Save inner dial position
  saveToStorage(STORAGE_KEYS.INNER_POSITION, innerPosition);
}

function setHand(position) {
  handPosition = optimalMove(handPosition, position);
  hand.attr('transform', 'rotate(' + handPosition + ')');
  updateReadings();

  // Save hand position
  saveToStorage(STORAGE_KEYS.HAND_POSITION, handPosition);
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
  // In drag mode, determine if this touch is near the needle
  let moveHand = false;
  if (dragMode) {
    moveHand = isNearNeedle(pageX, pageY);
    // Log what we're moving for debugging
    console.log("Drag mode - Moving: " + (moveHand ? "needle" : "inner dial"));
  } else {
    // In scrub mode, use the traditional method (inner vs outer part)
    moveHand = !isDescendant(faceElement, target);
  }

  return {
    identifier,
    pageX,
    pageY,
    target,
    handPosition,
    innerPosition,
    startX: pageX,
    startY: pageY,
    prevX: pageX,
    prevY: pageY,
    speed: 1,
    moveHand: moveHand,
    startAngle: null,
    centerX: null,
    centerY: null
  };
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

  // Get the center coordinates of the dial for circular drag calculations
  const dialRect = dial.getBoundingClientRect();
  const centerX = dialRect.left + dialRect.width / 2;
  const centerY = dialRect.top + dialRect.height / 2;

  for (var i=0; i<touches.length; i++) {
    // Copy and process the touch
    let touch = copyTouch(touches[i]);

    // For drag mode, calculate and store the initial angle
    if (dragMode) {
      // Calculate the initial angle for circular dragging
      const relX = touches[i].pageX - centerX;
      const relY = touches[i].pageY - centerY;

      // Calculate the initial angle in degrees
      const initialAngle = Math.atan2(relY, relX) * 180 / Math.PI;

      // Store the angle and center coordinates
      touch.startAngle = initialAngle;
      touch.centerX = centerX;
      touch.centerY = centerY;
    }

    // Add the touch to ongoing touches
    ongoingTouches.push(touch);

    // Disable animations during touch movement
    if (touch.moveHand) {
      hand.classed('animate', false);
    } else {
      face.classed('animate', false);
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
      let delta = 0;

      // Reset both history states when touch is used
      resetHistoryStates();

      // Handle movement differently based on mode
      if (dragMode) {
        // Circular drag mode - calculate the angle change
        const currentX = touches[i].pageX;
        const currentY = touches[i].pageY;

        // Calculate the current angle relative to the center
        const relX = currentX - ongoingTouch.centerX;
        const relY = currentY - ongoingTouch.centerY;
        const currentAngle = Math.atan2(relY, relX) * 180 / Math.PI;

        // Calculate the angle change
        if (ongoingTouch.prevX !== currentX || ongoingTouch.prevY !== currentY) {
          const prevAngle = Math.atan2(
            ongoingTouch.prevY - ongoingTouch.centerY,
            ongoingTouch.prevX - ongoingTouch.centerX
          ) * 180 / Math.PI;

          // Calculate the angle difference
          // For the needle, currentAngle - prevAngle works correctly (clockwise movement)
          // For the face, we want the inner disk to follow the finger direction directly
          if (ongoingTouch.moveHand) {
            delta = currentAngle - prevAngle;
          } else {
            delta = currentAngle - prevAngle; // Same direction as needle for the inner disk
          }

          // Apply fine mode factor
          const fineFactor = isFineMode() || evt.shiftKey ? 5 : 1;
          delta = delta / fineFactor;
        }

        // Update previous positions
        ongoingTouch.prevX = currentX;
        ongoingTouch.prevY = currentY;

      } else {
        // Original vertical scrub mode
        let dY = touches[i].pageY - ongoingTouch.prevY;
        let dX = touches[i].pageX - ongoingTouch.prevX;
        let dXtotal = touches[i].pageX - ongoingTouch.startX;

        let speed = softplus(0.01 * dXtotal);
        // Apply fine mode factor
        const fineFactor = isFineMode() || evt.shiftKey ? 20 : 1;
        delta = 0.5 * dY * speed / fineFactor;

        // Update previous positions
        ongoingTouch.prevY = touches[i].pageY;
        ongoingTouch.prevX = touches[i].pageX;
        ongoingTouch.speed = speed;
      }

      // Move the appropriate component based on what we're dragging
      if (ongoingTouch.moveHand) {
        ongoingTouch.handPosition += delta;
        setHand(ongoingTouch.handPosition);
      } else {
        ongoingTouch.innerPosition += delta;
        setFace(ongoingTouch.innerPosition);
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
      const touch = ongoingTouches[idx];
      // Remove from active touches
      ongoingTouches.splice(idx, 1);

      // Restore animation based on what was being moved
      if (touch.moveHand) {
        hand.classed('animate', true);
      } else {
        face.classed('animate', true);
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
    if (idx >= 0) {
      const touch = ongoingTouches[idx];
      ongoingTouches.splice(idx, 1);

      // Restore animation based on what was being moved
      if (touch.moveHand) {
        hand.classed('animate', true);
      } else {
        face.classed('animate', true);
      }
    }
  }
}


// Original simple reset functions
function resetHand() {
  setHand(innerPosition);
}

function resetFace() {
  if ((innerPosition - handPosition).mod(360) === 0) {
    // If already aligned with hand, align with origin (0)
    setFace(0);
  } else {
    // Otherwise align with hand
    setFace(handPosition);
  }
}

// Functions that simulate direct clicks with history preservation
function simulateHandClick() {
  // Simplified toggle: either align with inner dial or restore previous position
  if (centerClickState === 0) {
    // First click: save current position and align with inner dial
    saveHandPosition(handPosition);
    resetHand(); // Reset to align with dial's 1 mark
    centerClickState = 1;
    updateHandHistoryMarker(); // Show the history marker
  } else {
    // Second click: restore saved position
    if (handPositionHistory.length > 0) {
      setHand(handPositionHistory[0]); // Use most recent saved position
    }
    centerClickState = 0;
    updateHandHistoryMarker(); // Hide the history marker
  }
}

function simulateFaceClick() {
  // Completely rewritten to guarantee access to the origin position
  // We'll use a simple 3-state cycle with guaranteed positions

  // First, decide what to do based on current state
  switch (outerClickState) {
    case 0: // First click - align with needle
      console.log("Face click state 0->1: Aligning with needle");
      // Save current position before changing
      saveFacePosition(innerPosition);
      // Align with needle
      setFace(handPosition);
      outerClickState = 1;
      break;

    case 1: // Second click - align with origin (0°)
      console.log("Face click state 1->2: Setting to origin (0°)");
      // Set to exact 0 position (12 o'clock)
      setFace(0);
      outerClickState = 2;
      break;

    case 2: // Third click - restore saved position
      console.log("Face click state 2->0: Restoring saved position");
      // Restore previous position if available
      if (facePositionHistory.length > 0) {
        setFace(facePositionHistory[0]);
      } else {
        // Fallback if history is unavailable
        setFace(0);
      }
      outerClickState = 0;
      break;
  }

  // Always update the history marker
  updateFaceHistoryMarker();
}

function reset(evt) {
  evt.preventDefault();

  // Don't process clicks on buttons or their children
  if (evt.target.tagName === 'BUTTON' || evt.target.closest('button')) {
    return;
  }

  // Use the same functions as the buttons for consistency
  if (isDescendant(faceElement, evt.target)) {
    // Center circle click - handle needle position
    simulateHandClick();
  } else {
    // Outer area click - handle face position
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

// Initialize UI elements when the page loads
window.addEventListener("load", function() {
  // Initialize mode buttons
  fineToggleButton = document.getElementById('fineToggle');
  dragToggleButton = document.getElementById('dragToggle');
  updateModesVisual();

  // Initialize dial class based on drag mode state
  const dialElement = document.getElementById('dial');
  if (dialElement) {
    if (dragMode) {
      dialElement.classList.add('drag-mode');
    } else {
      dialElement.classList.remove('drag-mode');
    }
  }

  // Update readings to reflect loaded values
  updateReadings();

  // Initialize scale selector to match the saved or default scale
  const scaleSelect = document.getElementById('scaleSelect');
  if (scaleSelect) {
    scaleSelect.value = currentScale.key;
  }

  // Initialize power meter value from localStorage
  const savedPower = loadFromStorage(STORAGE_KEYS.POWER, 0);
  if (powerMeter && savedPower !== 0) {
    powerMeter.valueAsNumber = savedPower;
  }

  // Add change event listener to save power value when changed manually
  if (powerMeter) {
    powerMeter.addEventListener('change', function() {
      saveToStorage(STORAGE_KEYS.POWER, powerMeter.valueAsNumber);
    });
  }

  // Prevent text selection on the dial
  if (dialElement) {
    dialElement.addEventListener('mousedown', function(e) {
      // Prevent default mousedown behavior which includes text selection
      if (e.detail > 1) { // Check if it's a double-click
        e.preventDefault();
      }
    });
  }
});
