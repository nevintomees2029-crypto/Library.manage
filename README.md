# Libra — Library Management System (Frontend Demo)

A responsive, frontend-only library management website built with HTML, CSS and JavaScript. It is suitable for hosting on GitHub Pages.

## Features
- Add and search books; ISBN is treated as a unique key.
- Issue and return books.
- FIFO waiting list for unavailable titles.
- Recent-return history (newest first, Stack/LIFO concept).
- Subject-wise browsing.
- Browser `localStorage` saves the demo data on the current device/browser.
- Responsive layout for mobile and desktop.

## Run locally
Open `index.html` in a browser. No install or backend is needed.

## Publish with GitHub Pages
1. Create a GitHub repository, for example `library-management-system`.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait for the Pages URL to appear in Settings → Pages.

## Important
This is a frontend demo, not a Java backend application. The data structures are demonstrated in JavaScript and the browser stores changes locally. Different users/devices do not share data. GitHub Pages hosts static websites and does not run Java server code.
