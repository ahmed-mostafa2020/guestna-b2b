---
name: permissions
description: Use when adding a new profile page, tab, menu item, button, card, table action, or any feature that only some user roles should see — or when debugging "user can't see X" / "user sees X they shouldn't" / redirect loops in /profile or /provider-profile.
---

# Permissions (role-based access) in Guestna B2B

Permissions come from the profile API (`data.permissions`) → `setPermissions` → Redux `permissions` slice (persisted) with three lists: `pages`, `menuItems`, `elements`, plus `isLoaded`.
User types: `src/constants/users.js` (`VISITOR`, `B2B_PARENT`, `B2B_ADMINISTRATION`, `B2B_STAFF_*`, `PROVIDERS`).

## Pieces

- Keys: `src/constants/permissions.js` → `PERMISSIONS.PAGE.*`, `PERMISSIONS.MENU_ITEM.*`, `PERMISSIONS.ELEMENT.*`. **The string values must match the backend exactly** (typos like `profiel`, `calender` come from the backend, so don't "fix" them).
- Hook: `usePermissions()` from `@hooks/utils/usePermissions` → `hasPage`, `hasAnyPage`, `hasMenuItem`, `hasAnyMenuItem`, `hasElement`, `hasAnyElement`, `hasAllElements`, `pages`, `isLoaded`.
- Page guard: `@components/ui/ProtectedProfilePage` (`requiredPermission`, optional `redirectTo`). It shows the login modal for visitors and redirects to the first accessible page when access is denied.
- Element guards: `CanPerformElement`, `CanAccessMenuItem`, `withElementPermission`, `withMenuItemPermission` from `@components/ui/PermissionWrapper`.
- Nav: `features/profile/NavigationDropdownWithPermissions.jsx`. First-allowed-page map: `@utils/helpers/getFirstAccessiblePage`.

## Which level?

| Thing                              | Check                                                               |
| ---------------------------------- | ------------------------------------------------------------------- |
| Whole profile page/route           | `ProtectedProfilePage requiredPermission={PERMISSIONS.PAGE.X}`      |
| Sidebar/menu tab                   | menu config `permission` + `hasMenuItem`                            |
| Button, card, table, action, chart | `CanPerformElement element={PERMISSIONS.ELEMENT.X}` or `hasElement` |
| Data fetch for that element        | `enabled: hasElement(PERMISSIONS.ELEMENT.X)` in `useFetchData`      |

## Adding a gated feature

1. Get the exact permission key(s) from the backend/task. If none was given, **ask**. Never invent a key; the feature would be hidden for everyone.
2. Add it to `PERMISSIONS` in the right group, following the existing naming.
3. Gate the UI at the right level (table above). Gate the **fetch** too, so unauthorized users don't fire 403 requests.
4. New page → wrap it in `ProtectedProfilePage`, and add its route to `getFirstAccessiblePage` so redirects can land there.
5. New menu tab → add it to the nav config with its `MENU_ITEM` permission.
6. Hidden vs disabled: hide by default. Show a disabled state with a tooltip only if the design asks for it.

## Rules

- Permissions are UX, not security. The backend must also reject. Never rely on hiding alone for destructive actions.
- Don't check user type (`userType === USERS.X`) when a permission key exists for the feature. Use type checks only for flows that truly differ (visitor vs logged-in, provider vs school).
- Wait for `isLoaded` before redirecting or showing "no access". Otherwise users get bounced during load.
- Permissions are persisted. After a role change the user may need to re-login, so don't "fix" that with extra fetching.

## Debug "can't see X"

1. Redux DevTools → `permissions.elements/pages/menuItems`: is the key there?
2. Compare it to the constant's string value (typos / case).
3. Check `enabled` on the query, and `isLoaded`.
4. Check whether the parent (page/tab) is gated with a different key.

## Checklist

- [ ] Key from the backend, added to `PERMISSIONS`
- [ ] Gated at page / menu / element level as appropriate
- [ ] Fetch gated with `enabled`
- [ ] New page wrapped + added to `getFirstAccessiblePage`
- [ ] Tested with an allowed and a denied role
