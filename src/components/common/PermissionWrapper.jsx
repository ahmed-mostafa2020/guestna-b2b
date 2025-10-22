import { usePermissions } from "@hooks/usePermissions";

/**
 * Wrapper component to conditionally render children based on action permissions
 * @param {Object} props
 * @param {string|string[]} props.action - Single action or array of actions required
 * @param {boolean} props.requireAll - If true, requires all actions; if false, requires any action (default: false)
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {React.ReactNode} props.fallback - Content to render if permission is denied (optional)
 */
export const CanPerformAction = ({
  action,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasAction, hasAnyAction, hasAllActions } = usePermissions();

  let hasPermission = false;

  if (Array.isArray(action)) {
    hasPermission = requireAll
      ? hasAllActions(action)
      : hasAnyAction(action);
  } else {
    hasPermission = hasAction(action);
  }

  return hasPermission ? children : fallback;
};

/**
 * Wrapper component to conditionally render children based on menu item permissions
 * @param {Object} props
 * @param {string|string[]} props.menuItem - Single menu item or array of menu items required
 * @param {boolean} props.requireAll - If true, requires all menu items; if false, requires any (default: false)
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {React.ReactNode} props.fallback - Content to render if permission is denied (optional)
 */
export const CanAccessMenuItem = ({
  menuItem,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasMenuItem, hasAnyMenuItem } = usePermissions();

  let hasPermission = false;

  if (Array.isArray(menuItem)) {
    hasPermission = requireAll
      ? menuItem.every((item) => hasMenuItem(item))
      : hasAnyMenuItem(menuItem);
  } else {
    hasPermission = hasMenuItem(menuItem);
  }

  return hasPermission ? children : fallback;
};

/**
 * Higher-order component to wrap any component with action permission check
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} action - Action permission(s) required
 * @param {boolean} requireAll - If true, requires all actions
 */
export const withActionPermission = (Component, action, requireAll = false) => {
  return (props) => (
    <CanPerformAction action={action} requireAll={requireAll}>
      <Component {...props} />
    </CanPerformAction>
  );
};

/**
 * Higher-order component to wrap any component with menu item permission check
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} menuItem - Menu item permission(s) required
 * @param {boolean} requireAll - If true, requires all menu items
 */
export const withMenuPermission = (Component, menuItem, requireAll = false) => {
  return (props) => (
    <CanAccessMenuItem menuItem={menuItem} requireAll={requireAll}>
      <Component {...props} />
    </CanAccessMenuItem>
  );
};
