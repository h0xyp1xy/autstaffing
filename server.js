const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Initialize database
const db = new Database('database.db');

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company TEXT,
        message TEXT,
        saved_calculation TEXT,
        form_type TEXT DEFAULT 'main',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new'
    );
    
    CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
`);

// Create default admin user if not exists
const defaultAdmin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
if (!defaultAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Default admin created: username=admin, password=admin123');
    console.log('⚠️  IMPORTANT: Change the default password in production!');
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// API Routes

// Submit contact form
app.post('/api/submit', async (req, res) => {
    try {
        const { name, email, phone, company, message, savedCalculation, formType } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }

        const stmt = db.prepare(`
            INSERT INTO submissions (name, email, phone, company, message, saved_calculation, form_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            name,
            email,
            phone,
            company || null,
            message || null,
            savedCalculation || null,
            formType || 'main'
        );

        res.json({
            success: true,
            message: 'Form submitted successfully',
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all submissions (admin only)
app.get('/api/admin/submissions', authenticateToken, (req, res) => {
    try {
        const { status, limit = 100, offset = 0 } = req.query;

        let query = 'SELECT * FROM submissions';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const submissions = db.prepare(query).all(...params);
        const total = db.prepare('SELECT COUNT(*) as count FROM submissions' + (status ? ' WHERE status = ?' : '')).get(status || '').count;

        res.json({
            success: true,
            submissions,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single submission (admin only)
app.get('/api/admin/submissions/:id', authenticateToken, (req, res) => {
    try {
        const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update submission status (admin only)
app.patch('/api/admin/submissions/:id', authenticateToken, (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const result = db.prepare('UPDATE submissions SET status = ? WHERE id = ?').run(status, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error updating submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete submission (admin only)
app.delete('/api/admin/submissions/:id', authenticateToken, (req, res) => {
    try {
        const result = db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get statistics (admin only)
app.get('/api/admin/stats', authenticateToken, (req, res) => {
    try {
        const total = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
        const byStatus = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM submissions 
            GROUP BY status
        `).all();
        const byFormType = db.prepare(`
            SELECT form_type, COUNT(*) as count 
            FROM submissions 
            GROUP BY form_type
        `).all();
        const recent = db.prepare(`
            SELECT COUNT(*) as count 
            FROM submissions 
            WHERE created_at >= datetime('now', '-7 days')
        `).get().count;

        res.json({
            success: true,
            stats: {
                total,
                byStatus,
                byFormType,
                recent7Days: recent
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve main site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
