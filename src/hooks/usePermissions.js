import { useSelector } from "react-redux";

/**
 * Custom hook to check user permissions
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
  const actions = useSelector((state) => state.permissions?.actions || []);
  const menuItems = useSelector((state) => state.permissions?.menuItems || []);

  /**
   * Check if user has a specific action permission
   * @param {string} action - Action permission to check (e.g., "create_trip")
   * @returns {boolean}
   */
  const hasAction = (action) => {
    return actions.includes(action);
  };

  /**
   * Check if user has any of the specified action permissions
   * @param {string[]} actionList - Array of action permissions
   * @returns {boolean}
   */
  const hasAnyAction = (actionList) => {
    return actionList.some((action) => actions.includes(action));
  };

  /**
   * Check if user has all specified action permissions
   * @param {string[]} actionList - Array of action permissions
   * @returns {boolean}
   */
  const hasAllActions = (actionList) => {
    return actionList.every((action) => actions.includes(action));
  };

  /**
   * Check if user has access to a specific menu item
   * @param {string} menuItem - Menu item permission to check (e.g., "b2b-menu-profile-home")
   * @returns {boolean}
   */
  const hasMenuItem = (menuItem) => {
    return menuItems.includes(menuItem);
  };

  /**
   * Check if user has access to any of the specified menu items
   * @param {string[]} menuItemList - Array of menu item permissions
   * @returns {boolean}
   */
  const hasAnyMenuItem = (menuItemList) => {
    return menuItemList.some((item) => menuItems.includes(item));
  };

  return {
    hasAction,
    hasAnyAction,
    hasAllActions,
    hasMenuItem,
    hasAnyMenuItem,
    actions,
    menuItems,
  };
};
