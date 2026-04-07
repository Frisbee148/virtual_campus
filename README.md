# 🎓 VirtualCampus / Canvas LMS Setup Guide

Welcome to the **VirtualCampus** project, built on top of the **Canvas LMS** core. This repository contains the complete codebase to run a highly customized academic portal providing tailored interfaces for Students, Faculty, and Parents/Guardians.

---

## 📝 Overview

VirtualCampus is divided into multiple main components:
1. **Frontend / Interfaces:** A modern React, Vite, and Tailwind CSS powered UI offering custom authentication, Student/Faculty/Parent dashboards, and an AI Mentor integration.
2. **Backend Engine:** The robust, open-source Canvas LMS platform acting as the administrative and academic foundation, written in Ruby on Rails.

*For deeper insights into the feature set and structure of the React-based frontend components, please review the `context/` directory documentation.*

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your host machine:

1. **Docker**: Essential for containerizing the application services. ([Install Docker](https://docs.docker.com/get-docker/))
2. **Git**: Required to clone and version control the source code. ([Install Git](https://git-scm.com/downloads))

*Note: You do not need to install local versions of Ruby, Node, Yarn, or Postgres, as all services and build operations will run isolated inside Docker containers.*

## 🚀 Getting Started on Localhost

Follow these detailed steps to build the Docker containers, execute initial setup scripts, and start the development environment.

### 1. File / Permission Preparation (Linux Only)
*(Skip this step if you are on MacOS or Windows)*
To avoid permission issues running Docker operations that alter source files, grant Docker containers write access:
```bash
setfacl -Rm u:9999:rwX,g:9999:rwX .
setfacl -dRm u:9999:rwX,g:9999:rwX .
sudo addgroup --gid 9999 docker-instructure
sudo usermod -a -G docker-instructure $USER
```
*You may need to log out and back in to recognize the new default group.*

### 2. Initial Setup Script
The repository provides a script to handle the heavy lifting (copying config templates, configuring Docker settings, pulling images, establishing DB configuration, etc).

From the root directory, run the setup script:
```bash
./script/docker_dev_setup.sh
```
*Pay close attention to any "Next Steps" output from the script during its execution.*

### 3. Start the Application Stack
Once the setup is successfully completed, you can start all necessary backend services (Web application, Postgres Database, Redis) in detached mode:
```bash
docker compose up -d
```
All system databases and core containers will launch automatically.

### 4. Build Frontend Assets
In order to view the full UI and frontend integrations, you must build the client assets at least once. 

Open a development shell inside the `web` container:
```bash
docker compose run --rm web bash
```

Inside the container, build the frontend development assets in watch mode (updates automatically upon file changes):
```bash
yarn build:watch
```
*(Leave this terminal window open so changes to the frontend code can compile automatically in the background.)*

### 5. Accessing Localhost
With the containers running and frontend assets built, access the portal via:
- If using Dinghy/Dory DNS configuration: **http://canvas.docker/**
- Alternatively: Check your Docker port bindings (commonly **http://localhost:3000** for Canvas LMS setups).

---

## 🛠️ Development & Helpful Commands

All typical development tasks should be run inside the `web` Docker container:
```bash
# To enter the web dev shell
docker compose run --rm web bash
```

**Inside the Container:**
| Action | Command |
| ------ | ------- |
| **Start Webpack Watcher** | `yarn webpack` |
| **Recompile CSS/Styles** | `yarn build:css` |
| **Run JS Linter** | `yarn lint` |
| **Run JS UI Tests (Vitest)**| `yarn test` or `yarn test:watch` |
| **Run Ruby RSpec Tests** | `bin/rspec path/to/test` |
| **Run Ruby Linter** | `bin/rubocop` |
| **Access Rails Console** | `rails c` |

## 📚 Project Structure Highlights

- `context/` - Detailed project specs, contexts, and UI design decisions for Virtual Campus.
- `app/` - Canvas Rails MVC (Ruby backend logic).
- `ui/` - React components & shared frontend packages.
- `gems/plugins/` - Custom functionalities.
- `script/` - Useful setup and deployment automation scripts.

---
For additional details on contributing or modifying the core LMS platform, please refer to `/doc` or the `AGENTS.md` and `CONTRIBUTING.md` files.
