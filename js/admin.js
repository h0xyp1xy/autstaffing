const API_BASE = '/api';

let authToken = localStorage.getItem('adminToken');
let currentFilter = '';

// Check if user is logged in
if (authToken) {
    showAdminPanel();
} else {
    showLogin();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showAdminPanel();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    }
});

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    authToken = null;
    showLogin();
}

// Show login form
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminContainer').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    loadStats();
    loadSubmissions();
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.status;
            loadSubmissions();
        });
    });
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const stats = data.stats;
            const statsContainer = document.getElementById('statsContainer');
            
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total Submissions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.recent7Days}</div>
                    <div class="stat-label">Last 7 Days</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.byStatus.find(s => s.status === 'new')?.count || 0}</div>
                    <div class="stat-label">New</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.byStatus.find(s => s.status === 'read')?.count || 0}</div>
                    <div class="stat-label">Read</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load submissions
async function loadSubmissions() {
    const tbody = document.getElementById('submissionsTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">Loading...</td></tr>';
    
    try {
        const url = `${API_BASE}/admin/submissions${currentFilter ? `?status=${currentFilter}` : ''}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (data.submissions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-secondary);">No submissions found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.submissions.map(sub => `
                <tr>
                    <td>${sub.id}</td>
                    <td>${sub.name}</td>
                    <td>${sub.email}</td>
                    <td>${sub.phone}</td>
                    <td>${sub.company || '-'}</td>
                    <td>${new Date(sub.created_at).toLocaleString('ru-RU')}</td>
                    <td><span class="status-badge status-${sub.status}">${sub.status}</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewSubmission(${sub.id})">View</button>
                        <button class="action-btn btn-archive" onclick="updateStatus(${sub.id}, '${sub.status === 'archived' ? 'read' : 'archived'}')">
                            ${sub.status === 'archived' ? 'Unarchive' : 'Archive'}
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteSubmission(${sub.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            if (response.status === 401 || response.status === 403) {
                logout();
            }
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #ff6347;">Error loading submissions</td></tr>';
    }
}

// View submission details
async function viewSubmission(id) {
    try {
        const response = await fetch(`${API_BASE}/admin/submissions/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const sub = data.submission;
            const detailsContainer = document.getElementById('submissionDetails');
            
            detailsContainer.innerHTML = `
                <div class="submission-detail">
                    <label>ID:</label>
                    <p>${sub.id}</p>
                </div>
                <div class="submission-detail">
                    <label>Name:</label>
                    <p>${sub.name}</p>
                </div>
                <div class="submission-detail">
                    <label>Email:</label>
                    <p>${sub.email}</p>
                </div>
                <div class="submission-detail">
                    <label>Phone:</label>
                    <p>${sub.phone}</p>
                </div>
                <div class="submission-detail">
                    <label>Company:</label>
                    <p>${sub.company || '-'}</p>
                </div>
                <div class="submission-detail">
                    <label>Message:</label>
                    <p>${sub.message || '-'}</p>
                </div>
                <div class="submission-detail">
                    <label>Saved Calculation:</label>
                    <p style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${sub.saved_calculation || '-'}</p>
                </div>
                <div class="submission-detail">
                    <label>Form Type:</label>
                    <p>${sub.form_type}</p>
                </div>
                <div class="submission-detail">
                    <label>Status:</label>
                    <p><span class="status-badge status-${sub.status}">${sub.status}</span></p>
                </div>
                <div class="submission-detail">
                    <label>Created At:</label>
                    <p>${new Date(sub.created_at).toLocaleString('ru-RU')}</p>
                </div>
            `;
            
            document.getElementById('detailModal').classList.add('active');
            
            // Mark as read if new
            if (sub.status === 'new') {
                updateStatus(id, 'read', false);
            }
        }
    } catch (error) {
        console.error('Error loading submission:', error);
        alert('Error loading submission details');
    }
}

// Close modal
function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Update submission status
async function updateStatus(id, status, reload = true) {
    try {
        const response = await fetch(`${API_BASE}/admin/submissions/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (reload) {
                loadSubmissions();
                loadStats();
            }
        } else {
            alert(data.error || 'Error updating status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
}

// Delete submission
async function deleteSubmission(id) {
    if (!confirm('Are you sure you want to delete this submission?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/submissions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadSubmissions();
            loadStats();
        } else {
            alert(data.error || 'Error deleting submission');
        }
    } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Error deleting submission');
    }
}

// Close modal on outside click
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
