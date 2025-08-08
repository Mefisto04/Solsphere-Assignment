# Assignment: Cross-Platform System Utility + Admin Dashboard

## 🎯 Objective
The **primary aim** of this assignment is to **evaluate how you think** — your **approach to problem-solving, design decisions, and technical tradeoffs** — along with your **coding skills**.

Build a system that includes:
- A **cross-platform utility** to collect system health data
- An **admin dashboard** to centrally view this data

The project is split into **three parts**:
- The **Utility** is **mandatory**
- Participants may choose to submit either the **Backend** or the **Frontend** as the second part

---

## 📦 Deliverables

### 1. ✅ Mandatory – System Utility (Client)
- Cross-platform installable (macOS / Windows / Linux)
- Performs the following checks:
  - Disk encryption status
  - OS update status (current vs. latest)
  - Antivirus presence and status
  - Inactivity sleep settings (should be ≤ 10 minutes)
- Runs a background daemon that:
  - Periodically (every 15–60 minutes) checks system state
  - Reports data **only if there's a change**
  - Sends updates to a remote API endpoint
  - Consumes minimal resources

### 2. 🔁 Backend Server (API + Storage)
- Accepts system data from the utility (via secure HTTP)
- Stores machine ID, timestamps, and check results
- Provides APIs for:
  - Listing all machines and their latest status
  - Filtering based on OS, issues, etc.
  - **Optional**: CSV export endpoint

### 3. 🔁  Admin Dashboard (Frontend)
- A web UI that:
  - Lists all reporting machines
  - Displays latest values from each
  - Flags any configuration issues (e.g., unencrypted disk, outdated OS)
  - Shows last check-in time
  - Provides filters/sorting (e.g., by OS, status)

---

## 📤 Submission Guidelines
- The **Entire Assignment including utility frontend backend is mandatory** for submission

---

## 🧪 Evaluation Criteria
- Accuracy and reliability of system checks
- Efficiency and robustness of the daemon
- Functionality of backend API or frontend UI
- Code quality, security, and documentation
- Design decisions and implementation clarity

---

## Submission Instructions

* Submit a GitHub/GitLab repository
* Ensure the project can be set up with standard commands


