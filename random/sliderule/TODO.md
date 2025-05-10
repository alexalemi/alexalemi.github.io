# Circular Slide Rule Improvements

## High Priority
1. **Implement undo/history functionality**
   - Store recent positions for both needle and dial
   - Add undo toggle for center circle clicks (needle position)
   - Add three-state cycle for outer area clicks (needle, outer index, previous position)
   - Implement position history stack for both components

2. **Improve mobile fine-grained control with a dedicated fine mode toggle**
   - Add visible toggle button for fine adjustment mode
   - Implement reduced sensitivity when in fine mode
   - Ensure toggle state is preserved during operation
   - Add haptic feedback when possible

3. **Fix Mac platform compatibility issues**
   - Address wheel event differences between platforms
   - Test and fix trackpad sensitivity issues
   - Ensure consistent behavior across operating systems

## Medium Priority
4. **Add support for additional scales**
   - Implement L scale (logarithmic)
   - Add A, ST, S, T, and K scales like traditional slide rules
   - Make scales easily switchable

5. **Improve UI with scale selection dropdown**
   - Create dropdown/toggle for selecting active scales
   - Style selection UI to match slide rule aesthetic
   - Save user preferences for default scales

6. **Add visual feedback for fine vs coarse motion mode**
   - Add indicator for current precision level
   - Implement subtle UI changes reflecting active mode
   - Include visual hints for how to change modes

7. **Create better state management for click actions**
   - Implement state machine for click behavior
   - Add multiple states for reset functionality
   - Improve feedback for current state

## Low Priority
8. **Make the app installable as a progressive web app (PWA)**
   - Update manifest.json
   - Add service worker for offline capability
   - Create appropriate PWA icons and splash screens

9. **Implement double-tap detection for mobile to toggle fine/coarse control**
   - Add double-tap event detection as alternative to toggle button
   - Toggle between fine and coarse movement modes
   - Provide visual indication of current mode