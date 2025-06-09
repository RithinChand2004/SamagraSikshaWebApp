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
  if (document.querySelector('#deo')) {
    loadAnnouncements('DEO', '#deo .list-group');
    loadDocuments('DEO', '#deo table tbody');
    loadAnnouncements('Samagra', '#samagra .list-group');
    loadDocuments('Samagra', '#samagra table tbody');
    loadAnnouncements('DIET', '#diet .list-group');
    loadDocuments('DIET', '#diet table tbody');
  }

  // Admin Dashboard
  if (document.querySelector('#delete-docs')) {
    loadAdminDocuments('#delete-docs table tbody');
  }
  if (document.querySelector('#delete-announcement')) {
    loadAdminAnnouncements('#delete-announcement table tbody');
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
    const htmlContent = quill.root.innerHTML;
    const category = document.getElementById('annCategory').value;

    if (!category) {
      alert('Please select a category');
      return;
    }

    const formData = new FormData();
    formData.append('content', htmlContent);
    formData.append('category', category);

    fetch('/post-announcement/', {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (res.ok) {
        alert('Announcement posted!');
        quill.setContents([]);
        document.getElementById('annCategory').value = '';
      } else {
        alert('Failed to post announcement');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error occurred while posting announcement');
    });
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
  const titleInput = document.getElementById('documentTitle');
  const fileInput = document.getElementById('documentFile');
  const categorySelect = document.getElementById('docCategory');

  const title = titleInput.value.trim();
  const files = fileInput.files;
  const category = categorySelect.value;

  if (!title || !category) {
    alert('Please enter a document title and select a category');
    return;
  }

  if (files.length === 0) {
    alert('Please select at least one file');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  fetch('/upload-document/', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (res.ok) {
      alert('Document(s) uploaded successfully!');
      titleInput.value = '';
      fileInput.value = '';
      categorySelect.value = '';
    } else {
      alert('Upload failed');
    }
  })
  .catch(err => {
    console.error(err);
    alert('An error occurred');
  });
}


// Delete document handler (Admin Page)
function deleteDocument(groupId) {
  if (confirm('Are you sure you want to delete this document group?')) {
    fetch(`/delete-document-group/${groupId}/`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Document group deleted');
      loadAdminDocuments('#delete-docs table tbody');
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete document group');
    });
  }
}


// Delete announcement handler (Admin Page)  
function deleteAnnouncement(announcementId) {
  if (confirm('Are you sure you want to delete this announcement?')) {
    fetch(`/delete-announcement/${announcementId}/`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Announcement deleted');
      loadAdminAnnouncements('#delete-announcement table tbody');
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete announcement');
    });
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

// Load announcements by category into a <ul>
function loadAnnouncements(category, ulSelector) {
  fetch(`/announcements/${category}/`)
    .then(res => res.json())
    .then(data => {
      const ul = document.querySelector(ulSelector);
      if (!ul) return;
      ul.innerHTML = ''; // Clear existing

      data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-transparent';
        const text = item.content.replace(/<[^>]+>/g, '').slice(0, 150);
        li.innerHTML = `📌 ${item.content}`;
        ul.appendChild(li);
      });
    });
}

// Load documents by category into a <tbody>
function loadDocuments(category, tbodySelector) {
  fetch(`/documents/${category}/`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector(tbodySelector);
      if (!tbody) return;
      tbody.innerHTML = '';

      data.forEach(group => {
        const fileLinks = group.files.map(file =>
            `<div><a href="${file.file_url}" class="download-btn" target="_blank">${file.filename}</a></div>`
        ).join('');


        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${group.title}</td>
          <td>${group.date_uploaded}</td>
          <td>${fileLinks}</td>
        `;
        tbody.appendChild(row);
      });
    });
}


function loadAdminAnnouncements(tbodySelector) {
  const categories = ['DEO', 'Samagra', 'DIET'];
  const tbody = document.querySelector(tbodySelector);
  if (!tbody) return;
  tbody.innerHTML = '';

  categories.forEach(category => {
    fetch(`/announcements/${category}/`)
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.content}</td>
            <td>${item.date_posted}</td>
            <td>${item.category}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${item.id})">Delete</button></td>
          `;
          tbody.appendChild(row);
        });
      });
  });
}


function loadAdminDocuments(tbodySelector) {
  const categories = ['DEO', 'Samagra', 'DIET'];
  const tbody = document.querySelector(tbodySelector);
  if (!tbody) return;
  tbody.innerHTML = '';

  categories.forEach(category => {
    fetch(`/documents/${category}/`)
      .then(res => res.json())
      .then(data => {
        data.forEach(group => {
          const filenames = group.files.map(file =>
            file.filename
          ).join(', ');

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${group.title}</td>
            <td>${group.date_uploaded}</td>
            <td>${group.category}</td>
            <td>${filenames}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteDocument(${group.id})">Delete</button></td>
          `;
          tbody.appendChild(row);
        });
      });
  });
}


