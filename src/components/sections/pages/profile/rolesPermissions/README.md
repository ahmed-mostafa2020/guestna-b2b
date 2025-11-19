# Roles & Permissions Management

## Overview

This module manages role-based permissions for the B2B application. It allows administrators to create roles, assign permissions to roles, and manage user access control.

## Architecture

### Components Structure

```
rolesPermissions/
├── index.jsx                    # Main container component
├── PermissionsSection.jsx       # Individual permission section UI
├── RoleCard.jsx                 # Role selection card
└── README.md                    # This file
```

## Core Concepts

### 1. Permission Types

- **Regular Permissions**: Can be toggled on/off by users
- **Default Checked Permissions**: Auto-activated when any regular permission is enabled
  - These are read-only and cannot be directly toggled
  - They represent base/required permissions for a feature

### 2. Permission Hierarchy

```
Page (e.g., "Access Profile Page")
├── Element 1 (defaultChecked: true) - Auto-activated
├── Element 2 (defaultChecked: false) - User toggleable
└── Element 3 (defaultChecked: false) - User toggleable
```

### 3. State Management Flow

```
API Response → Convert to State → User Edits → Collect Changes → Save to API
```

## Key Functions

### RolesPermissionsContent (index.jsx)

#### Helper Functions (Outside Component)

| Function                                                            | Purpose                            | Returns |
| ------------------------------------------------------------------- | ---------------------------------- | ------- |
| `initializePermissions(pages)`                                      | Creates initial permissions state  | Object  |
| `convertApiResponseToPermissions(ids, pages)`                       | Converts API array to state object | Object  |
| `collectCheckedPermissionIds(permissions, pages)`                   | Extracts checked IDs for API       | Array   |
| `getToggleableChildren(page)`                                       | Filters out defaultChecked items   | Array   |
| `areAllToggleableEnabled(page, permissions, pageId)`                | Checks if all toggleable enabled   | Boolean |
| `isAnyToggleableChecked(page, permissions, pageId)`                 | Checks if any toggleable checked   | Boolean |
| `updateDefaultCheckedItems(page, permissions, pageId, shouldCheck)` | Updates defaultChecked items       | Void    |

#### Component Methods

| Method                                       | Purpose                             | Type  |
| -------------------------------------------- | ----------------------------------- | ----- |
| `fetchRolePermissions(roleId)`               | Fetches permissions from API        | Async |
| `savePermissions(roleId, permissionIds)`     | Saves permissions to API            | Async |
| `handleRoleChange(roleId)`                   | Handles role selection              | Sync  |
| `handleRoleDeleted(deletedRoleId)`           | Handles role deletion & auto-select | Sync  |
| `handleReset()`                              | Resets to last saved state          | Async |
| `handleSave()`                               | Saves current changes               | Async |
| `togglePagePermissions(pageId)`              | Toggles all page permissions        | Sync  |
| `toggleElementPermission(pageId, elementId)` | Toggles single permission           | Sync  |
| `getEnabledCount(pageId)`                    | Counts enabled permissions          | Sync  |

### PermissionsSection (PermissionsSection.jsx)

#### Helper Functions

| Function                                                  | Purpose                   | Returns |
| --------------------------------------------------------- | ------------------------- | ------- |
| `getToggleableChildren(children)`                         | Filters toggleable items  | Array   |
| `calculateCheckboxState(toggleableChildren, permissions)` | Calculates checkbox state | Object  |

#### Component Features

- **useMemo**: Optimizes checkbox state calculations
- **useCallback**: Memoizes event handlers
- **Accessibility**: Includes aria-labels for screen readers
- **Visual Feedback**: Different styles for disabled items

## Permission Logic

### Page-Level Checkbox Behavior

```javascript
// Only considers toggleable children
const toggleableChildren = getToggleableChildren(page);

// States:
// ✅ Checked: All toggleable children are checked
// ➖ Indeterminate: Some toggleable children are checked
// ☐ Unchecked: No toggleable children are checked
```

### Element-Level Toggle Logic

```javascript
// When a toggleable element is toggled:
1. Toggle the element state
2. Check if ANY toggleable element is now checked
3. If yes → Enable all defaultChecked items
4. If no → Disable all defaultChecked items
```

### Auto-Activation Rules

```javascript
defaultChecked: true items are activated when:
- ANY toggleable child in the same page is checked
- Page-level checkbox is checked
- Reset/Fetch from API shows them as active
```

## API Integration

### Endpoints

```javascript
// Fetch all roles
GET /profile/roles

// Fetch all available permissions
GET /profile/permissions

// Fetch permissions for specific role
GET /profile/roles/{roleId}/permissions

// Update role permissions
PATCH /profile/roles/{roleId}/permissions
Body: { permissions: [permissionId1, permissionId2, ...] }

// Delete role
DELETE /profile/roles/{roleId}
```

### Data Flow

```
1. Load roles and permissions on mount
2. Auto-select first role
3. Fetch permissions for selected role
4. User makes changes (local state only)
5. User clicks Save → Send to API
6. User clicks Reset → Re-fetch from API
```

## State Management

### State Structure

```javascript
{
  roles: [{ _id, description, userCount, roleType }],
  selectedRole: "roleId",
  permissions: {
    "pageId1": {
      "elementId1": true,
      "elementId2": false,
      "elementId3": true
    },
    "pageId2": { ... }
  },
  loadingRolePermissions: false
}
```

## Performance Optimizations

### 1. useCallback

All event handlers are memoized to prevent unnecessary re-renders:

- `handleRoleChange`
- `handleRoleDeleted`
- `handleReset`
- `handleSave`
- `togglePagePermissions`
- `toggleElementPermission`
- `getEnabledCount`

### 2. useMemo

Expensive calculations are memoized:

- Checkbox state calculations in PermissionsSection

### 3. flushSync

Used for role deletion to ensure synchronous state updates:

```javascript
flushSync(() => setRoles(updatedRoles));
flushSync(() => setSelectedRole(updatedRoles[0]._id));
```

## Error Handling

### API Errors

- All API calls wrapped in try-catch
- User-friendly error messages via snackbar
- Console logging for debugging

### Edge Cases

- No roles available → Show empty state
- No permissions available → Disable save
- Role deleted → Auto-select first remaining role
- Last role deleted → Clear selection

## Accessibility Features

### ARIA Labels

- Expand/collapse buttons have aria-labels
- Checkboxes have aria-labels with element titles
- Proper focus management

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows visual order
- Enter/Space to toggle checkboxes

## Styling Conventions

### CSS Variables

All colors use CSS custom properties:

```css
var(--color-main)
var(--color-text-dark)
var(--color-text-light)
var(--color-border)
```

### Responsive Design

- Mobile: Dropdown for role selection
- Desktop: Card-based role selection
- Consistent spacing using Tailwind utilities

## Testing Considerations

### Unit Tests Should Cover

- [ ] Permission initialization logic
- [ ] API response conversion
- [ ] Toggle logic for pages and elements
- [ ] defaultChecked item activation
- [ ] Role deletion and auto-selection

### Integration Tests Should Cover

- [ ] Full permission management flow
- [ ] API error handling
- [ ] Role switching
- [ ] Save and reset functionality

## Common Issues & Solutions

### Issue: defaultChecked items not activating

**Solution**: Check that `isAnyToggleableChecked` is being called after state update

### Issue: Page checkbox not showing indeterminate state

**Solution**: Ensure only toggleable children are considered in checkbox state calculation

### Issue: Role not auto-selecting after deletion

**Solution**: Verify `flushSync` is being used for synchronous state updates

### Issue: Permissions not saving

**Solution**: Check that `collectCheckedPermissionIds` is correctly extracting IDs

## Future Enhancements

### Potential Improvements

1. **Bulk Operations**: Select multiple roles for batch updates
2. **Permission Search**: Filter permissions by name/description
3. **Permission Groups**: Organize permissions into collapsible groups
4. **Audit Log**: Track permission changes over time
5. **Permission Templates**: Pre-defined permission sets for common roles
6. **Drag & Drop**: Reorder permissions for better organization

### Performance Improvements

1. **Virtualization**: For large permission lists
2. **Debounced Search**: If search is implemented
3. **Lazy Loading**: Load permissions on-demand
4. **Caching**: Cache permission data in localStorage

## Code Style Guidelines

### Naming Conventions

- **Components**: PascalCase (e.g., `PermissionsSection`)
- **Functions**: camelCase (e.g., `handleRoleChange`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CHECKBOX_STYLES`)
- **Helper Functions**: camelCase with descriptive names

### File Organization

```javascript
// 1. Imports (grouped by type)
// 2. Constants
// 3. Helper Functions (outside component)
// 4. Component Definition
//    - State Management
//    - Effects
//    - API Functions
//    - Event Handlers
//    - Render
// 5. Export
```

### Comments

- Use JSDoc for function documentation
- Section separators for major code blocks
- Inline comments for complex logic only

## Maintenance Checklist

### When Adding New Permissions

- [ ] Update API endpoint if needed
- [ ] Verify defaultChecked logic still works
- [ ] Test with existing roles
- [ ] Update translations if needed

### When Modifying Logic

- [ ] Update this README
- [ ] Test all permission types
- [ ] Verify auto-activation still works
- [ ] Check mobile responsiveness

### When Fixing Bugs

- [ ] Add console logging for debugging
- [ ] Test edge cases
- [ ] Update error handling if needed
- [ ] Document the fix in commit message

## Related Files

### Dependencies

- `@hooks/useFetchData`: Data fetching hook
- `@utils/getHeaders`: API headers utility
- `@utils/getProxyUrl`: Proxy URL utility
- `@constants/b2bAPIs`: API endpoint constants

### Parent Components

- `src/app/[locale]/profile/roles-permissions/page.jsx`: Page wrapper

### Child Components

- `RoleCard.jsx`: Role selection card
- `PermissionsSection.jsx`: Permission section UI

## Contact & Support

For questions or issues related to this module:

1. Check this README first
2. Review the code comments
3. Check the commit history for context
4. Contact the development team

---

**Last Updated**: 2025-01-19
**Maintained By**: Development Team
