# Unreal Engine 5 Player Analytics Plugin

**Professor:** Tracy Hammond

**Teaching Assistants:** James Ault, Rosendo Narvaez

**Industry Mentors**: Maitland Lederer, Preston Hale

**Contributors:** Kristine Lam, Dallas Coggins, Brack Harmon, Allen Wang, Jessica Jakubik


## Overview

The **Player Analytics Plugin** is a lightweight, standalone analytics tool for Unreal Engine 5 that enables developers to track in-game player behavior without relying on third-party services. Designed for accessibility and flexibility, it provides Blueprint nodes for logging movement, sessions, UI interactions, performance stats, and more. Data is exportable in structured JSON format and can be sent to a local or cloud-based server for storage and visualization.

This tool empowers indie developers, academic researchers, and game studios to gather fine-grained analytics on gameplay and player interaction — all without external dependencies or cost barriers.

## Features

- Modular architecture for easy customization
- Tracks movement, interactions, FPS, CPU, RAM, UI usage, and more
- Integrates with Blueprints via intuitive node-based system
- Starter backend with Flask + MongoDB
- Starter frontend dashboard (React + Vite) for live data visualization
- Compatible with local or cloud-based deployment

---

## Plugin Installation

### Manual Installation via GitHub

1. Download the latest release from this repository:
   [https://github.com/kristinetlam/Player-Analytics-UE-Plugin](https://github.com/kristinetlam/Player-Analytics-UE-Plugin)

2. Locate the folder named `PlayerAnalyticsPlugin` in the release.

3. Copy the folder into your UE project’s plugin directory: YourProject/Plugins/PlayerAnalyticsPlugin

4. Open your Unreal project and go to `Edit > Plugins > Other` to enable the plugin.

## 🛠️ Server + Frontend Setup 

You can set up a backend Flask server and a frontend React dashboard for data storage and visualization.

Please refer to the full [User Manual](https://docs.google.com/document/d/1qo5yga_HrmqLcnIgTEXEYvzFOKTHlLQG9H3h4bgoFcI/edit?tab=t.0) for step-by-step instructions on:

- Python + MongoDB installation
- Flask backend setup
- React + Vite frontend setup
- HTTPS configuration for production

---

## Documentation

- All Blueprint nodes are documented with usage examples.
- Player setup requires attaching components and initializing the Player Data Handler.
- Server configuration (IP + Token) must be added in Unreal's project settings.
- Logs can be exported as JSON or sent live to your server.

---

## Feedback & Contributions

If you have questions, feature requests, or feedback, feel free to let us know!

---