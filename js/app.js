// Sample data for demonstration
const sampleReports = [
  {
    id: 1,
    title: "Broken Playground Equipment",
    park: "Central Park",
    message:
      "The swing set on the north side has several broken links in the chains. This poses a safety risk to children.",
    image: "broken-playground-equipment.png",
    link: "https://example.com/report/1",
    category: "maintenance",
    status: "active",
    author: "Jane Smith",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    comments: [
      {
        author: "City Maintenance",
        text: "We will inspect this by end of week.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        author: "Park Visitor",
        text: "Thank you for reporting this!",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 2,
    title: "Damaged Basketball Court",
    park: "Riverside Park",
    message: "Multiple cracks on the basketball court surface make it unplayable. Please schedule repairs.",
    image: "park-foundation.png",
    link: "https://example.com/report/2",
    category: "maintenance",
    status: "resolved",
    author: "Mike Johnson",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    comments: [
      {
        author: "City Maintenance",
        text: "Repairs completed. Court is now ready for use.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 3,
    title: "Suggested: Dog Park Expansion",
    park: "Meadowbrook Park",
    message: "With increased pet ownership in the area, expanding the dog park would be beneficial for the community.",
    image: "dog-park-suggestion.png",
    link: "https://example.com/report/3",
    category: "improvement",
    status: "active",
    author: "Sarah Wilson",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    comments: [],
  },
]

const allReports = [...sampleReports]
const userReports = [sampleReports[0], sampleReports[2]]
let currentPage = "reports"
let sidebarCollapsed = false
const currentUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  type: "user",
  memberSince: "January 2024",
}

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderReports()
})

// Event Listeners
function setupEventListeners() {
  // Sidebar navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = link.dataset.page
      navigateToPage(page)
    })
  })

  // Sidebar toggle
  document.getElementById("toggleBtn").addEventListener("click", toggleSidebar)
  document.getElementById("sidebarToggleClose").addEventListener("click", toggleSidebar)

  // Reports page events
  document.getElementById("addReportBtn").addEventListener("click", openAddReportModal)
  document.getElementById("addReportBtn2").addEventListener("click", openAddReportModal)
  document.getElementById("refreshBtn").addEventListener("click", renderReports)
  document.getElementById("searchInput").addEventListener("input", renderReports)
  document.getElementById("filterSelect").addEventListener("change", renderReports)
  document.getElementById("sortSelect").addEventListener("change", renderReports)

  // Form submission
  document.getElementById("submitReportBtn").addEventListener("click", submitNewReport)

  // Settings page events
  document.getElementById("logoutBtn").addEventListener("click", logout)
  document.getElementById("editProfileBtn").addEventListener("click", editProfile)
}

// Page Navigation
function navigateToPage(page) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"))

  // Show selected page
  document.getElementById(`${page}-page`).classList.add("active")

  // Update sidebar
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })

  currentPage = page

  // Render appropriate content
  if (page === "reports") {
    renderReports()
  } else if (page === "my-reports") {
    renderMyReports()
  } else if (page === "settings") {
    renderSettings()
  }
}

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.querySelector(".main-content")

  sidebarCollapsed = !sidebarCollapsed

  if (sidebarCollapsed) {
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
  } else {
    sidebar.classList.remove("collapsed")
    mainContent.classList.remove("expanded")
  }
}

// Render Reports
function renderReports() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const filterStatus = document.getElementById("filterSelect").value
  const sortOrder = document.getElementById("sortSelect").value

  const filtered = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm) ||
      report.park.toLowerCase().includes(searchTerm) ||
      report.message.toLowerCase().includes(searchTerm)
    const matchesFilter = !filterStatus || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Sort
  if (sortOrder === "newest") {
    filtered.sort((a, b) => b.date - a.date)
  } else {
    filtered.sort((a, b) => a.date - b.date)
  }

  const grid = document.getElementById("reportsGrid")
  grid.innerHTML = ""

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-muted">No reports found.</p>'
    return
  }

  filtered.forEach((report) => {
    const card = createReportCard(report)
    grid.appendChild(card)
  })
}

// Create Report Card
function createReportCard(report) {
  const card = document.createElement("div")
  card.className = "report-card"

  const formattedDate = report.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  card.innerHTML = `
        ${report.image ? `<img src="${report.image}" alt="${report.title}" class="report-card-image">` : ""}
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
    `

  card.addEventListener("click", () => openReportModal(report.id))

  return card
}

// Open Report Modal
function openReportModal(reportId) {
  const report = allReports.find((r) => r.id === reportId)
  if (!report) return

  const modalContent = document.getElementById("reportModalContent")
  const formattedDate = report.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const commentsHtml = report.comments
    .map(
      (comment) => `
        <div class="comment">
            <div><strong class="comment-author">${comment.author}</strong> <span class="comment-time">${comment.date.toLocaleDateString()}</span></div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `,
    )
    .join("")

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

            ${report.image ? `<img src="${report.image}" alt="${report.title}">` : ""}

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
    `

  const modal = new bootstrap.Modal(document.getElementById("reportModal"))
  modal.show()
}

document.getElementById("reportModal").addEventListener("hidden.bs.modal", () => {
  document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
});

// Add Comment
function addComment(reportId) {
  const commentInput = document.getElementById("newComment")
  const commentText = commentInput.value.trim()

  if (!commentText) return

  const report = allReports.find((r) => r.id === reportId)
  if (report) {
    report.comments.push({
      author: currentUser.name,
      text: commentText,
      date: new Date(),
    })
    commentInput.value = ""
    openReportModal(reportId)
  }
}

// Render My Reports
function renderMyReports() {
  const grid = document.getElementById("myReportsGrid")
  grid.innerHTML = ""

  if (userReports.length === 0) {
    grid.innerHTML = '<p class="text-muted">You haven\'t submitted any reports yet.</p>'
    return
  }

  userReports.forEach((report) => {
    const card = createReportCard(report)
    grid.appendChild(card)
  })
}

// Open Add Report Modal
function openAddReportModal() {
  document.getElementById("reportForm").reset()
  const modal = new bootstrap.Modal(document.getElementById("addReportModal"))
  modal.show()
}

// Submit New Report
function submitNewReport() {
  const title = document.getElementById("reportTitle").value.trim()
  const park = document.getElementById("parkName").value.trim()
  const message = document.getElementById("reportMessage").value.trim()
  const image = document.getElementById("reportImage").value.trim()
  const link = document.getElementById("reportLink").value.trim()
  const category = document.getElementById("reportCategory").value

  if (!title || !park || !message || !category) {
    alert("Please fill in all required fields")
    return
  }

  const newReport = {
    id: Math.max(...allReports.map((r) => r.id), 0) + 1,
    title,
    park,
    message,
    image: image || "https://via.placeholder.com/400x300?text=No+Image",
    link,
    category,
    status: "active",
    author: currentUser.name,
    date: new Date(),
    comments: [],
  }

  allReports.unshift(newReport)
  userReports.unshift(newReport)

  bootstrap.Modal.getInstance(document.getElementById("addReportModal")).hide()

  if (currentPage === "reports") {
    renderReports()
  } else if (currentPage === "my-reports") {
    renderMyReports()
  }

  alert("Report submitted successfully!")
}

// Render Settings
function renderSettings() {
  document.getElementById("userName").textContent = currentUser.name
  document.getElementById("userEmail").textContent = currentUser.email
  document.getElementById("userType").textContent = currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1)
  document.getElementById("memberSince").textContent = currentUser.memberSince
}

// Logout
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    alert("Logging out...")
    window.location.href = "../index.html"
    // In a real app, this would clear sessions and redirect
  }
}

// Edit Profile
function editProfile() {
  alert("Edit profile functionality would open a form to update user information.")
}
