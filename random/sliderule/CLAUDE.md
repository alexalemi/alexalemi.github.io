# Slide Rule Additional Scales Implementation Plan

## Scales to Implement

1. **C/D Scale** (already implemented)
   - Standard logarithmic scale (base 10)
   - Used for basic multiplication/division

2. **A/B Scale** (Squared)
   - Squared values (x²)
   - Used for squares, square roots, and areas

3. **K Scale** (Cubed)
   - Cubed values (x³)
   - Used for volumes and cube roots

4. **L Scale** (Linear/Logarithm)
   - Gives the base-10 logarithms directly
   - Domain: typically 1-10, shows log values 0-1

5. **S Scale** (Sine)
   - Logarithmic sine function
   - Domain: typically 0°-90°

6. **T Scale** (Tangent)
   - Logarithmic tangent function
   - Domain: typically 0°-45°

7. **CI Scale** (Inverted)
   - Reciprocal values (1/x)
   - Used for division and reciprocals

## Implementation Approach

### Data Structure for Scales

```javascript
const scales = {
  "C/D": {
    name: "C/D Standard",
    domain: [1, 10],
    tickFunction: x => innerScale(x), // same as current implementation
    valueFunction: x => innerScale.invert(x), // same as current
    specialMarks: [...], // special points like π, e, etc.
    tickDensity: {...}, // controls density of tick marks
    unit: "",
  },
  "A/B": {
    name: "A/B Square",
    domain: [1, 10],
    tickFunction: x => innerScale(Math.sqrt(x)), // positions ticks by sqrt
    valueFunction: x => Math.pow(innerScale.invert(x), 2), // squares the value
    specialMarks: [...],
    unit: "²",
  },
  // similar definitions for other scales
}
```

### Technical Implementation Details

1. **UI Addition**
   - Add a dropdown selector for scales in the controls section
   - Style it to match the existing UI
   - Position it alongside the fine mode toggle

2. **Scale Change Function**
   ```javascript
   function changeScale(scaleKey) {
     currentScale = scales[scaleKey];
     
     // Update outer ring elements
     updateOuterRingScale();
     
     // Update reading
     updateReadings();
   }
   ```

3. **Dynamic Rendering**
   - Modify outer ring generation to use the current scale definition
   - Update tick positions and labels based on scale's mathematical function
   - Handle special cases like degree symbols for trig functions

4. **Specialized Scale Implementations**

   **A/B Scale (Square):**
   ```javascript
   // For tick positioning: 
   // Map x² → log10(x²) = 2*log10(x)
   function abTickPosition(x) {
     return innerScale(Math.sqrt(x));
   }
   
   // For value calculation:
   // Unmap angle → x, then square it
   function abValueCalculation(angle) {
     return Math.pow(innerScale.invert(angle), 2);
   }
   ```

   **K Scale (Cube):**
   ```javascript
   // For tick positioning:
   // Map x³ → log10(x³) = 3*log10(x)
   function kTickPosition(x) {
     return innerScale(Math.pow(x, 1/3));
   }
   
   // For value calculation: 
   function kValueCalculation(angle) {
     return Math.pow(innerScale.invert(angle), 3);
   }
   ```

   **L Scale (Logarithm):**
   ```javascript
   // For tick positioning:
   // Map log10(x) → log10(log10(x))
   function lTickPosition(x) {
     // x is the desired log10 value to display (0.0 to 1.0)
     return innerScale(Math.pow(10, x));
   }
   
   // For value calculation:
   function lValueCalculation(angle) {
     // Get x, then take log10(x)
     return Math.log10(innerScale.invert(angle));
   }
   ```

   **S Scale (Sine):**
   ```javascript
   // For tick positioning:
   // Maps sin(angle) → log10(sin(angle))
   function sTickPosition(degrees) {
     const radians = degrees * Math.PI / 180;
     // Handle sin(0) = 0 case (can't take log of 0)
     const sinValue = Math.sin(radians);
     if (sinValue <= 0) return 0;
     return innerScale(sinValue);
   }
   
   // For value calculation:
   function sValueCalculation(angle) {
     const value = innerScale.invert(angle);
     // Return in degrees
     return Math.asin(value) * 180 / Math.PI;
   }
   ```

5. **Reading Calculation Updates**
   - Update outer reading to apply the proper scale's mathematical function
   - Add units where appropriate (degrees for trig, etc.)
   - Format values appropriately for each scale

## Implementation Process

1. First phase: Implement A/B (Square) and L (Logarithm) scales
   - These are relatively straightforward mathematically
   - Helps establish the pattern for more complex scales

2. Second phase: Implement K (Cube) and CI (Reciprocal) scales
   - Slightly more complex but follow similar patterns

3. Third phase: Implement S and T scales (Trigonometric functions)
   - Handle special cases like degree markings
   - Deal with domain limits (0-90° for sine, 0-45° for tangent)

4. Final phase: Add any additional scales and refine UI

## Edge Cases to Handle

1. **Domain Limits**
   - Some scales have natural limits (e.g., sine between 0-90°)
   - Need proper handling at boundaries

2. **Precision Issues**
   - Logarithmic scales can have precision problems near boundaries
   - Implement safeguards for mathematical edge cases

3. **Special Marks**
   - Each scale has its own set of important values to mark
   - Need to update these when changing scales

4. **Formatting**
   - Different scales need different formatting (decimal places, units)
   - Update display formatting based on active scale

## UI Considerations

1. The dropdown should be clearly labeled with the current scale
2. Keep the existing UI clean and minimal
3. Provide brief tooltips or help text about each scale's purpose
4. Consider color-coding or visual indicators for different scale types