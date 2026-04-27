# Integrate React Demos Spec

## Why
The current `index.html` uses static HTML, CSS, and JS to mock the behavior of the "Public End Platform" (Tab 4) and "Doctor End Customization" (Tab 5). We need to replace these mockups with the actual React applications (`zheli-wutong` and `demo`) to provide fully functional demonstrations within the landing page.

## What Changes
- Build the `zheli-wutong` project and configure it to be served via an iframe.
- Build the `demo` project and configure it to be served via an iframe.
- Update `index.html` Tab 4 (`#tab-c-end`) to embed the built `zheli-wutong` project using an `<iframe>` instead of the static `.mobile-mockup`.
- Update `index.html` Tab 5 (`#tab-b-end`) to embed the built `demo` project using an `<iframe>` instead of the static `.emr-demo`.
- Modify Vite configurations of both projects (`base` path) so their built assets load correctly when accessed from the root directory.
- Remove obsolete CSS and JS functions from `index.html`.

## Impact
- Affected specs: Landing page demo interactions.
- Affected code: `/workspace/index.html`, `/workspace/zheli-wutong/vite.config.js`, `/workspace/demo/vite.config.ts`.

## ADDED Requirements
### Requirement: Real React App Integration
The system SHALL embed the real React applications into the landing page tabs instead of static mockups.

#### Scenario: Success case
- **WHEN** user navigates to Tab 4 (大众端平台)
- **THEN** they see the `zheli-wutong` React app loaded in an iframe.
- **WHEN** user navigates to Tab 5 (医生端定制)
- **THEN** they see the `demo` React app loaded in an iframe.

## REMOVED Requirements
### Requirement: Static HTML Mockups
**Reason**: Replaced by the actual React projects.
**Migration**: Remove the static HTML/JS/CSS mockups for Tab 4 and Tab 5 from `index.html`.