# Fixing All Application Pages

This plan aims to ensure all pages in the SMARTSTOCK application are fully functional, properly styled, and free of runtime errors.

## Proposed Changes

### Navigation & Layout
- **Dark Mode Relocation**: Move the theme toggle button from `Sidebar.jsx` to the header in `Layout.jsx`.
- **Sidebar Cleanup**: Remove the dark mode toggle section from the sidebar to keep it focused on navigation.

### Authentication & 2FA
- **Login Overhaul**: Add required "Email Address" and "Phone Number" inputs to the Login page.
- **2FA Step**: Implement a mock two-factor verification screen after role selection and contact info entry.
- **Data Persistence**: Store email and phone in the auth context.

### Dead Stock Management Module
- **Minimalist Re-Design**: Complete overhaul of `DeadStock.jsx` to focus on business metrics.
- **Dead Stock Logic**:
    - Identify items unsold for >60 days using `lastSoldDate`.
    - Calculate **AI Aging Risk %** based on days idle and sales velocity.
- **Card UI**: Each product card must show only:
    - Product Name
    - Days Idle
    - Stock Quantity
    - AI Aging Risk %
    - Recoverable Value (₹)
- **Primary Actions**:
    - **Flash Liquidation**: Apply 10-30% discount.
    - **Regional Transfer**: Suggest high-demand hub and update status.
- **Jargon Removal**: Remove terms like "Node Payload", "Neural Score", "Velocity Zero".

## Verification Plan
### Manual Verification
- Verify Inventory page matches the reference image exactly.
- Test searching and filtering functionality.
- Confirm Dark Mode toggle works from the header and is removed from the sidebar.
- **Map Interaction**: Hover over each region in the India Hubs map and verify the colors change correctly based on demand levels.
- Test "Edit" and "Add Paint" modals.
- **Manual Verification**: Navigate through every page in the sidebar and interact with key features.
- **Console Audit**: Check the browser console for any errors or warnings during navigation.
