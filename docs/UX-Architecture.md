# CampusSpace - Frontend UX Architecture & Flow

## 🎯 User Flow Diagram

```
┌─────────────────┐
│  Landing Page   │ (index.html)
│   Login/Auth    │
└────────┬────────┘
         │
         │ Login Success
         ▼
┌─────────────────┐
│   Dashboard     │ (dashboard.html)
│  Main Hub Page  │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┬──────────────┐
    │         │              │              │
    ▼         ▼              ▼              ▼
┌──────┐  ┌──────┐      ┌──────┐      ┌──────┐
│Rooms │  │Outlets│      │Profile│     │Settings│
└──────┘  └──────┘      └──────┘      └──────┘
    │         │              │              │
    │         └──────┬───────┘              │
    │                │                      │
    ▼                ▼                      ▼
┌──────────┐  ┌──────────┐         ┌──────────┐
│Room      │  │Report    │         │Help &    │
│Details   │  │Outlet    │         │Support   │
└──────────┘  └──────────┘         └──────────┘
```

## 📄 Page Structure

### 1. **index.html** - Login/Landing Page
- **Purpose**: Authentication gateway
- **Components**:
  - Hero section with branding
  - Login form (NJIT ID + Password)
  - Features showcase
  - Help/Support modal
- **User Actions**:
  - Login
  - View features
  - Contact support
- **Navigation**: → Dashboard

### 2. **dashboard.html** - Main Dashboard
- **Purpose**: Central hub for all features
- **Components**:
  - Navigation bar
  - Quick action buttons
  - Interactive map
  - Filter controls
  - Building selector
- **User Actions**:
  - Find classrooms
  - Find outlets
  - View map
  - Apply filters
  - Access profile
- **Navigation**: → Room Details, Outlet Finder, Profile, Settings

### 3. **room-details.html** - Individual Room Page
- **Purpose**: Detailed room information
- **Components**:
  - Room name & number
  - Current availability status
  - Schedule for the day
  - Capacity information
  - Photos/layout
  - Report issue button
- **User Actions**:
  - View full schedule
  - Report problems
  - Add to favorites
  - Get directions
- **Navigation**: ← Back to Dashboard

### 4. **outlets.html** - Outlet Finder
- **Purpose**: Find available power outlets
- **Components**:
  - Building selector
  - Floor plan view
  - Outlet status (Available/In Use/Broken)
  - Filter by location
  - Report outlet status
- **User Actions**:
  - Search outlets
  - Report status
  - View outlet history
- **Navigation**: ← Back to Dashboard

### 5. **profile.html** - User Profile
- **Purpose**: User account management
- **Components**:
  - User information
  - Favorite locations
  - Usage statistics
  - Preferences
  - Notification settings
- **User Actions**:
  - Edit profile
  - Manage favorites
  - Update preferences
- **Navigation**: ← Back to Dashboard

### 6. **settings.html** - Settings Page
- **Purpose**: App configuration
- **Components**:
  - Notification preferences
  - Theme selection (Light/Dark)
  - Language settings
  - Privacy settings
  - About & version info
- **User Actions**:
  - Toggle notifications
  - Change theme
  - Logout
- **Navigation**: ← Back to Dashboard

### 7. **help.html** - Help & Support
- **Purpose**: User assistance
- **Components**:
  - FAQ section
  - Contact form
  - Tutorials
  - Known issues
- **User Actions**:
  - Search FAQ
  - Submit support ticket
  - View tutorials
- **Navigation**: ← Back to Dashboard

## 🎨 Design System

### Color Palette
- **Primary**: #b31b1b (NJIT Red)
- **Secondary**: #ff2c2c (Bright Red)
- **Success**: #4caf50 (Green - Available)
- **Warning**: #ff9800 (Orange)
- **Danger**: #f44336 (Red - Occupied)
- **Info**: #2196F3 (Blue)
- **Light**: #f5f5f5
- **Dark**: #333333

### Typography
- **Font Family**: 'Poppins', sans-serif
- **Headers**: 600-700 weight
- **Body**: 400 weight
- **Small Text**: 300 weight

### Components
1. **Navigation Bar**
   - Sticky top
   - Logo on left
   - Menu items center/right
   - User avatar right
   - Mobile hamburger menu

2. **Cards**
   - Rounded corners (12-16px)
   - Box shadow
   - Hover effects
   - Responsive grid layout

3. **Buttons**
   - Primary (red gradient)
   - Secondary (outlined)
   - Icon buttons
   - Loading states

4. **Forms**
   - Floating labels
   - Inline validation
   - Error messages
   - Success feedback

5. **Modals**
   - Centered overlay
   - Backdrop blur
   - Smooth animations
   - Mobile responsive

## 📱 Mobile Responsive Design

### Breakpoints
- **xs**: < 576px (Mobile)
- **sm**: 576px - 768px (Mobile landscape/Small tablets)
- **md**: 768px - 992px (Tablets)
- **lg**: 992px - 1200px (Desktop)
- **xl**: > 1200px (Large desktop)

### Mobile Optimizations
- Touch-friendly buttons (min 44x44px)
- Collapsible navigation
- Swipe gestures
- Bottom navigation bar
- Reduced animations
- Optimized images

## 🔄 User Interaction Patterns

### Navigation Pattern
- **Primary**: Top navigation bar
- **Secondary**: Breadcrumbs
- **Mobile**: Bottom navigation bar
- **Back**: Browser back + Custom back button

### Data Display Pattern
- **List View**: Default for multiple items
- **Grid View**: Cards for visual data
- **Map View**: Geolocation data
- **Table View**: Detailed schedules

### Filtering Pattern
- **Dropdown**: Single selection
- **Chips/Tags**: Multiple selection
- **Search Bar**: Text search
- **Date Picker**: Time-based filtering

### Feedback Pattern
- **Toast Notifications**: Quick updates
- **Modals**: Important confirmations
- **Inline Messages**: Form validation
- **Progress Indicators**: Loading states

## 🚀 Future Enhancements

### Phase 2
- [ ] Favorites system
- [ ] Push notifications
- [ ] Room booking
- [ ] Study group matching

### Phase 3
- [ ] AR navigation
- [ ] Voice commands
- [ ] Offline mode
- [ ] Progressive Web App (PWA)

### Phase 4
- [ ] IoT sensor integration
- [ ] AI-powered recommendations
- [ ] Social features
- [ ] Analytics dashboard

## 📊 Performance Goals

- **Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Lighthouse Score**: > 90
- **Mobile Speed Index**: < 3 seconds

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Scalable fonts
- Alt text for images

## 🔐 Security Considerations

- HTTPS only
- JWT authentication
- XSS protection
- CSRF tokens
- Input sanitization
- Rate limiting
