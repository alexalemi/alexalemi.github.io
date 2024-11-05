const PI = Math.PI;
const red = "#a4161a";
const dark = "#2d2142";
const light = "#ffffff";
const gray = "#eee";

function degToRad(deg) {
	return deg / 180 * PI;
}

function radToDeg(rad) {
	return rad / PI * 180;
}

//Web Component
class Meter extends HTMLElement {
	static observedAttributes = ["probability", "labels"];

	constructor() {
		super();
	}

	get(name, base) {
		if (this.hasAttribute(name)) {
			return this.getAttribute(name);
		} else {
			return base;
		}
	}

	connectedCallback() {
		// Put the construction logic here.

		// Create a shadow root
		const shadow = this.attachShadow({ mode: "open" });

		// Get the width
		const width = this.get('width', 800);
		const height = this.get('height', width * 250 / 800);

		// Base SVG
		const svg = svgElem("svg", {
			// width, height, viewBox: '0 0 800 250',
			viewBox: '0 0 800 250',
			style: "border-bottom: 3px solid black;"
		});
		this.svg = svg;

		// Quarter circle
		const centerX = width / 2;
		this.centerX = centerX;
		const unit = 19/20 * width / 6;
		this.unit = unit;
		const centerY = (4.5) * unit;
		this.centerY = centerY;
		const radius = 4 * unit;
		this.radius = radius;
		const strokeWidth = 2;

		const quarter = svgElem("path", 
			{d: generateArcPath(centerX, centerY, radius, -3*PI/4, -PI/4), 
			 stroke: dark,
			 "fill-opacity": "0.0",
			 "stroke-width": strokeWidth,
			});
		svg.appendChild(quarter);

		const annWidth = 1/8;
		const outerRadius = radius + annWidth/2 * unit;
		const innerRadius = radius - annWidth/2 * unit;

		// Draw segments
		for (let t = 0; t < 6; t++) {
			const startAngle = -3*PI/4 + t * Math.PI/2/6;
			const endAngle = -3*PI/4 + (t+1) * Math.PI/2/6;
			const path = generateAnnulusPath(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle);
			svg.appendChild(svgElem("path", { 
				d: path, 
				fill: (t % 2 == 0) ? light : gray, 
				stroke: dark, 
				"stroke-width": strokeWidth
			}));
		}

		const offset = 2/8 * unit;
		for (let tickLoc = 0; tickLoc <= 90; tickLoc += 5) {
			svg.appendChild(this.generateTick(tickLoc, radius - offset - 1/8 * unit, radius - offset, {stroke: dark, "stroke-width": 1}));
		}
		for (let tickLoc = 0; tickLoc <= 90; tickLoc += 1) {
			// svg.appendChild(generateTick(tickLoc, radius - 0.25 * unit, radius - 2/6 * unit, {stroke: dark, "stroke-width": 1}));
			svg.appendChild(this.generateTick(tickLoc, radius - offset - 1/16 * unit, radius - offset, {stroke: dark, "stroke-width": 1}));
		}

		// Get the probability
		let probability = this.get('probability', 0.5);
		let needleElement = svgElem("path", 
			{stroke: red, "stroke-width": 6, fill: "none",
			 "stroke-linecap": "round",
		});
		this.needleElement = needleElement;
		this.updateProbability(probability);
		svg.appendChild(needleElement);

		// Add labels
		let labelsJSON = this.get('labels', "");
		if (labelsJSON) {
			let {angles, labels, rad, props} = JSON.parse(labelsJSON);
			rad = rad || this.radius - 5/8 * this.unit;
			props = props || {};
			this.addLabels(angles, labels, rad, props);
		}

		shadow.appendChild(svg);
		this._initialized = true;
	}

	generateTick(degrees, innerRadius, outerRadius, props = {}) {
		const theta = (-3 * PI/4 + degToRad(degrees));
		const x1 = this.centerX + innerRadius * Math.cos(theta);
		const x2 = this.centerX + outerRadius * Math.cos(theta);
		const y1 = this.centerY + innerRadius * Math.sin(theta);
		const y2 = this.centerY + outerRadius * Math.sin(theta);
		return svgElem('line', {x1, x2, y1, y2, ...props});
	}

	updateProbability(probability) {
		let theta = PI/4 + probToAngle(probability);
		const needleLength = 4.25 * this.unit;
		const needlePath = generateNeedlePath(this.centerX, this.centerY, needleLength, theta);
		this.needleElement?.setAttribute('d', needlePath);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// This is called whenever the attributes are changed.
		if (name == "probability") {
			this.updateProbability(parseFloat(newValue));
		}
		if (name == "labels" && this._initialized) {
			let {angles, labels, radius, props} = JSON.parse(newValue);
			radius = radius || this.radius - 1/2 * this.unit || 443.3333;
			props = props || {};
			this.addLabels(angles, labels, radius, props);
		}
	}

	addLabels(angles, labels, radius, props) {
		for (const [index, angle] of angles.entries()) {
			const theta = PI/4 + degToRad(parseFloat(angle));
			const label = svgElem("text", {
				x: this.centerX + radius * Math.cos(theta),
				y: this.centerY - radius * Math.sin(theta),
				fill: dark,
				"text-anchor": "middle",
				"font-family": "Merriweather",
				"font-size": "1em",
				...props
			});
			label.textContent = labels[index] || angle;
			this.svg.appendChild(label);
		}
	}
}

function svgElem(name, props) {
	const elem = document.createElementNS("http://www.w3.org/2000/svg", name);
	for (let [key, value] of Object.entries(props)) {
		elem.setAttribute(key, value);
	}
	return elem;
}

function generateArcPath(cx, cy, radius, startAngle, endAngle) {
    // Calculate start and end points
    const startX = cx + radius * Math.cos(startAngle);
    const startY = cy + radius * Math.sin(startAngle);
    const endX = cx + radius * Math.cos(endAngle);
    const endY = cy + radius * Math.sin(endAngle);

    // Determine if the arc should be drawn in a clockwise or counterclockwise direction
    const largeArcFlag = endAngle - startAngle <= PI ? "0" : "1";

    // Construct the SVG path
    const path = [
        `M ${startX} ${startY}`, // Move to start point
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Draw the arc
        `L ${cx} ${cy}`, // Line to center
        "Z" // Close the path
    ].join(" ");

    return path;
}

function generateAnnulusPath(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) {
    // Calculate start and end points
    const startOuterX = centerX + outerRadius * Math.cos(startAngle);
    const startOuterY = centerY + outerRadius * Math.sin(startAngle);
    const endInnerX = centerX + innerRadius * Math.cos(endAngle);
    const endInnerY = centerY + innerRadius * Math.sin(endAngle);

    // Determine if the arc should be drawn in a clockwise or counterclockwise direction
    const largeArcFlag = endAngle - startAngle <= PI ? "0" : "1";

    // Construct the SVG path
    return [
        `M ${startOuterX} ${startOuterY}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${centerX + outerRadius * Math.cos(endAngle)} ${centerY + outerRadius * Math.sin(endAngle)}`,
        `L ${endInnerX} ${endInnerY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}`,
        "Z"
    ].join(" ");
}

function generateNeedlePath(centerX, centerY, length, angle) {
	const endX = centerX + length * Math.cos(angle);
	const endY = centerY - length * Math.sin(angle);
	return `M ${centerX} ${centerY} L ${endX} ${endY}`;
}

function probToAngle(probability) {
	// return PI/4 + Math.acos(Math.sqrt(probability));
	return Math.acos(Math.sqrt(probability));
}

customElements.define('probability-meter', Meter)

export { Meter, probToAngle };
