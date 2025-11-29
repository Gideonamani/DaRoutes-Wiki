Below is a **DARoutes MVP PRD** 

---

# **DARoutes – MVP Product Requirements Document (PRD)**

## **1\. Product Overview**

**Product name:** DARoutes  
 **One-liner:** A web app that maps Dar es Salaam’s public transport routes, stops, terminals, and fares, making commuting clearer for everyone.

**High-level idea**

* Public buses (dala dala) are crucial but their information (routes, stages, fares, terminals) is mostly informal.

* DARoutes digitizes this into a structured, visual, and explorable web app.

* MVP focuses on:

  * Discovering routes and stops

  * Viewing clear details for each

  * Allowing logged-in contributors to add/edit routes via a simple dashboard and “New Route” workflow.

---

## **2\. Goals & Success Criteria**

### **Primary Goals (MVP)**

1. **Discoverability** – A commuter can:

   * Land on the homepage, browse route cards, open a specific route page, and navigate to stop/terminal pages.

2. **Clarity** – Each route/stop/terminal page clearly shows:

   * Path on a simplified map preview

   * Operating times, sample fare, and key details.

3. **Contribution** – A logged-in contributor can:

   * Create a new route (name, number, via roads, stops, coordinates, optional KML/CSV path).

   * See activity summary via a dashboard and personal profile.

### **Success Criteria (qualitative)**

* A new user understands **within 10 seconds** what DARoutes is for (Explainer \+ Homepage).

* A commuter can answer:  
   “Which route goes from X to Y and what is the approximate fare & times?”

* An editor can add a new route from scratch **without external instructions**.

---

## **3\. Target Users & Roles**

### **Personas**

1. **Commuter (Anonymous user)**

   * Visits site without login.

   * Needs to quickly see which route to take, the stops, and fare range.

2. **Contributor / Editor (Logged-in user)**

   * Local enthusiast or transport nerd.

   * Adds/updates routes and stops using a simple admin UI.

   * Cares about accuracy, coordinates, and consistency.

3. **Admin / Maintainer**

   * Has all contributor abilities.

   * Uses dashboard for overall stats and managing operators, data corrections, etc.

   * For MVP, admin can use same UI as contributor but with a few extra views.

### **Roles & Permissions (MVP)**

* **Anonymous:**

  * Can view: Homepage, Route Page, Stop Page, Terminal Page, Explainer.

  * Can’t edit or add data.

* **Logged-in Contributor:**

  * All anonymous abilities plus:

  * Access Dashboard, Profile, New Route Page.

  * Create routes; optionally mark as draft/published (even if stored as a simple boolean).

* **Admin (subset of contributors with extra flag):**

  * Same as contributor.

  * Can see extra stats, service alerts management (even if stubbed for now).

---

## **4\. Scope for MVP**

### **In-Scope**

* Responsive web app (desktop first, mobile friendly).

* Main pages:

  1. Homepage

  2. Route Page

  3. Stop Page

  4. Terminal Page

  5. New Route Page

  6. Dashboard

  7. Profile Page

  8. Explainer/About Page

  9. Login (basic sign-in/sign-out)

* Basic search/filter on homepage (search routes/stops by text).

* Save / Share buttons (UI only; “Save” can be local or user-bound; “Share” triggers share dialog / copy link).

* KML/CSV upload for route paths on New Route page, with preview.

* Simple data model (see section 7).

### **Out-of-Scope for MVP**

* Real-time bus tracking.

* Full OTP-style trip planning (“from A to B, best route”).

* Payments / digital ticketing.

* Full moderation workflow (e.g., multi-step approvals).

---

## **5\. Information Architecture & Navigation**

### **Global Navigation**

* **Top bar (for all pages):**

  * Left: logo/wordmark “DARoutes”

  * Right:

    * “Explainer” link

    * “Login” / “Profile” icon (depending on auth state)

    * Hamburger menu on mobile with links:

      * Home

      * Explainer

      * Dashboard (if logged in)

      * Profile

      * Logout

### **Key Pages & Routes (URL examples)**

* `/` – Homepage

* `/explainer` – Explainer/About

* `/login` – Login

* `/routes/:routeId` – Route page

* `/stops/:stopId` – Stop page

* `/terminals/:terminalId` – Terminal page

* `/dashboard` – Dashboard (contributors/admin)

* `/profile` – Profile

* `/routes/new` – New Route page

---

## **6\. Detailed Page Requirements**

### **6.1 Homepage (`/`)**

**Purpose:** Entry point to discover routes quickly.

**Sections:**

1. **Header**

   * DARoutes wordmark (top left)

   * Links: Explainer, Login, Hamburgers on mobile.

2. **Search Bar**

   * Placeholder: “Search routes, stops, or terminals…”

   * Text search across route name/number and stop names (simple substring match is fine for MVP).

3. **Filters**

   * Pills/buttons:

     * “All Routes”

     * “By Fare”

     * “By Terminal”

   * MVP: non-functional or minimal sorting (e.g. sort by name, by fare).

4. **Routes Grid**

   * Card for each route:

     * Route title: `T/Nyuki – Gerezani`

     * Subtitle: `via Bagamoyo Road, Muhimbili Road`

     * Color chips: primary & secondary colors representing route.

     * **Map Preview Area (placeholder)**:

       * Gray rectangle; in future can show polyline over mini map.

     * Footer row:

       * Route number

       * Operating hours

       * Typical fare

   * Clicking a route card → Route Page.

5. **Footer**

   * Text: “DARoutes © YEAR — Mapping Dar es Salaam’s Public Transport Network”

   * Data last updated text (configurable).

---

### **6.2 Route Page (`/routes/:routeId`)**

**Purpose:** Show detailed info for a specific bus route.

**Key Components:**

1. **Header Section**

   * Route Title: `14 – T/Nyuki – Gerezani`

   * Via roads summary.

   * Color tags.

2. **Map \+ Route Overview**

   * Large map preview card (can be SVG placeholder that simulates route).

   * Shows line from start to end with intermediate stops.

3. **Quick Facts Bar**

   * Route number

   * Typical fare (base fare)

   * Operating hours

   * Approx. distance (optional placeholder)

4. **Stages & Stops Card**

   * Vertical list of stops (stage concept).

   * Each stop:

     * Name, small icon.

     * Visual indication of **past / current / upcoming**:

       * For demo: assume we’re somewhere between stop X and Y and show:

         * Past stops: muted color

         * Current segment: bolder with dotted line

         * Upcoming: normal color

   * Clicking a stop:

     * Opens a drawer or side panel with minimal info.

     * “View full stop page” button → `/stops/:stopId`.

5. **Fare & Operators Card**

   * Summary of:

     * Base fare.

     * Notes on peak vs off-peak (for MVP can be static text).

     * Operators list (names, badges).

6. **Ticket Visual Card (Optional but in spec)**

   * Digital sample ticket styled via HTML/CSS.

   * Optionally small gallery of real ticket photos.

7. **Save / Share Buttons**

   * Save: Adds to user’s “Saved routes” list (if logged in; otherwise can show “Login to save”).

   * Share: Opens native share dialog or copies URL to clipboard.

---

### **6.3 Stop Page (`/stops/:stopId`)**

**Purpose:** Deep-dive into a specific bus stop.

**Components (already wireframed and Terminal should mirror this style):**

1. **Header**

   * Stop name and local nickname.

   * Coordinates.

   * Save / Share buttons.

2. **Map Preview**

   * Small map-like card centered on stop with simplified street lines.

3. **Busy Hours Card**

   * A small chart or bar blocks for time-of-day vs busyness (0–5 scale).

   * For MVP: static demo data.

4. **Routes Serving This Stop**

   * Chips or mini cards listing route numbers and names.

   * Clicking → Route Page.

5. **Live Arrivals (placeholder)**

   * ETA list (static demo).

   * “Last updated at …” text.

6. **Photos**

   * Small gallery of uploaded photos.

7. **Accessibility**

   * Checklist: curb ramp, lighting, seating, etc.

8. **Service Alerts & Report Issue**

   * Short card with any active alerts.

   * Link “Report an issue” (can open mailto or simple form placeholder).

---

### **6.4 Terminal Page (`/terminals/:terminalId`)**

**Purpose:** Stop Page but “bigger” — for large hubs.

**Components:**

* Everything the Stop Page has, in a terminal scale:

  * Overview card (location, coordinates, routes, daily passengers, supervisor, contact).

  * Map card (can use stylized diagram, like the radial/arm drawing you showed).

  * Busy hours.

  * Accessibility.

  * Photos.

  * Service alerts (often more important here).

  * Connected Routes section: grid of route cards (each linking to Route Page).

---

### **6.5 New Route Page (`/routes/new`)**

**Purpose:** Main tool for contributors to create a new route.

**Sections:**

1. **Header**

   * Title: “New Route”

   * Buttons:

     * “Preview Route Page” toggles between form and preview mode.

     * “Save Route” saves (backend or local mock).

2. **Form mode (default)**

   * **Route Info Card**

     * Route Number

     * Route Name

     * Via Roads (textarea)

     * Default Fare (string; no currency logic needed for MVP)

   * **Stops & Stages Card**

     * Dynamic list of rows:

       * Stop Name

       * Latitude

       * Longitude

       * Remove row button

     * “Add Stop” button adds a new empty row.

     * Order of rows \= order along route.

   * **Upload Route Path Card**

     * File input allowing `.kml` or `.csv`.

     * Basic parsing:

       * CSV: detect headers like `lat,lon` or `latitude,longitude`

       * KML: parse `<coordinates>` blocks to get `lon,lat`.

     * Show:

       * Number of points loaded.

       * Simple SVG polyline preview.

       * Clear button.

       * Error message if parsing fails.

   * **Tips Card**

     * Text tips for data quality.

3. **Preview mode**

   * Shows a simulated **Route Page** using entered data:

     * Route title

     * Via text

     * Default fare

     * List of stops

     * Map path preview (using uploaded routePath if available).

   * This is read-only and used only to visually confirm.

---

### **6.6 Dashboard (`/dashboard`)**

**Purpose:** Central view for contributors/admins.

**Sections:**

* **Header**

  * Title “Dashboard”

  * Search field (for routes/stops/operators)

  * Buttons:

    * Refresh (simulated)

    * New Route

    * Settings

* **Metrics Row**

  * Routes count

  * Stops count

  * Operators count

  * Active alerts

  * Views (7d)

* **Usage Chart**

  * Simple area chart placeholder (no real analytics needed yet).

* **Top Routes**

  * List or grid with basic stats (views, trend %).

* **Recent Activity**

  * Log of recent edits/creations (from audit\_log table).

* **Quick Actions**

  * Links to “New Route”, “New Stop”, “Operators”, “Alerts”.

* **Service Alerts and System Health**

  * Panels summarizing alerts and high-level system checks (static text ok for now).

---

### **6.7 Profile Page (`/profile`)**

**Purpose:** Show contributor’s identity and impact.

**Sections:**

* User info:

  * Avatar, name, role, email, phone, join date, last active.

* Settings:

  * Account preferences

  * Privacy & security

* Contributions Overview:

  * Routes added, stops added, edits reviewed, rating (static placeholder).

* Recent Contributions:

  * List of last few actions (leveraging audit\_log).

---

### **6.8 Explainer Page (`/explainer`)**

**Purpose:** Explain what DARoutes is, why it exists, and how to get involved.

**Sections:**

* Hero title and subtitle.

* Buttons: Get Involved, View Routes.

* Vision \+ How It Works (two cards).

* “How You Can Take Part” (Contribute, Verify, Engage).

* Impact metrics (routes, stops, contributors, districts).

* Contact & collaboration (Email Us button).

---

### **6.9 Login (`/login`)**

**Purpose:** Minimal authentication.

* Simple email/password (or even mocked login for MVP).

* After login → redirect to Dashboard.

* Include link back to home & explainer.

---

## **7\. Data Model (High Level)**

Suggested relational schema (names are indicative):

### **7.1 `users`**

* `id` (PK)

* `name`

* `email`

* `phone`

* `role` (`commuter`, `contributor`, `admin`)

* `created_at`

* `last_login_at`

### **7.2 `routes`**

* `id` (PK)

* `number` (e.g. “14”)

* `name` (e.g. “T/Nyuki – Gerezani”)

* `via` (text)

* `default_fare`

* `start_stop_id` (FK → stops)

* `end_stop_id` (FK → stops)

* `status` (`draft`/`published`)

* `created_by` (FK → users)

* `created_at`, `updated_at`

### **7.3 `stops`**

* `id` (PK)

* `name`

* `slug` or `code`

* `lat`

* `lon`

* `description`

* `is_terminal` (boolean)

* `created_at`, `updated_at`

### **7.4 `route_stops` (join \+ ordering)**

* `id` (PK)

* `route_id` (FK)

* `stop_id` (FK)

* `sequence` (int; order along route)

* `stage_name` (optional)

### **7.5 `terminals`**

* Either:

  * reuse `stops` with `is_terminal = true` **OR**

  * separate table referencing `stop_id`

* Example fields (if separate):

  * `id`

  * `stop_id`

  * `daily_passengers`

  * `supervisor_name`

  * `contact_phone`

  * `facilities` (json or text)

### **7.6 `fares`**

* `id`

* `route_id`

* `base_fare`

* `currency`

* `notes` (peak/off-peak, stages, etc.)

### **7.7 `operators`**

* `id`

* `name`

* `contact`

* `notes`

### **7.8 `route_operators`**

* `id`

* `route_id`

* `operator_id`

### **7.9 `attachments`**

* `id`

* `entity_type` (`route`, `stop`, `terminal`)

* `entity_id`

* `type` (`photo`, `ticket_sample`, etc.)

* `url` or storage reference

* `caption`

### **7.10 `audit_log`**

* `id`

* `user_id`

* `entity_type`

* `entity_id`

* `action` (`create`, `update`, `delete`)

* `summary` (short text)

* `created_at`

(You can simplify if needed for the initial build.)

---

## **8\. UI & Design System**

### **Color Palette**

* **Primary (Teal 600):** `#009688`  
   Calm, modern, trustworthy – public transport \+ civic feel.

* **Primary Variant (Teal 700):** `#00796B`  
   Hover states, darker accents.

* **Accent (Cyan 400):** `#5CE1E6`  
   Fresh, techy, gives DARoutes a digital identity.

* **Background:** `#F9FAFB`  
   Clean base.

* **Surface (Cards):** `#FFFFFF`

* **Text Primary:** `#1F2937`

* **Text Secondary:** `#6B7280`

* **Error:** `#D32F2F`

* **Success:** `#00C49A`

### **Typography**

* Sans-serif, geometric/modern (e.g. Inter, Source Sans, etc.).

* Hierarchy:

  * H1: 24–32px bold

  * H2: 20–24px semibold

  * Body: 14–16px regular

### **Layout**

* Cards with soft shadows and rounded corners.

* Generous whitespace; avoid clutter.

* Responsive grid (1 col mobile → 2/3 cols on desktop).

### **Iconography**

* Simple line icons for:

  * Bus, Map Pin, Clock, Credit Card, User, Alert.

* Icons used consistently across pages.

---

## **9\. Non-Functional Requirements (MVP)**

* Should render well on:

  * Desktop (primary design target)

  * Mobile phones (minimum 360px width).

* Loads initial homepage quickly (\< 3s on average connection).

* Minimal dependencies; no heavy map engines required for MVP (SVG placeholders acceptable).

---

## **10\. Analytics / Logging (Optional for MVP)**

* Log basic events:

  * Route page viewed

  * Stop/terminal page viewed

  * New route created

* Store in a simple `events` table or use existing analytics.

---

## **11\. Open Questions / Future Enhancements**

* How will we integrate **real map tiles** (OpenStreetMap, MapLibre, etc.) later?

* Do we want full **trip planner** capabilities later?

* Will we expose **public APIs** for route/stop data?

