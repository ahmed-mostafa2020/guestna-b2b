import { usePermissions } from "@hooks/utils/usePermissions";

/**
 * Wrapper component to conditionally render children based on action permissions
 * @param {Object} props
 * @param {string|string[]} props.element - Single element or array of elements required
 * @param {boolean} props.requireAll - If true, requires all elements; if false, requires any element (default: false)
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {React.ReactNode} props.fallback - Content to render if permission is denied (optional)
 */
export const CanPerformElement = ({
  element,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasElement, hasAnyElement, hasAllElements } = usePermissions();

  let hasPermission = false;

  if (Array.isArray(element)) {
    hasPermission = requireAll
      ? hasAllElements(element)
      : hasAnyElement(element);
  } else {
    hasPermission = hasElement(element);
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
 * Higher-order component to wrap any component with element permission check
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} element - Element permission(s) required
 * @param {boolean} requireAll - If true, requires all elements
 */
export const withElementPermission = (
  Component,
  element,
  requireAll = false
) => {
  return (props) => (
    <CanPerformElement element={element} requireAll={requireAll}>
      <Component {...props} />
    </CanPerformElement>
  );
};

/**
 * Higher-order component to wrap any component with menu item permission check
 * @param {React.Component} Component - Component to wrap
 * @param {string|string[]} menuItem - Menu item permission(s) required
 * @param {boolean} requireAll - If true, requires all menu items
 */
export const withMenuItemPermission = (
  Component,
  menuItem,
  requireAll = false
) => {
  return (props) => (
    <CanAccessMenuItem menuItem={menuItem} requireAll={requireAll}>
      <Component {...props} />
    </CanAccessMenuItem>
  );
};
