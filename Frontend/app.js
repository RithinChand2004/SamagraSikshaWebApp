// Common JavaScript Functions and Event Listeners

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navbar scroll effect
  initNavbarScrollEffect();
  
  // Initialize Quill editor if on admin page
  if (document.getElementById('editor')) {
    initQuillEditor();
  }
  
  // Initialize AOS animations if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
});

// Navbar scroll effect
function initNavbarScrollEffect() {
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
  });
}

// Quill Editor Initialization (Admin Page)
let quill;

function initQuillEditor() {
  const editorElement = document.getElementById('editor');
  if (editorElement) {
    quill = new Quill('#editor', {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered'}, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
      },
      placeholder: 'Write your announcement here...',
      theme: 'snow'
    });
  }
}

// Get editor content function (Admin Page)
function getEditorContent() {
  if (quill) {
    const content = quill.getContents();
    const htmlContent = quill.root.innerHTML;
    console.log('Editor content:', content);
    console.log('HTML content:', htmlContent);
    
    // Here you can process the content as needed
    alert('Announcement posted! (Check console for content)');
    
    // You can add your API call here to save the content
    // Example: saveAnnouncement(htmlContent);
  }
}

// Sidebar toggle function (Admin Page)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// Document upload handler (Admin Page)
function handleDocumentUpload() {
  const titleInput = document.querySelector('input[placeholder="Enter document title..."]');
  const fileInput = document.querySelector('input[type="file"]');
  
  if (titleInput && fileInput) {
    const title = titleInput.value.trim();
    const file = fileInput.files[0];
    
    if (!title) {
      alert('Please enter a document title');
      return;
    }
    
    if (!file) {
      alert('Please select a file');
      return;
    }
    
    // Here you would typically upload the file to your server
    console.log('Uploading document:', { title, file });
    alert('Document uploaded successfully!');
    
    // Clear the form
    titleInput.value = '';
    fileInput.value = '';
  }
}

// Delete document handler (Admin Page)
function deleteDocument(documentId) {
  if (confirm('Are you sure you want to delete this document?')) {
    // Here you would make an API call to delete the document
    console.log('Deleting document with ID:', documentId);
    alert('Document deleted successfully!');
  }
}

// Delete announcement handler (Admin Page)  
function deleteAnnouncement(announcementId) {
  if (confirm('Are you sure you want to delete this announcement?')) {
    // Here you would make an API call to delete the announcement
    console.log('Deleting announcement with ID:', announcementId);
    alert('Announcement deleted successfully!');
  }
}

// Smooth scrolling for anchor links
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Tab switching functionality
function switchTab(tabId) {
  // Hide all tab panes
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabPanes.forEach(pane => {
    pane.classList.remove('show', 'active');
  });
  
  // Show selected tab pane
  const selectedPane = document.getElementById(tabId);
  if (selectedPane) {
    selectedPane.classList.add('show', 'active');
  }
  
  // Update tab buttons
  const tabButtons = document.querySelectorAll('.nav-pills .nav-link');
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  const selectedButton = document.querySelector(`[data-bs-target="#${tabId}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }
}

// Utility function to format dates
function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("bi-eye-slash");
            togglePassword.classList.add("bi-eye");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("bi-eye");
            togglePassword.classList.add("bi-eye-slash");
        }
    });
});

// Export functions for use in HTML
window.getEditorContent = getEditorContent;
window.toggleSidebar = toggleSidebar;
window.handleDocumentUpload = handleDocumentUpload;
window.deleteDocument = deleteDocument;
window.deleteAnnouncement = deleteAnnouncement;
window.smoothScrollTo = smoothScrollTo;
window.switchTab = switchTab;