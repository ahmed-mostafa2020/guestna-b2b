# Permissions System Usage Guide

This guide explains how to use the permissions system in your application.

## Table of Contents
1. [Setup](#setup)
2. [Setting Permissions After Login](#setting-permissions-after-login)
3. [Using Permission Hooks](#using-permission-hooks)
4. [Using Permission Wrapper Components](#using-permission-wrapper-components)
5. [Navigation Menu with Permissions](#navigation-menu-with-permissions)
6. [Button/Action Permissions](#button-action-permissions)
7. [Best Practices](#best-practices)

---

## Setup

The permissions system is already configured in Redux store. You have access to:
- `actions`: Array of action permissions (e.g., "create_trip", "edit_trip")
- `menuItems`: Array of menu item permissions (e.g., "b2b-menu-profile-home")

---

## Setting Permissions After Login

After successful login, dispatch the permissions to Redux store:

```javascript
import { useDispatch } from "react-redux";
import { setPermissions } from "@store/permissions/permissionsSlice";

// In your login handler or auth component
const handleLoginSuccess = (userData) => {
  // userData.permissions = {
  //   ACTION: ["create_trip", "view_trips", "edit_trip"],
  //   MENU_ITEM: ["b2b-menu-profile-home", "b2b-profile-activities-market", ...]
  // }
  
  dispatch(setPermissions(userData.permissions));
};
```

To clear permissions on logout:

```javascript
import { clearPermissions } from "@store/permissions/permissionsSlice";

const handleLogout = () => {
  dispatch(clearPermissions());
};
```

---

## Using Permission Hooks

### Basic Usage

```javascript
import { usePermissions } from "@hooks/usePermissions";

const MyComponent = () => {
  const { hasAction, hasMenuItem, hasAnyAction } = usePermissions();

  // Check single action
  const canCreateTrip = hasAction("create_trip");
  
  // Check single menu item
  const canAccessHome = hasMenuItem("b2b-menu-profile-home");
  
  // Check multiple actions (any)
  const canModifyTrips = hasAnyAction(["create_trip", "edit_trip"]);

  return (
    <div>
      {canCreateTrip && (
        <button>Create Trip</button>
      )}
    </div>
  );
};
```

### Available Hook Methods

- `hasAction(action)`: Check if user has a specific action permission
- `hasAnyAction([actions])`: Check if user has any of the specified actions
- `hasAllActions([actions])`: Check if user has all specified actions
- `hasMenuItem(menuItem)`: Check if user can access a menu item
- `hasAnyMenuItem([menuItems])`: Check if user can access any of the menu items

---

## Using Permission Wrapper Components

### CanPerformAction Component

Wrap buttons or elements that require action permissions:

```javascript
import { CanPerformAction } from "@components/common/PermissionWrapper";

// Single action
<CanPerformAction action="create_trip">
  <button onClick={handleCreateTrip}>
    Create New Trip
  </button>
</CanPerformAction>

// Multiple actions (any one)
<CanPerformAction action={["create_trip", "edit_trip"]}>
  <button>Manage Trips</button>
</CanPerformAction>

// Multiple actions (all required)
<CanPerformAction action={["view_trips", "edit_trip"]} requireAll={true}>
  <button>Edit Trip</button>
</CanPerformAction>

// With fallback content
<CanPerformAction 
  action="delete_trip"
  fallback={<p className="text-gray-400">No permission to delete</p>}
>
  <button className="text-red-600">Delete Trip</button>
</CanPerformAction>
```

### CanAccessMenuItem Component

Wrap menu items or sections:

```javascript
import { CanAccessMenuItem } from "@components/common/PermissionWrapper";

<CanAccessMenuItem menuItem="b2b-menu-profile-home">
  <Link href="/profile">Home</Link>
</CanAccessMenuItem>

// Multiple menu items
<CanAccessMenuItem menuItem={["b2b-menu-item-profile-bookings", "b2b-menu-profile-order-management"]}>
  <div>Bookings Section</div>
</CanAccessMenuItem>
```

---

## Navigation Menu with Permissions

The NavigationDropdown component automatically filters menu items based on permissions:

```javascript
// Each navigation item has a permission key
const navigationItem = {
  id: "home",
  title: "Home",
  icon: <HomeIcon />,
  path: "/profile",
  permission: "b2b-menu-profile-home", // This permission is checked
};

// Sub-items also have permissions
const navigationItemWithDropdown = {
  id: "bookings",
  title: "Bookings Management",
  icon: <BookingIcon />,
  hasDropdown: true,
  permission: "b2b-menu-profile-order-management",
  subItems: [
    {
      title: "Orders",
      path: "/profile/bookings-management/orders",
      permission: "b2b-menu-profile-order-management",
    },
    {
      title: "Bookings",
      path: "/profile/bookings-management/bookings",
      permission: "b2b-menu-item-profile-bookings",
    },
  ],
};
```

The component will:
1. Filter out parent items if user doesn't have permission
2. Filter out sub-items if user doesn't have permission
3. Hide parent dropdown if all sub-items are filtered out

---

## Button/Action Permissions

### Example: Create Trip Button

```javascript
import { CanPerformAction } from "@components/common/PermissionWrapper";

const TripsPage = () => {
  return (
    <div>
      <h1>Trips Management</h1>
      
      {/* Only show if user has create_trip permission */}
      <CanPerformAction action="create_trip">
        <button 
          onClick={handleCreateTrip}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Trip
        </button>
      </CanPerformAction>
      
      {/* Trip list */}
      <div className="trips-list">
        {trips.map(trip => (
          <TripCard 
            key={trip.id} 
            trip={trip}
            canEdit={hasAction("edit_trip")}
            canDelete={hasAction("delete_trip")}
          />
        ))}
      </div>
    </div>
  );
};
```

### Example: Conditional Actions in Table

```javascript
import { usePermissions } from "@hooks/usePermissions";

const TripsTable = ({ trips }) => {
  const { hasAction } = usePermissions();
  
  const canEdit = hasAction("edit_trip");
  const canDelete = hasAction("delete_trip");
  const canView = hasAction("view_trips");

  return (
    <table>
      <thead>
        <tr>
          <th>Trip Name</th>
          <th>Date</th>
          {(canEdit || canDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {trips.map(trip => (
          <tr key={trip.id}>
            <td>{trip.name}</td>
            <td>{trip.date}</td>
            {(canEdit || canDelete) && (
              <td>
                {canEdit && (
                  <button onClick={() => handleEdit(trip.id)}>
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button onClick={() => handleDelete(trip.id)}>
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Example: Form with Action Permissions

```javascript
import { CanPerformAction } from "@components/common/PermissionWrapper";

const TripForm = ({ trip, isEdit }) => {
  return (
    <form>
      {/* Form fields */}
      <input type="text" name="tripName" />
      <input type="date" name="tripDate" />
      
      {/* Submit button with permission check */}
      <CanPerformAction 
        action={isEdit ? "edit_trip" : "create_trip"}
        fallback={
          <p className="text-red-600">
            You don't have permission to {isEdit ? "edit" : "create"} trips
          </p>
        }
      >
        <button type="submit">
          {isEdit ? "Update Trip" : "Create Trip"}
        </button>
      </CanPerformAction>
    </form>
  );
};
```

---

## Best Practices

### 1. **Always Check Permissions on Backend**
Frontend permissions are for UX only. Always validate permissions on the backend.

### 2. **Use Descriptive Permission Keys**
```javascript
// Good
"create_trip"
"b2b-menu-profile-home"

// Bad
"permission1"
"menu_item_1"
```

### 3. **Group Related Permissions**
```javascript
// Trip management permissions
const tripPermissions = ["create_trip", "edit_trip", "delete_trip", "view_trips"];

// Check if user can manage trips
const canManageTrips = hasAnyAction(tripPermissions);
```

### 4. **Handle Loading States**
```javascript
const { hasAction, actions } = usePermissions();

// Wait for permissions to load
if (actions.length === 0) {
  return <Spinner />;
}

return (
  <div>
    {hasAction("create_trip") && <CreateButton />}
  </div>
);
```

### 5. **Use Fallback Content for Better UX**
```javascript
<CanPerformAction 
  action="create_trip"
  fallback={
    <Tooltip title="Contact admin for permission">
      <button disabled className="opacity-50">
        Create Trip
      </button>
    </Tooltip>
  }
>
  <button onClick={handleCreate}>Create Trip</button>
</CanPerformAction>
```

### 6. **Memoize Filtered Lists**
```javascript
const filteredMenuItems = useMemo(() => {
  return menuItems.filter(item => hasMenuItem(item.permission));
}, [hasMenuItem, menuItems]);
```

### 7. **Clear Permissions on Logout**
```javascript
const handleLogout = () => {
  dispatch(clearPermissions());
  dispatch(clearUserData());
  // Redirect to login
};
```

---

## Permission Keys Reference

### Action Permissions
- `create_trip`: Create new trips
- `edit_trip`: Edit existing trips
- `delete_trip`: Delete trips
- `view_trips`: View trips list

### Menu Item Permissions
- `b2b-menu-profile-home`: Access to profile home
- `b2b-profile-activities-market`: Access to activities market
- `b2b-profile-trip&activities-management`: Access to trips management
- `b2b-menu-profile-order-management`: Access to order management
- `b2b-menu-item-profile-bookings`: Access to bookings
- `b2b-profile-menu-item-users`: Access to user management
- `b2b-profile-menu-item-transaction-log`: Access to transaction log
- `b2b-profile-menu-item-withdraw`: Access to withdraw
- `b2b-profile-menu-item-calender`: Access to calendar
- `b2b-profile-menu-item-integrate-booking-management`: Access to integrated bookings

---

## Troubleshooting

### Permissions Not Working
1. Check if permissions are set after login
2. Verify permission keys match exactly (case-sensitive)
3. Check Redux DevTools to see current permission state
4. Ensure permissions slice is included in store

### Menu Items Not Showing
1. Verify menu item permission keys match backend
2. Check if parent permissions are set correctly
3. Ensure useMemo dependencies are correct

### Performance Issues
1. Use useMemo for filtered lists
2. Avoid checking permissions in render loops
3. Cache permission results when possible

---

## Support

For questions or issues with the permissions system, contact the development team or refer to the Redux store documentation.
