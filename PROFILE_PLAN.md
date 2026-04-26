# Profile Page Plan - 1688 Electronic Mart

## Overview
A modern, responsive profile page designed for both mobile and desktop with intuitive navigation and essential user functionality.

---

## Structure & Layout

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Logo, Search, Cart, User Menu)                     │
├─────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > My Profile                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │   PROFILE HEADER     │  │    MAIN CONTENT AREA     │   │
│  │   (Avatar + Info)    │  │                          │   │
│  ├──────────────────────┤  │  • Order History         │   │
│  │   NAVIGATION MENU    │  │  • Saved Addresses       │   │
│  │   (Vertical Tabs)    │  │  • Payment Methods       │   │
│  │                      │  │  • Account Settings      │   │
│  │  • Dashboard         │  │  • Wishlist              │   │
│  │  • Orders            │  │  • Support/Help          │   │
│  │  • Addresses         │  │                          │   │
│  │  • Payment           │  │                          │   │
│  │  • Settings          │  │                          │   │
│  │  • Logout            │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)
```
┌─────────────────────────┐
│  HEADER (Mobile)        │
├─────────────────────────┤
│  PROFILE HEADER         │
│  (Avatar + Name + Edit) │
├─────────────────────────┤
│  QUICK STATS ROW        │
│  [Orders] [Wishlist] [Points]
├─────────────────────────┤
│  MENU GRID (2 columns)  │
│  ┌─────┐ ┌─────┐       │
│  │Dash │ │Orders│       │
│  └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐       │
│  │Addr │ │Pay  │       │
│  └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐       │
│  │Set  │ │Help │       │
│  └─────┘ └─────┘       │
├─────────────────────────┤
│  ACTIVE SECTION CONTENT │
│  (Full width card)      │
├─────────────────────────┤
│  BOTTOM NAV BAR         │
│  [Home][Cart][Menu][Profile]
└─────────────────────────┘
```

---

## Profile Header Section

### Desktop
- **Left**: Large circular avatar (120px) with upload overlay
- **Right**: 
  - User name (large, bold)
  - Email address
  - Member since date
  - Account type badge (Regular/B2B/Verified)
  - Edit Profile button

### Mobile
- **Centered layout**
- Avatar (80px) with edit icon
- Name and email stacked
- Horizontal stat cards below

### Functionality
- Avatar upload with preview
- Edit mode toggle
- Real-time name/email update

---

## Navigation Structure

### Desktop: Left Sidebar (Fixed width: 280px)
Menu Items:
1. **Dashboard** - Overview/stats
2. **Order History** - Past orders with tracking
3. **Saved Addresses** - Shipping addresses
4. **Payment Methods** - Saved cards/wallets
5. **Wishlist** - Saved products
6. **Account Settings** - Password, notifications
7. **Help & Support** - FAQ, contact
8. **Logout** - Red button

### Mobile: Grid Menu + Bottom Sheet
- 2-column icon grid (touch-friendly 60px buttons)
- Active section opens as full-screen overlay/sheet
- Swipe down to close
- Back button in header

---

## Section Details

### 1. Dashboard (Default View)
**Desktop:**
- 4 stat cards in row (Orders, Wishlist, Points, Savings)
- Recent orders preview (last 3)
- Quick actions bar

**Mobile:**
- Horizontal scroll stats
- Recent orders list (collapsible)

**Content:**
- Total orders count
- Active wishlist items
- Reward points balance
- Total savings amount
- Quick reorder button

---

### 2. Order History
**Desktop:**
- Filter tabs: All | Pending | Shipped | Delivered | Cancelled
- Table view with columns: Order #, Date, Items, Total, Status, Action
- Pagination (10 per page)

**Mobile:**
- Filter dropdown
- Card list view
- Swipe for quick actions

**Content per order:**
- Order number (clickable)
- Date placed
- Product thumbnails (up to 3)
- Total amount
- Status badge (color-coded)
- Track/View/Reorder buttons

**Functionality:**
- Filter by status
- Sort by date
- Search orders
- Download invoice
- Reorder all items

---

### 3. Saved Addresses
**Desktop:**
- Grid view (2 columns)
- Default badge on primary address
- Edit/Delete buttons per card
- "Add New" button at top

**Mobile:**
- Vertical stack
- Swipe to edit/delete
- Floating "Add" button

**Content per address:**
- Label (Home/Work/Other)
- Recipient name
- Full address
- Phone number
- Default toggle
- Edit/Delete actions

**Functionality:**
- Add new address
- Edit existing
- Set as default
- Delete with confirmation
- Address validation

---

### 4. Payment Methods
**Desktop:**
- Card grid view
- Default payment badge
- Security indicators

**Mobile:**
- Card stack (swipeable)
- Add button prominent

**Content:**
- Card type icon (Visa/MC/Amex)
- Masked number (**** 4242)
- Expiry date
- Cardholder name
- Default toggle
- Remove button

**Functionality:**
- Add new card (secure form)
- Set default
- Remove with confirmation
- 3D Secure indicator

---

### 5. Wishlist
**Desktop:**
- Product grid (3 columns)
- Move to cart / Remove buttons
- Price change indicators

**Mobile:**
- Product list with swipe actions
- Quick add to cart

**Content per item:**
- Product image
- Name
- Current price
- Original price (if sale)
- Stock status
- Remove button
- Add to cart button

**Functionality:**
- Add to cart (with quantity selector)
- Remove item
- Move to saved for later
- Price drop notifications toggle

---

### 6. Account Settings
**Desktop:**
- Tabbed interface
- Forms in organized sections

**Mobile:**
- Accordion/Expandable sections

**Sections:**

#### Personal Information
- First Name
- Last Name
- Email (verified badge)
- Phone number
- Save button

#### Change Password
- Current password
- New password
- Confirm new password
- Strength indicator
- Update button

#### Notification Preferences
- Email notifications toggle
- SMS notifications toggle
- Order updates toggle
- Promotional emails toggle
- Push notifications toggle

#### Privacy
- Delete account button (red, with confirmation modal)

---

### 7. Help & Support
**Desktop:**
- Two column: FAQ left, Contact right

**Mobile:**
- Accordion FAQ
- Contact form

**Content:**
- FAQ categories (collapsible)
- Contact form (name, email, issue type, message)
- Live chat button
- Phone number (click-to-call on mobile)
- Email link

---

## Mobile-Specific Features

### Bottom Navigation Bar
```
[Home] [Cart] [Menu] [Profile]
```
- Always visible
- Profile icon shows avatar thumbnail when logged in
- Cart shows item count badge

### Swipe Gestures
- Swipe left on orders: Quick actions (Track, Cancel)
- Swipe left on addresses: Edit/Delete
- Swipe down on sheets: Close

### Touch Optimizations
- 44px minimum touch targets
- Haptic feedback on actions
- Pull-to-refresh on lists
- Infinite scroll (no pagination buttons)

### Mobile Forms
- Full-width inputs
- Large touch areas
- Number pad for phone/zip
- Date picker native
- Auto-focus on next field

---

## Desktop-Specific Features

### Keyboard Shortcuts
- `Esc` - Close modal/go back
- `Ctrl+F` - Search orders
- `Tab` - Navigate menu

### Hover States
- Menu items highlight
- Quick action buttons appear on row hover
- Tooltip explanations

### Layout Features
- Sticky sidebar (follows scroll)
- Breadcrumb navigation
- Larger data tables
- Multi-column forms

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| 1200px+ | Full desktop, 3-column wishlist |
| 992-1199px | Narrower sidebar, 2-column wishlist |
| 768-991px | Tablet: Stacked layout, simplified header |
| < 768px | Mobile: Bottom nav, full-width sections |

---

## Technical Requirements

### Performance
- Lazy load images
- Virtual scrolling for long lists (>50 items)
- Debounced search (300ms)
- Optimistic UI updates

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader announcements for updates
- Color contrast WCAG 2.1 AA

### Security
- CSRF tokens on forms
- Input sanitization
- Secure file upload (avatar)
- Password strength requirements

---

## Files to Create

1. **profile.html** - Main profile page
2. **profile.css** - Profile-specific styles + responsive
3. **profile.js** - Profile functionality
   - Section navigation
   - Form handling
   - API calls
   - Mobile gestures

---

## Implementation Phases

### Phase 1: Basic Structure
- HTML layout (desktop + mobile)
- CSS responsive framework
- Navigation switching

### Phase 2: Core Sections
- Dashboard with stats
- Order history with filters
- Address management

### Phase 3: Advanced Features
- Payment methods
- Wishlist integration
- Settings forms

### Phase 4: Polish
- Animations
- Loading states
- Error handling
- Mobile optimizations

---

## Success Metrics

- Load time < 2s on 3G
- 60fps animations
- Lighthouse score > 90
- Mobile usability score > 95
