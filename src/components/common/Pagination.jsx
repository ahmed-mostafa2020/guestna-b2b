import { memo } from "react";
import { useTranslations } from "next-intl";

const Pagination = ({ 
  pageInfo, 
  currentPage = 1, 
  onPageChange,
  className = ""
}) => {
  const t = useTranslations();

  // Handle different API response formats
  const totalPages = pageInfo?.totalPages || Math.ceil((pageInfo?.total || 0) / (pageInfo?.perPage || 10));
  const currentPageFromApi = pageInfo?.currentPage || pageInfo?.page || 1;
  
  if (!pageInfo || !totalPages || totalPages <= 1) {
    return null;
  }

  const { currentPage: apiCurrentPage } = pageInfo;
  const activePage = currentPage || apiCurrentPage || currentPageFromApi;
  
  // Calculate navigation states based on current page and total pages
  const hasPreviousPage = activePage > 1;
  const hasNextPage = activePage < totalPages;

  const handlePageClick = (page) => {
    if (page !== activePage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-2 text-sm font-medium border rounded-md ${
            i === activePage
              ? "text-white bg-mainColor border-mainColor"
              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}>
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => handlePageClick(activePage - 1)}
          disabled={!hasPreviousPage}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("pagination.previous")}
        </button>
        <button
          onClick={() => handlePageClick(activePage + 1)}
          disabled={!hasNextPage}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("pagination.next")}
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {t("pagination.showing")} <span className="font-medium">{((activePage - 1) * 10) + 1}</span> {t("pagination.to")}{" "}
            <span className="font-medium">{Math.min(activePage * 10, pageInfo.totalCount || 0)}</span> {t("pagination.of")}{" "}
            <span className="font-medium">{pageInfo.totalCount || 0}</span> {t("pagination.results")}
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex -space-x-px rounded-md" aria-label="Pagination">
            <button
              onClick={() => handlePageClick(activePage - 1)}
              disabled={!hasPreviousPage}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t("pagination.previous")}</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2 px-2">
            {renderPageNumbers()}
            </div>
            
            <button
              onClick={() => handlePageClick(activePage + 1)}
              disabled={!hasNextPage}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">{t("pagination.next")}</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default memo(Pagination);
