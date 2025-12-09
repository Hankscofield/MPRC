const AUTH_STORAGE_KEY = 'parkReports_users';
const SESSION_KEY = 'parkReports_currentUser';
const REPORTS_KEY = 'parkReports_allReports';

function getCurrentUser() {
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

const sampleReports = [
  {
    id: 1,
    title: "Broken Playground Equipment",
    park: "Central Park",
    message: "The swing set on the north side has several broken links in the chains. This poses a safety risk to children.",
    image: "https://images.unsplash.com/photo-1596997000103-e597b3ca50df?w=400",
    link: "https://example.com/report/1",
    category: "maintenance",
    status: "active",
    author: "Jane Smith",
    authorId: null,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        author: "City Maintenance",
        text: "We will inspect this by end of week.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        author: "Park Visitor",
        text: "Thank you for reporting this!",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    title: "Damaged Basketball Court",
    park: "Riverside Park",
    message: "Multiple cracks on the basketball court surface make it unplayable. Please schedule repairs.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    link: "https://example.com/report/2",
    category: "maintenance",
    status: "resolved",
    author: "Mike Johnson",
    authorId: null,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        author: "City Maintenance",
        text: "Repairs completed. Court is now ready for use.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 3,
    title: "Suggested: Dog Park Expansion",
    park: "Meadowbrook Park",
    message: "With increased pet ownership in the area, expanding the dog park would be beneficial for the community.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    link: "https://example.com/report/3",
    category: "improvement",
    status: "active",
    author: "Sarah Wilson",
    authorId: null,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
  },
];

function getAllReports() {
  const stored = localStorage.getItem(REPORTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(REPORTS_KEY, JSON.stringify(sampleReports));
  return sampleReports;
}

function saveAllReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

let allReports = [];
let currentPage = "reports";
let sidebarCollapsed = false;
let currentUser = null;

const bootstrap = window.bootstrap;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUser();
  
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  allReports = getAllReports();
  setupEventListeners();
  renderReports();
  renderSettings();
});

function setupEventListeners() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateToPage(page);
    });
  });

  document.getElementById("toggleBtn").addEventListener("click", toggleSidebar);
  document.getElementById("sidebarToggleClose").addEventListener("click", toggleSidebar);

  document.getElementById("addReportBtn").addEventListener("click", openAddReportModal);
  document.getElementById("addReportBtn2").addEventListener("click", openAddReportModal);
  document.getElementById("refreshBtn").addEventListener("click", renderReports);
  document.getElementById("searchInput").addEventListener("input", renderReports);
  document.getElementById("filterSelect").addEventListener("change", renderReports);
  document.getElementById("sortSelect").addEventListener("change", renderReports);

  document.getElementById("submitReportBtn").addEventListener("click", submitNewReport);

  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("editProfileBtn").addEventListener("click", editProfile);
}

function navigateToPage(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));

  document.getElementById(`${page}-page`).classList.add("active");

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  currentPage = page;

  if (page === "reports") {
    renderReports();
  } else if (page === "my-reports") {
    renderMyReports();
  } else if (page === "settings") {
    renderSettings();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.querySelector(".main-content");

  sidebarCollapsed = !sidebarCollapsed;

  if (sidebarCollapsed) {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
  } else {
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("expanded");
  }
}

function renderReports() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filterStatus = document.getElementById("filterSelect").value;
  const sortOrder = document.getElementById("sortSelect").value;

  allReports = getAllReports();

  const filtered = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm) ||
      report.park.toLowerCase().includes(searchTerm) ||
      report.message.toLowerCase().includes(searchTerm);
    const matchesFilter = !filterStatus || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (sortOrder === "newest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const grid = document.getElementById("reportsGrid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-muted">No reports found.</p>';
    return;
  }

  filtered.forEach((report) => {
    const card = createReportCard(report);
    grid.appendChild(card);
  });
}

function createReportCard(report) {
  const card = document.createElement("div");
  card.className = "report-card";

  const reportDate = new Date(report.date);
  const formattedDate = reportDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  card.innerHTML = `
    ${report.image ? `<img src="${report.image}" alt="${report.title}" class="report-card-image" onerror="this.style.display='none'">` : ""}
    <div class="report-card-body">
      <div class="report-card-header">
        <h6 class="report-card-title">${report.title}</h6>
        <span class="report-status ${report.status}">${report.status}</span>
      </div>
      <div class="report-card-park">${report.park}</div>
      <div class="report-card-meta">
        <span><i class="bi bi-person"></i> ${report.author}</span>
        <span><i class="bi bi-calendar"></i> ${formattedDate}</span>
      </div>
      <p class="report-card-excerpt">${report.message}</p>
      <div class="report-card-footer">
        <span><i class="bi bi-chat-dots"></i> ${report.comments.length} comments</span>
        <a href="#" onclick="openReportModal(${report.id}); return false;" class="btn btn-sm btn-outline-primary">View Details</a>
      </div>
    </div>
  `;

  card.addEventListener("click", () => openReportModal(report.id));

  return card;
}

function openReportModal(reportId) {
  allReports = getAllReports();
  const report = allReports.find((r) => r.id === reportId);
  if (!report) return;

  const modalContent = document.getElementById("reportModalContent");
  const reportDate = new Date(report.date);
  const formattedDate = reportDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const commentsHtml = report.comments
    .map(
      (comment) => `
      <div class="comment">
        <div><strong class="comment-author">${comment.author}</strong> <span class="comment-time">${new Date(comment.date).toLocaleDateString()}</span></div>
        <div class="comment-text">${comment.text}</div>
      </div>
    `
    )
    .join("");

  modalContent.innerHTML = `
    <div class="report-details">
      <h5>Report Information</h5>
      <p><strong>Title:</strong> ${report.title}</p>
      <p><strong>Park:</strong> ${report.park}</p>
      <p><strong>Category:</strong> ${report.category}</p>
      <p><strong>Status:</strong> <span class="badge bg-${report.status === "active" ? "success" : "info"}">${report.status}</span></p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Author:</strong> ${report.author}</p>

      <h5>Message</h5>
      <p>${report.message}</p>

      ${report.image ? `<img src="${report.image}" alt="${report.title}" onerror="this.style.display='none'">` : ""}

      ${report.link ? `<h5>Additional Resources</h5><p><a href="${report.link}" target="_blank">${report.link}</a></p>` : ""}

      <div class="comments-section">
        <h6><i class="bi bi-chat-dots"></i> Comments (${report.comments.length})</h6>
        ${commentsHtml || '<p class="text-muted">No comments yet.</p>'}
        <div class="comment-form">
          <input type="text" placeholder="Add a comment..." id="newComment" class="form-control">
          <button class="btn btn-sm btn-primary" onclick="addComment(${report.id})">Post</button>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("reportModal"));
  modal.show();
}

document.getElementById("reportModal").addEventListener("hidden.bs.modal", () => {
  document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
});

function addComment(reportId) {
  const commentInput = document.getElementById("newComment");
  const commentText = commentInput.value.trim();

  if (!commentText) return;

  allReports = getAllReports();
  const report = allReports.find((r) => r.id === reportId);
  if (report) {
    report.comments.push({
      author: currentUser.name,
      text: commentText,
      date: new Date().toISOString(),
    });
    saveAllReports(allReports);
    commentInput.value = "";
    openReportModal(reportId);
  }
}

function renderMyReports() {
  const grid = document.getElementById("myReportsGrid");
  grid.innerHTML = "";

  currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  allReports = getAllReports();
  const userReports = allReports.filter((r) => {
    if (r.authorId !== null && r.authorId !== undefined) {
      return r.authorId === currentUser.id;
    }
    return false;
  });

  if (userReports.length === 0) {
    grid.innerHTML = '<p class="text-muted">You haven\'t submitted any reports yet.</p>';
    return;
  }

  userReports.forEach((report) => {
    const card = createReportCard(report);
    grid.appendChild(card);
  });
}

function openAddReportModal() {
  document.getElementById("reportForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("addReportModal"));
  modal.show();
}

function submitNewReport() {
  currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const title = document.getElementById("reportTitle").value.trim();
  const park = document.getElementById("parkName").value.trim();
  const message = document.getElementById("reportMessage").value.trim();
  const image = document.getElementById("reportImage").value.trim();
  const link = document.getElementById("reportLink").value.trim();
  const category = document.getElementById("reportCategory").value;

  if (!title || !park || !message || !category) {
    alert("Please fill in all required fields");
    return;
  }

  allReports = getAllReports();

  const newReport = {
    id: Math.max(...allReports.map((r) => r.id), 0) + 1,
    title,
    park,
    message,
    image: image || "",
    link,
    category,
    status: "active",
    author: currentUser.name,
    authorId: currentUser.id,
    date: new Date().toISOString(),
    comments: [],
  };

  allReports.unshift(newReport);
  saveAllReports(allReports);

  bootstrap.Modal.getInstance(document.getElementById("addReportModal")).hide();

  if (currentPage === "reports") {
    renderReports();
  } else if (currentPage === "my-reports") {
    renderMyReports();
  }

  alert("Report submitted successfully!");
}

function renderSettings() {
  if (currentUser) {
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("userEmail").textContent = currentUser.email;
    document.getElementById("userType").textContent =
      currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1);
    document.getElementById("memberSince").textContent = currentUser.memberSince;
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    clearCurrentUser();
    window.location.href = "login.html";
  }
}

function editProfile() {
  alert("Edit profile functionality would open a form to update user information.");
}
