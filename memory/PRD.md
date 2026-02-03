# GovEnforce - UK Council Enforcement Case Management App

## Original Problem Statement
Build an app for an enforcement team in a United Kingdom local government authority council. The team deals with cases such as fly tipping, abandoned vehicles, littering, dog fouling, public spaces protection order enforcement.

## Architecture
- **Frontend**: React with Tailwind CSS, Shadcn UI components, React Leaflet
- **Backend**: FastAPI with MongoDB, httpx for external APIs
- **Authentication**: JWT-based custom auth (no social login)
- **External APIs**: What3Words (optional, graceful degradation)

## User Personas
1. **Officers**: View/update assigned cases, upload evidence, add notes, self-assign from unassigned pool, close cases with reason
2. **Supervisors**: Assign/reassign cases, view all cases, close cases, reopen cases
3. **Managers/Admin**: Reporting, configuration, user management, team management, CSV export

## Core Requirements
- Role-based access control (Officer, Supervisor, Manager)
- Team-based case visibility
- Case management with workflow (New → Assigned → Investigating → Closed)
- Evidence upload (photos, documents)
- Case notes and audit timeline
- Public reporting form (no login required)
- In-app notifications
- Map view with location data and admin-configurable defaults
- What3Words integration (optional)
- Basic statistics and CSV export

## What's Been Implemented

### Phase 1 (2026-02-02)
- Complete authentication system with JWT
- Role-based access control
- Case CRUD operations with filtering
- Evidence upload and management
- Case notes functionality
- Audit trail logging
- Public report submission
- Notification system
- Dashboard with statistics
- Map view with Leaflet
- User management (admin)
- CSV export functionality
- Default demo users on startup

### Phase 2 (2026-02-02)
- Case-type specific custom fields for all original types
- Conditional field rendering in all forms
- Details tab in case detail page
- Location Tab with interactive map
- Editable coordinates with drag-drop

### Phase 3 (2026-02-03)
- **System Configuration (Admin Settings)**:
  - Configurable app title and organization name
  - Default map center (latitude, longitude) and zoom level
  - What3Words feature toggle
  - Public reporting toggle
  - Case retention period configuration
  - Logo upload

- **Teams & Visibility**:
  - Team management CRUD (create, update, delete)
  - Team types: Enforcement, Environmental Crimes, Waste Management
  - User-to-team assignment (multiple teams per user)
  - Cross-team access for supervisors
  - Case type → Team visibility mapping:
    - Waste Management: Fly-tipping (general) only
    - Enforcement: Most case types
    - Environmental Crimes: Full visibility

- **New Case Types**:
  - Fly Tipping (Private Land)
  - Fly Tipping (Organised Crime)
  - Untidy Land
  - High Hedges
  - Waste Carrier / Licensing
  - Nuisance Vehicle (General)
  - Nuisance Vehicle (On-Street Seller)
  - Nuisance Vehicle (Parking)
  - Nuisance Vehicle (ASB)
  - Complex Environmental Offence

- **Case Closure Enhancement**:
  - All users must provide closure reason + final note when closing
  - Closure reasons: Resolved, No Action Required, Insufficient Evidence, etc.
  - Only supervisors/managers can reopen closed cases

- **Waste Management Clearance Outcome** (for fly-tipping cases):
  - Items cleared? (Yes/No) - mandatory
  - Reason not cleared (mandatory if No)
  - Clearance date and disposal method

- **What3Words Integration**:
  - W3W API status check
  - Convert W3W → Coordinates
  - Convert Coordinates → W3W (may be rate limited)
  - Copy W3W address to clipboard
  - W3W search in Location Tab
  - Graceful fallback when API unavailable

- **Location Tab Enhancements**:
  - Uses admin-configured map defaults (not hardcoded London)
  - Interactive map with draggable marker
  - W3W search and copy functionality
  - Location history tracking

## Database Schema
- **users**: id, email, name, role, teams[], cross_team_access, is_active
- **cases**: id, reference_number, case_type, status, description, location, assigned_to, owning_team, closure_reason, final_note, type_specific_fields
- **teams**: id, name, team_type, description, is_active
- **system_settings**: Singleton document for global configuration
- **audit_logs**: case_id, user_id, action, timestamp, details
- **notes**: case_id, content, created_by
- **evidence**: case_id, filename, file_data, file_type
- **notifications**: user_id, title, message, read

## API Endpoints
- Auth: POST /api/auth/login, /api/auth/register, GET /api/auth/me
- Cases: GET/POST /api/cases, GET/PUT /api/cases/{id}
- Teams: GET/POST /api/teams, PUT/DELETE /api/teams/{id}
- Settings: GET/PUT /api/settings
- W3W: GET /api/w3w/status, POST /api/w3w/convert
- Notes: GET/POST /api/cases/{id}/notes
- Evidence: GET/POST /api/cases/{id}/evidence
- Users: GET /api/users, PUT /api/users/{id}
- Reports: GET /api/reports, /api/reports/csv
- Public: POST /api/public/report

## Prioritized Backlog

### P0 (Completed)
- ✅ System Configuration
- ✅ Teams & Team-based visibility
- ✅ New case types
- ✅ Case closure with mandatory reason
- ✅ W3W integration (with graceful fallback)

### P1 (Next)
- Advanced search by case-type specific fields (e.g., vehicle registration)
- Backend mandatory field validation for case creation

### P2 (Future)
- Advanced reporting dashboard with charts
- GDPR case retention automation
- Email notifications (SendGrid integration)
- Mobile-optimized views
- Offline capability for officers

## Known Limitations
- W3W API may return 402 (Payment Required) - feature works gracefully when unavailable
- Backend is a monolithic server.py - consider refactoring for larger deployments
