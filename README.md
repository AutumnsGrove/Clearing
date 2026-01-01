# Clearing — Grove Status Page

> *A clearing in the forest where you can see what's happening.*

**Public Name:** Clearing  
**Internal Name:** GroveClear  
**Domain:** `status.grove.place`

A clearing is an open space in the forest where the trees part and visibility opens up. You can see what's around you, assess the situation, and understand what's happening.

Clearing is Grove's public status page—transparent, real-time communication about platform health. When something goes wrong or maintenance is planned, users can check the clearing to understand what's happening without needing to contact support.

---

## 🚀 Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Cloudflare Setup

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 📋 Project Overview

### Purpose
The Grove Status page provides transparent, real-time communication about platform health. When something goes wrong—or when maintenance is planned—users can check status.grove.place to understand what's happening without needing to contact support.

### Goals
- **Transparency**: Honest, timely updates about platform issues
- **Reduce support load**: Users can self-serve status information
- **Build trust**: Proactive communication during incidents
- **Simple administration**: Easy for Autumn to post updates from the admin panel

### Non-Goals
- Automated monitoring integration (v1 is manual updates)
- Public incident reporting/submission
- Complex SLA tracking or uptime percentages

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: SvelteKit (static site generation for fast loading)
- **Backend**: Cloudflare Worker (API endpoints)
- **Database**: D1 (shared with main Grove database)
- **Hosting**: Cloudflare Pages
- **Styling**: Tailwind CSS (consistent with Grove aesthetic)
- **Package Manager**: npm/pnpm

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                        status.grove.place                            │
│                     (Cloudflare Worker + Pages)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                      Public Status Page                          ││
│  │                                                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              ││
│  │  │  Current    │  │  Component  │  │   Incident  │              ││
│  │  │  Status     │  │  Status     │  │   History   │              ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘              ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────────┐││
│  │  │                    RSS Feed (/feed)                          │││
│  │  └─────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ reads from
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           D1 Database                                │
│                        (shared with Grove)                           │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ components  │  │  incidents  │  │  updates    │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │ writes to
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                    GroveAuth Admin Panel                             │
│                   (Autumn's admin interface)                         │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                  Status Management Section                       ││
│  │                                                                  ││
│  │  - Create/update incidents                                       ││
│  │  - Post incident updates                                         ││
│  │  - Set component status                                          ││
│  │  - Resolve incidents                                             ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Components & Services

Grove's platform is divided into trackable components. Each component has its own status indicator.

### Component List
| Component | Description | Affects |
|-----------|-------------|---------|
| **Blog Engine** | Core blog functionality—publishing, reading, editing | All blog operations |
| **CDN** | Image and media delivery via R2/Cloudflare | Media loading, image uploads |
| **Authentication** | Heartwood login and session management | Sign-in, admin access |
| **Meadow** | Community feed, reactions, voting | Social features |
| **Payments** | Stripe integration for subscriptions | Plan upgrades, billing |
| **API** | Backend API endpoints | All platform operations |

### Component Statuses
| Status | Color | Meaning |
|--------|-------|---------|
| **Operational** | Green | Everything working normally |
| **Degraded Performance** | Yellow | Slower than usual, but functional |
| **Partial Outage** | Orange | Some functionality unavailable |
| **Major Outage** | Red | Component is down |
| **Maintenance** | Blue | Planned maintenance in progress |

---

## 🚨 Incident Management

### Incident Types
| Type | Description | Example |
|------|-------------|---------|
| **Outage** | Service unavailable | "Blog engine returning 500 errors" |
| **Degraded Performance** | Service slow or unreliable | "Image uploads taking longer than usual" |
| **Planned Maintenance** | Scheduled work | "Database migration scheduled for 2am UTC" |
| **Security Incident** | Security-related issue | "Investigating unusual activity" |

### Incident Lifecycle
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Investigating│────▶│  Identified  │────▶│  Monitoring  │────▶│   Resolved   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                     │
       ▼                    ▼                    ▼                     ▼
  "We're aware       "Root cause         "Fix deployed,          "Incident
   and looking        identified,          watching for           resolved"
   into it"           working on fix"      stability"
```

---

## 🗄️ Database Schema

See [`clearing-spec.md`](clearing-spec.md) for complete database schema with:
- `status_components` - Trackable platform components
- `status_incidents` - Incidents (outages, maintenance, etc.)
- `status_updates` - Updates posted to incidents (timeline)
- `status_incident_components` - Which components are affected by which incidents
- `status_scheduled` - Scheduled maintenance announcements

---

## 🔌 API Specification

### Public Endpoints (No Auth)
- `GET /api/status` - Current overall status
- `GET /api/incidents` - List incidents (30-day history)
- `GET /api/incidents/:slug` - Single incident with full timeline
- `GET /api/feed` - RSS feed of incidents

### Admin Endpoints (Authenticated)
- `POST /admin/incidents` - Create new incident
- `PATCH /admin/incidents/:id` - Update incident status
- `POST /admin/incidents/:id/updates` - Post update to incident
- `PATCH /admin/components/:slug` - Update component status
- `POST /admin/scheduled` - Schedule maintenance

See [`clearing-spec.md`](clearing-spec.md) for complete API documentation.

---

## 🎨 Design & UX

### Visual Design
- **Clean and minimal**: Focus on information, not decoration
- **Consistent with Grove**: Same color palette, typography (Lexend)
- **Status colors**: Green (good), Yellow (degraded), Orange (partial), Red (major), Blue (maintenance)
- **Dark mode support**: Follows system preference

### Mobile Considerations
- Fully responsive
- Component grid stacks on mobile
- Incident timelines remain readable
- Touch-friendly interactive elements

### Accessibility
- Proper color contrast ratios
- Screen reader friendly status announcements
- Keyboard navigable
- Status not communicated by color alone (icons + text)

---

## 📁 Project Structure

```
Clearing/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   ├── styles/         # Tailwind and CSS
│   │   └── utils/          # Utility functions
│   ├── routes/
│   │   ├── +layout.svelte  # Root layout
│   │   ├── +page.svelte    # Homepage
│   │   ├── incidents/
│   │   │   └── [slug]/     # Incident detail pages
│   │   └── feed/           # RSS feed
│   └── app.html
├── worker/
│   ├── api/                # Cloudflare Worker API endpoints
│   ├── db/                 # Database operations
│   └── index.ts            # Worker entry point
├── tests/                  # Test files
├── clearing-spec.md        # Project specification
├── AGENT.md               # Project instructions for Claude Code
├── TODOS.md               # Task tracking
└── package.json
```

---

## 🛠️ Development Workflow

### Using Claude Code
This project uses the BaseProject template with Claude Code Skills. See [`AGENT.md`](AGENT.md) for complete project instructions.

### Key Skills for This Project
- `cloudflare-deployment` - Cloudflare Workers, KV, R2, D1
- `svelte5-development` - Svelte 5 with runes
- `database-management` - D1 database patterns
- `javascript-testing` - Vitest/Jest testing
- `git-workflows` - Conventional commits

### Starting a New Feature
1. Check `TODOS.md` for pending tasks
2. Use Context7 to fetch relevant library docs
3. Follow git workflow for commits
4. Update `TODOS.md` as you progress

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Strategy
- **Unit tests**: Individual functions and components
- **Integration tests**: API endpoints and database operations
- **E2E tests**: User workflows (incident creation, status updates)
- **Accessibility tests**: Screen reader compatibility

---

## 🚢 Deployment

### Cloudflare Pages
```bash
# Deploy to production
npm run deploy

# Deploy to preview
npm run deploy:preview
```

### Environment Variables
```bash
# Required environment variables
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
DATABASE_ID=your_d1_database_id
```

### CI/CD Pipeline
GitHub Actions workflow automatically:
1. Runs tests on pull requests
2. Deploys to preview environment
3. Deploys to production on merge to main

---

## 📚 Documentation

### Key Documents
- [`clearing-spec.md`](clearing-spec.md) - Complete project specification
- [`AGENT.md`](AGENT.md) - Claude Code project instructions
- [`TODOS.md`](TODOS.md) - Task tracking and progress
- [`AgentUsage/`](AgentUsage/) - Extended reference guides

### Related Projects
- **GroveAuth**: Admin panel integration
- **GroveEngine**: Main platform database (shared D1)
- **House Agents**: Specialized Claude Code sub-agents

---

## 🤝 Contributing

### Git Workflow
1. Create a feature branch from `main`
2. Make changes with descriptive commits
3. Open a pull request
4. Ensure all tests pass
5. Get code review approval
6. Merge to `main`

### Commit Convention
```bash
feat: Add incident detail page
fix: Correct timezone display bug
docs: Update API documentation
refactor: Simplify component status logic
test: Add incident creation tests
chore: Update dependencies
```

---

## 📄 License

This project is part of the Grove platform. See the main Grove repository for licensing information.

---

## 🆘 Support

- **Issues**: Check current status at `status.grove.place`
- **Documentation**: Refer to `clearing-spec.md` for detailed specifications
- **Development**: See `TODOS.md` for current tasks and priorities
- **Questions**: Contact Autumn for project-specific questions

---

**Last updated:** 2026-01-01  
**Spec version:** 1.0  
**Status:** 🟢 Project setup complete, ready for implementation