# Fresh Consulting - Requirements Management System

A comprehensive requirements management tool with traceability, approval workflows, and relationship visualization.

## Features

### Core Functionality
- **Multi-level hierarchy**: Epics → Requirements → Test Cases → Defects
- **Relationship tracking**: Link items with typed relationships (tests, depends-on, derives-from, relates-to)
- **Visual graph view**: Interactive relationship visualization with directional arrows
- **Full traceability**: Track all changes via audit history
- **Project organization**: Manage multiple projects with separate item sets

### Approval Workflow
- **Reviewer assignment**: Assign items to reviewers
- **Auto-status changes**: Status updates to 'in-review' when reviewer assigned
- **Approve/Reject modal**: Reviewers can approve or reject with notes
- **Draft reset**: Editing approved items resets to draft for re-review
- **Audit trail**: All approvals, rejections, and notes logged

### User Experience
- **Collapsible audit history**: Click to expand/collapse with count display
- **Auto-refresh**: Views update immediately after edits
- **Clear navigation**: Project/item switching clears view appropriately
- **Google authentication**: Secure OAuth login
- **Real-time updates**: Changes reflect instantly

## Setup

### Prerequisites
- Supabase account
- Google OAuth configured in Supabase
- GitHub Pages (for hosting)

### Database Schema

```sql
-- Items table
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rationale TEXT,
  test_method TEXT,
  status TEXT NOT NULL,
  priority TEXT,
  owner TEXT,
  reviewer_email TEXT,
  parent_id BIGINT REFERENCES items(id),
  children BIGINT[],
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Relationships table
CREATE TABLE relationships (
  id BIGSERIAL PRIMARY KEY,
  from_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  to_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  type TEXT NOT NULL
);

-- Comments table
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_email TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security

```sql
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON items FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON relationships FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON comments FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON audit_logs FOR ALL USING (true);
```

### Configuration

Edit `index.html` lines 52-53:
```javascript
const DEV_SUPABASE_URL = 'your-supabase-url';
const DEV_SUPABASE_KEY = 'your-supabase-anon-key';
```

## Deployment

1. Update credentials in `index.html`
2. Upload to GitHub repository
3. Enable GitHub Pages in repository settings
4. Access via `https://username.github.io/repository`

## Usage

### Creating Items
1. Select a project
2. Click "+" to create new item
3. Choose type (epic, requirement, test-case, defect)
4. Fill in details
5. For test cases, add references to requirements

### Managing Approvals
1. Assign reviewer email to item
2. Status changes to 'in-review' automatically
3. Reviewer opens item
4. Clicks Approve or Reject
5. Adds notes (optional)
6. Submits decision

### Viewing Relationships
1. Select an item
2. Toggle between List/Graph view
3. Graph shows:
   - Dependencies above (items this depends on)
   - Test cases below (items that test this)
   - Arrows indicate relationship direction

### Tracking Changes
1. Click "Audit History" on any item
2. Expand to see all changes
3. View who changed what and when
4. See approval notes

## Item Types & Statuses

### Types
- **Epic**: High-level initiative
- **Requirement**: Detailed specification
- **Test Case**: Verification procedure
- **Defect**: Issue or bug

### Statuses
- Epics/Requirements: draft, in-review, approved, rejected
- Test Cases: not-tested, pass, fail
- Defects: not-started, in-process, resolved, backlog

### Priorities
low, medium, high, critical

### Relationship Types
- **tests**: Test case validates requirement
- **depends-on**: Item requires another to be complete
- **derives-from**: Item elaborates on another
- **relates-to**: General connection

## Technical Details

### Stack
- React 18 (via CDN)
- Supabase (database & auth)
- Tailwind CSS (styling)
- Vanilla JavaScript (ES6+)

### Architecture
- Single-page application
- Uncontrolled components for form inputs (performance)
- Real-time state synchronization
- Automatic view refresh on changes

### File Size
~96 KB (single HTML file)

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

### Making Changes
The application is a single HTML file for simplicity. Key sections:
- Lines 1-50: HTML structure & Tailwind config
- Lines 51-100: React imports & configuration
- Lines 100-200: Icons & state management
- Lines 200-500: Data handlers & CRUD operations
- Lines 500-1000: UI components
- Lines 1000-1500: Form components
- Lines 1500-2000: Main layout & rendering

### Testing Checklist
- [ ] Create/edit/delete items
- [ ] Assign reviewers → status changes to in-review
- [ ] Approve/reject items with notes
- [ ] Edit approved item → resets to draft
- [ ] Create test case with references → relationships appear
- [ ] Switch projects → view clears
- [ ] Logout → screen clears
- [ ] View refreshes after edits

## License

Proprietary - Fresh Consulting

## Support

For issues or questions, contact the development team.
