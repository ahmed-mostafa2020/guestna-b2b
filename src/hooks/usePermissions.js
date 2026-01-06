import { useSelector } from "react-redux";

/**
 * Custom hook to check user permissions
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
  const elements = useSelector((state) => state.permissions?.elements || []);
  const menuItems = useSelector((state) => state.permissions?.menuItems || []);
  const pages = useSelector((state) => state.permissions?.pages || []);

  /**
   * Check if user has a specific action permission
   * @param {string} action - Action permission to check (e.g., "create_trip")
   * @returns {boolean}
   */
  const hasElement = (element) => {
    return elements.includes(element);
  };

  /**
   * Check if user has any of the specified action permissions
   * @param {string[]} actionList - Array of action permissions
   * @returns {boolean}
   */
  const hasAnyElement = (elementList) => {
    return elementList.some((element) => elements.includes(element));
  };

  /**
   * Check if user has all specified action permissions
   * @param {string[]} actionList - Array of action permissions
   * @returns {boolean}
   */
  const hasAllElements = (elementList) => {
    return elementList.every((element) => elements.includes(element));
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

  /**
   * Check if user has access to a specific page
   * @param {string} page - Page permission to check (e.g., "b2b_profile_main_page")
   * @returns {boolean}
   */
  const hasPage = (page) => {
    return pages.includes(page);
  };

  /**
   * Check if user has access to any of the specified pages
   * @param {string[]} pageList - Array of page permissions
   * @returns {boolean}
   */
  const hasAnyPage = (pageList) => {
    return pageList.some((page) => pages.includes(page));
  };

  /**
   * Get GTM (Google Tag Manager) data attributes for an element
   * Use by spreading the returned object onto an interactive element
   * @param {string} permissionName - Permission name to use as GTM tag (e.g., "b2b_profile_users_add_user")
   * @param {string} category - Optional category for grouping (defaults to extracting from permission name)
   * @returns {Object} Object with data-gtm and data-gtm-category attributes
   * @example
   * <button {...getGtmProps(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_ADD_USER)}>Add User</button>
   */
  const getGtmProps = (permissionName, category = null) => {
    if (!permissionName) return {};

    // Extract category from permission name if not provided
    // e.g., "b2b_profile_users_add_user" -> "users"
    const extractedCategory =
      category || permissionName.split("_").slice(2, 3).join("_") || "general";

    return {
      "data-gtm": permissionName,
      "data-gtm-category": extractedCategory,
    };
  };

  /**
   * Get GTM props only if user has the element permission
   * Combines permission check with GTM tracking
   * @param {string} element - Element permission to check
   * @returns {Object|null} GTM props if has permission, null otherwise
   */
  const getGtmPropsIfAllowed = (element) => {
    if (!hasElement(element)) return null;
    return getGtmProps(element);
  };

  return {
    hasElement,
    hasAnyElement,
    hasAllElements,
    hasMenuItem,
    hasAnyMenuItem,
    hasPage,
    hasAnyPage,
    // GTM tracking utilities
    getGtmProps,
    getGtmPropsIfAllowed,
    // Raw permission arrays
    elements,
    menuItems,
    pages,
  };
};
