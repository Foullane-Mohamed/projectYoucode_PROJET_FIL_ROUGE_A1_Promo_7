// Image upload test script
// Run manually to verify storage and uploads are working

document.addEventListener('DOMContentLoaded', function() {
  // Create the test UI
  const testContainer = document.createElement('div');
  testContainer.style.position = 'fixed';
  testContainer.style.bottom = '10px';
  testContainer.style.right = '10px';
  testContainer.style.padding = '15px';
  testContainer.style.background = '#fff';
  testContainer.style.border = '1px solid #ddd';
  testContainer.style.borderRadius = '5px';
  testContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  testContainer.style.zIndex = '9999';
  testContainer.style.width = '300px';
  
  testContainer.innerHTML = `
    <h3 style="margin-top:0;">Image Upload Test</h3>
    <input type="file" id="test-image-upload" accept="image/*" style="margin-bottom:10px;">
    <div>
      <button id="test-upload-btn" style="background:#4CAF50;color:white;border:none;padding:5px 10px;cursor:pointer;margin-right:5px;">Upload</button>
      <button id="test-close-btn" style="background:#f44336;color:white;border:none;padding:5px 10px;cursor:pointer;">Close</button>
    </div>
    <div id="test-result" style="margin-top:10px;"></div>
  `;
  
  document.body.appendChild(testContainer);
  
  // Handle upload
  document.getElementById('test-upload-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('test-image-upload');
    const resultDiv = document.getElementById('test-result');
    
    if (!fileInput.files || fileInput.files.length === 0) {
      resultDiv.innerHTML = '<span style="color:red;">Please select a file first</span>';
      return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('test_image', file);
    
    resultDiv.innerHTML = '<span style="color:blue;">Uploading...</span>';
    
    // Send to a temporary endpoint
    fetch('/api/v1/admin/test-upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // No Content-Type header as FormData sets it with boundary
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        resultDiv.innerHTML = `
          <span style="color:green;">Upload successful!</span>
          <div style="margin-top:5px;">
            <strong>Path:</strong> ${data.path}<br>
            <strong>URL:</strong> ${data.url}<br>
            <img src="${data.url}" style="max-width:100%;max-height:100px;margin-top:5px;border:1px solid #ddd;">
          </div>
        `;
      } else {
        resultDiv.innerHTML = `<span style="color:red;">Error: ${data.message}</span>`;
      }
    })
    .catch(error => {
      resultDiv.innerHTML = `<span style="color:red;">Error: ${error.message}</span>`;
      console.error('Upload error:', error);
    });
  });
  
  // Handle close
  document.getElementById('test-close-btn').addEventListener('click', function() {
    document.body.removeChild(testContainer);
  });
});