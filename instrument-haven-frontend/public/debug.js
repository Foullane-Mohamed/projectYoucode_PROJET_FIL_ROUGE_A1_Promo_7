// Debugging helper for coupon functionality
console.log('Debug script loaded');

window.testCoupon = function() {
  console.log('Testing coupon functionality');
  
  // Check for coupon input
  const couponInput = document.querySelector('input[placeholder="Enter coupon code"]');
  if (couponInput) {
    console.log('Found coupon input field');
    couponInput.value = 'TEST';
    
    // Trigger input event to ensure React picks up the change
    const event = new Event('input', { bubbles: true });
    couponInput.dispatchEvent(event);
    
    // Find the apply button
    const applyButton = Array.from(document.querySelectorAll('button'))
      .find(button => button.textContent.trim() === 'Apply');
    
    if (applyButton) {
      console.log('Found apply button, clicking it');
      applyButton.click();
    } else {
      console.log('Apply button not found');
    }
  } else {
    console.log('Coupon input field not found');
  }
};

// Create floating debug button
const debugButton = document.createElement('button');
debugButton.innerText = 'Test Coupon';
debugButton.style.position = 'fixed';
debugButton.style.bottom = '10px';
debugButton.style.right = '10px';
debugButton.style.zIndex = '9999';
debugButton.style.padding = '10px';
debugButton.style.backgroundColor = '#ff5722';
debugButton.style.color = 'white';
debugButton.style.border = 'none';
debugButton.style.borderRadius = '4px';
debugButton.style.cursor = 'pointer';

debugButton.addEventListener('click', window.testCoupon);

// Add button to document when it's ready
if (document.body) {
  document.body.appendChild(debugButton);
} else {
  window.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(debugButton);
  });
}
