// "use client";

// import { useSearchParams } from "next/navigation";

// import { useLocale, useTranslations } from "next-intl";

// import { useDispatch, useSelector } from "react-redux";
// import {
//   setCurrentPage,
//   setSearchTerm,
//   setSortBy,
// } from "@store/discover/discoverSlice";

// import {
//   setDiscoverSideFiltersData,
//   setDiscoverSideFiltersDataError,
//   setDiscoverSideFiltersDataLoading,
// } from "@store/searchFilter/discoverSideFiltersSlice";
// import {
//   addCategory,
//   addCity,
//   addLanguage,
//   resetFilters,
//   setRate,
//   setTripsTypes,
//   switchTripsType,
//   updateActivityDayDate,
//   updateBudgetRange,
//   updateCheckInDate,
//   updateCheckOutDate,
//   updateGuestCount,
// } from "@store/searchFilter/searchFilterSlice";
// import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

// import { useEffect, useMemo, useRef, useState } from "react";

// import { END_POINTS } from "@constants/APIs";

// import { useFetchData } from "@hooks/useFetchData";
// import { SORTING_TYPE } from "@constants/sorting";
// import { agesIdsList } from "@constants/targetAudiencesIds";
// import { CONSTANT_VALUES } from "@constants/constantValues";
// import FullScreenLoading from "@feedback/loading/FullScreenLoading";
// import ErrorComponent from "@feedback/error/ErrorComponent";
// import buildFilter from "@utils/BuildFilter";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";
// import SubHeaderSection from "@components/sections/pages/discover/subHeaderSection";
// import LargeSeparator from "@components/common/separators/LargeSeparator";
// import GridSection from "@components/sections/pages/discover/gridSection";
// import SmallSeparator from "@components/common/separators/SmallSeparator";

// const Discover = () => {
//   const [isFiltersInitialized, setIsFiltersInitialized] = useState(false);

//   const {
//     tripsType,
//     allTripsTypes,
//     cities,
//     guests,
//     activityDayDate,
//     checkOutDate,
//     checkInDate,
//     budgetRange,
//     categories,
//     languages,
//     rate,
//   } = useSelector((state) => state.searchFilter);

//   const locale = useLocale();
//   const t = useTranslations();

//   const initialRequestMade = useRef(false);

//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();

//   // Initialize filters effect
//   useEffect(() => {
//     const initializeFilters = async () => {
//       try {
//         // Trips type
//         if (searchParams.get("tripsType")) {
//           const urlTripsType = searchParams.get("tripsType");
//           dispatch(setTripsTypes(urlTripsType));
//           if (urlTripsType !== tripsType) {
//             dispatch(switchTripsType(urlTripsType));
//           }
//         }

//         // Cities
//         if (searchParams.has("cities")) {
//           const urlCities = searchParams.getAll("cities") || []; // Split the comma-separated string
//           if (urlCities.length > 0) {
//             urlCities.forEach((city) => {
//               if (city === "" || city === null || city === undefined) {
//                 return;
//               } else {
//                 dispatch(addCity(city));
//               }
//             });
//           }
//         }

//         // Check-in date
//         if (searchParams.get("checkInDate")) {
//           const checkInDate = searchParams.get("checkInDate");
//           const [day, month, year] = checkInDate.split("/").map(Number);
//           dispatch(updateCheckInDate({ day, month, year }));
//         }

//         // Check-out date
//         if (searchParams.get("checkOutDate")) {
//           const checkOutDate = searchParams.get("checkOutDate");
//           const [day, month, year] = checkOutDate.split("/").map(Number);
//           dispatch(updateCheckOutDate({ day, month, year }));
//         }

//         // Activity day date
//         if (searchParams.get("activityDayDate")) {
//           const activityDayDate = searchParams.get("activityDayDate");
//           const [day, month, year] = activityDayDate.split("/").map(Number);
//           dispatch(updateActivityDayDate({ day, month, year }));
//         }

//         // Budget range
//         if (searchParams.get("minBudget") && searchParams.get("maxBudget")) {
//           const minBudget = parseInt(searchParams.get("minBudget"), 10);
//           const maxBudget = parseInt(searchParams.get("maxBudget"), 10);
//           if (!isNaN(minBudget) && !isNaN(maxBudget)) {
//             dispatch(updateBudgetRange([minBudget, maxBudget]));
//           }
//         }

//         // Available seats
//         const agesByType = Object.fromEntries(
//           Object.entries(agesIdsList).map(([id, type]) => [type, id])
//         );

//         Object.entries(agesByType).forEach(([type, id]) => {
//           const count = searchParams.get(type);
//           if (count && !isNaN(parseInt(count))) {
//             dispatch(
//               updateGuestCount({
//                 type,
//                 count: parseInt(count),
//               })
//             );
//           }
//         });

//         // For sharable link

//         // Search term
//         if (searchParams.has("searchTerm")) {
//           dispatch(setSearchTerm(searchParams.get("searchTerm")));
//         }

//         // Sorting
//         if (searchParams.has("sorting")) {
//           dispatch(setSortBy(searchParams.get("sorting")));
//         }

//         // Categories
//         if (searchParams.has("categories")) {
//           const urlCategories = searchParams.getAll("categories") || [];
//           if (urlCategories.length > 0) {
//             urlCategories.forEach((category) => {
//               if (
//                 category === "" ||
//                 category === null ||
//                 category === undefined
//               ) {
//                 return;
//               } else {
//                 dispatch(addCategory(category));
//               }
//             });
//           }
//         }

//         // Languages
//         if (searchParams.has("languages")) {
//           const urlLanguages = searchParams.getAll("languages") || []; // Split the comma-separated string
//           if (urlLanguages.length > 0) {
//             urlLanguages.forEach((language) => {
//               if (
//                 language === "" ||
//                 language === null ||
//                 language === undefined
//               ) {
//                 return;
//               } else {
//                 dispatch(addLanguage(language));
//               }
//             });
//           }
//         }

//         // Rate
//         if (searchParams.has("rate")) {
//           dispatch(setRate(Number(searchParams.get("rate"))));
//         }

//         // Mark filters as initialized
//         setIsFiltersInitialized(true);
//       } catch (error) {
//         console.error("Error initializing filters:", error);
//         setIsFiltersInitialized(true); // Set to true even on error to prevent hanging
//       }
//     };

//     initializeFilters();
//   }, [searchParams, dispatch, tripsType]);

//   // Dates
//   const formatDateFromURL = (dateString) => {
//     if (!dateString) return null;
//     const decodedDateString = decodeURIComponent(dateString);
//     const [day, month, year] = decodedDateString.split("/").map(Number);

//     return {
//       day,
//       month,
//       year,
//     };
//   };

//   // Available seats
//   const totalGuests = Math.max(
//     1,
//     Object.entries(agesIdsList).reduce((sum, [id, type]) => {
//       const count = parseInt(searchParams.get(type)) || 0;
//       return sum + count;
//     }, 0)
//   );

//   // Target audience
//   const targetAudienceList = {};
//   Object.entries(guests).forEach(([key, value]) => {
//     targetAudienceList[key] = value;
//   });

//   const chosenTargetAudiences = getSelectedTargetAudiences(
//     targetAudienceList,
//     agesIdsList
//   );

//   // console.log(chosenTargetAudiences);

//   const filter = useMemo(
//     () => {
//       return buildFilter({
//         tripsType: searchParams.get("tripsType") || tripsType,

//         allTripsTypes: searchParams.has("tripsType")
//           ? [searchParams.get("tripsType")] // ? [tripsType]
//           : [CONSTANT_VALUES.ACTIVITY, CONSTANT_VALUES.PACKAGE],

//         checkInDate: searchParams.has("checkInDate")
//           ? formatDateFromURL(searchParams.get("checkInDate"))
//           : checkInDate,

//         checkOutDate: searchParams.has("checkOutDate")
//           ? formatDateFromURL(searchParams.get("checkOutDate"))
//           : checkOutDate,

//         activityDayDate: searchParams.has("activityDayDate")
//           ? formatDateFromURL(searchParams.get("activityDayDate"))
//           : activityDayDate,

//         cities: searchParams.has("cities")
//           ? // [0]?.split(",")
//             searchParams.getAll("cities") || []
//           : cities,

//         budgetRange:
//           searchParams.get("minBudget") && searchParams.get("maxBudget")
//             ? {
//                 min: parseInt(searchParams.get("minBudget"), 10),
//                 max: parseInt(searchParams.get("maxBudget"), 10),
//               }
//             : {
//                 min: CONSTANT_VALUES.MIN_BUDGET,
//                 max: CONSTANT_VALUES.MAX_BUDGET,
//               },

//         availableSeats: totalGuests,

//         targetAudiences: chosenTargetAudiences,

//         // For sharable link
//         searchTerm: searchParams.get("searchTerm"),

//         categories: searchParams.has("categories")
//           ? searchParams.getAll("categories") || []
//           : categories,

//         languages: searchParams.has("languages")
//           ? searchParams.getAll("languages") || []
//           : languages,

//         rate: Number(searchParams.get("rate")) || null,
//       });
//     },
//     [
//       // tripsType,
//       // allTripsTypes,
//       // checkInDate,
//       // checkOutDate,
//       // activityDayDate,
//       // cities,
//       // targetAudiences,
//       // budgetRange,
//       // availableSeats,
//     ]
//   );

//   // Discover trips request
//   useEffect(() => {
//     // Only make the request if filters have been initialized
//     if (!isFiltersInitialized) {
//       return;
//     }

//     // Add a small delay to ensure all state updates are processed
//     const timeoutId = setTimeout(() => {
//       dispatch(
//         actGetDiscoverTrips({
//           sortType: searchParams.get("sorting") || SORTING_TYPE.NEWEST,
//           filter,
//           locale,
//         })
//       );
//     }, 100);

//     return () => {
//       // clearTimeout(timeoutId);
//       // dispatch(resetFilters());
//       // dispatch(setSortBy(SORTING_TYPE.NEWEST));
//       if (initialRequestMade.current) {
//         dispatch(setCurrentPage(1));
//       }
//     };
//   }, [dispatch, filter, locale, isFiltersInitialized, searchParams]);

//   // Side filters data request
//   const {
//     data: sideFiltersData,
//     error: sideFiltersError,
//     isLoading: sideFiltersLoading,
//   } = useFetchData(
//     `${END_POINTS.TRIPS}${END_POINTS.SIDE_FILTERS}`,
//     {},
//     {
//       method: "GET",
//       lang: locale,
//       cacheTime: 0,
//       staleTime: 0,

//       onSuccess: setDiscoverSideFiltersData,
//       onError: setDiscoverSideFiltersDataLoading,
//       onLoading: setDiscoverSideFiltersDataError,
//     }
//   );

//   useEffect(() => {
//     document.title = `${t("pagesHead.appName")} | ${t(
//       "pagesHead.title.discover"
//     )}`;
//   }, [t]);

//   const { trips, loading, error } = useSelector((state) => state.discoverData);

//   if (loading === "loading" || sideFiltersLoading || !isFiltersInitialized) {
//     <div className="w-full min-h-screen centered">
//       <FullScreenLoading status="pending" />
//     </div>;
//   }

//   if (error || sideFiltersError) {
//     return (
//       <ErrorComponent
//         statusCode={error?.statusCode || "404"}
//         errorMessage={error?.message || t("validations.tryAgain")}
//       />
//     );
//   }

//   return (
//     <>
//       <main className="bg-packageDetailsBg">
//         <SubHeaderSection />
//         <LargeSeparator />

//         <GridSection />

//         <SmallSeparator />
//       </main>
//     </>
//   );
// };

// export default Discover;

"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setSearchTerm,
  setSortBy,
} from "@store/discover/discoverSlice";
import {
  setDiscoverSideFiltersData,
  setDiscoverSideFiltersDataError,
  setDiscoverSideFiltersDataLoading,
} from "@store/searchFilter/discoverSideFiltersSlice";
import {
  addAcademicStage,
  addCategory,
  addCity,
  addLanguage,
  addTripDuration,
  addTripType,
  resetFilters,
  setRate,
  setTripsTypes,
  switchTripsType,
  updateActivityDayDate,
  // updateBudgetRange,
  updateCheckInDate,
  updateCheckOutDate,
  updateGuestCount,
} from "@store/searchFilter/searchFilterSlice";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { useEffect, useMemo, useState, useRef } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
// import { END_POINTS } from "@constants/APIs";
import { useFetchData } from "@hooks/useFetchData";
import { SORTING_TYPE } from "@constants/sorting";
import { agesIdsList } from "@constants/targetAudiencesIds";
// import { CONSTANT_VALUES } from "@constants/constantValues";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import buildFilter from "@utils/BuildFilter";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";
import SubHeaderSection from "@components/sections/pages/discover/subHeaderSection";
import LargeSeparator from "@components/common/separators/LargeSeparator";
import GridSection from "@components/sections/pages/discover/gridSection";
import SmallSeparator from "@components/common/separators/SmallSeparator";

const Discover = () => {
  const [isFiltersInitialized, setIsFiltersInitialized] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const initialLoadComplete = useRef(false);
  const isInitialPageLoad = useRef(true);

  const {
    tripsType,
    allTripsTypes,
    cities,
    tripType,
    tripDuration,
    academicStage,
    // guests,
    activityDayDate,
    checkOutDate,
    checkInDate,
    // budgetRange,
    categories,
    languages,
    rate,
  } = useSelector((state) => state.searchFilter);


  const { currentPage } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Format date from URL helper
  // const formatDateFromURL = (dateString) => {
  //   if (!dateString) return null;
  //   const decodedDateString = decodeURIComponent(dateString);
  //   const [day, month, year] = decodedDateString.split("/").map(Number);
  //   return { day, month, year };
  // };

  // Calculate total guests
  // const totalGuests = useMemo(() => {
  //   return Math.max(
  //     1,
  //     Object.entries(agesIdsList).reduce((sum, [_, type]) => {
  //       const count = parseInt(searchParams.get(type)) || 0;
  //       return sum + count;
  //     }, 0)
  //   );
  // }, [searchParams]);

  // Target audience processing
  // const chosenTargetAudiences = useMemo(() => {
  //   const targetAudienceList = {};
  //   Object.entries(guests).forEach(([key, value]) => {
  //     targetAudienceList[key] = value;
  //   });
  //   return getSelectedTargetAudiences(targetAudienceList, agesIdsList);
  // }, [guests]);

  // Initialize filters from URL params only once on initial load
  useEffect(() => {
    if (initialLoadComplete.current) return;

    const initializeFilters = async () => {
      try {
        // Prevent multiple initializations
        initialLoadComplete.current = true;

        // Reset filters to start fresh
        dispatch(resetFilters());

        // Trips type
        // if (searchParams.get("tripsType")) {
        //   const urlTripsType = searchParams.get("tripsType");
        //   dispatch(setTripsTypes(urlTripsType));
        //   if (urlTripsType !== tripsType) {
        //     dispatch(switchTripsType(urlTripsType));
        //   }
        // }

        // Trips type
        if (searchParams.get("tripType")) {
          const urlTripsType = searchParams.get("tripType");
          dispatch(setTripsTypes(urlTripsType));
          if (urlTripsType !== tripType) {
            dispatch(switchTripsType(urlTripsType));
          }
        }

        // tripType
        // if (searchParams.has("supCategories")) {
        //   const urlTripType = searchParams.getAll("supCategories") || [];
        //   if (urlTripType.length > 0) {
        //     urlTripType.forEach((tripType) => {
        //       if (
        //         tripType === "" ||
        //         tripType === null ||
        //         tripType === undefined
        //       ) {
        //         return;
        //       } else {
        //         dispatch(addTripType(tripType));
        //       }
        //     });
        //   }
        // }
        if (searchParams.has("supCategories")) {
          // Handles both ?supCategories=val1,val2 and ?supCategories=val1&supCategories=val2
          let urlTripType = searchParams.getAll("supCategories") || [];
          urlTripType = urlTripType
            .flatMap((val) => val.split(","))
            .filter(Boolean);

          urlTripType.forEach((tripType) => {
            dispatch(addTripType(tripType));
          });
        }

        // Cities
        if (searchParams.has("cities")) {
          const urlCities = searchParams.getAll("cities") || [];
          if (urlCities.length > 0) {
            urlCities.forEach((city) => {
              if (city === "" || city === null || city === undefined) {
                return;
              } else {
                dispatch(addCity(city));
              }
            });
          }
        }

        // tripDuration
        if (searchParams.has("tripsTypes")) {
          const urlTripDuration = searchParams.getAll("tripsTypes") || [];
          if (urlTripDuration.length > 0) {
            urlTripDuration.forEach((tripDuration) => {
              if (
                tripDuration === "" ||
                tripDuration === null ||
                tripDuration === undefined
              ) {
                return;
              } else {
                dispatch(addTripDuration(tripDuration));
              }
            });
          }
        }

        // academicStage
        if (searchParams.has("academicStages")) {
          const academicStages =
            searchParams.get("academicStages")?.split(",") || [];
          academicStages.forEach((id) => id && dispatch(addAcademicStage(id)));
        }

        // Check-in date
        if (searchParams.get("checkInDate")) {
          const checkInDate = searchParams.get("checkInDate");
          const [day, month, year] = checkInDate.split("/").map(Number);
          dispatch(updateCheckInDate({ day, month, year }));
        }

        // Check-out date
        if (searchParams.get("checkOutDate")) {
          const checkOutDate = searchParams.get("checkOutDate");
          const [day, month, year] = checkOutDate.split("/").map(Number);
          dispatch(updateCheckOutDate({ day, month, year }));
        }

        // Activity day date
        if (searchParams.get("activityDayDate")) {
          const activityDayDate = searchParams.get("activityDayDate");
          const [day, month, year] = activityDayDate.split("/").map(Number);
          dispatch(updateActivityDayDate({ day, month, year }));
        }

        // Budget range
        // if (searchParams.get("minBudget") && searchParams.get("maxBudget")) {
        //   const minBudget = parseInt(searchParams.get("minBudget"), 10);
        //   const maxBudget = parseInt(searchParams.get("maxBudget"), 10);
        //   if (!isNaN(minBudget) && !isNaN(maxBudget)) {
        //     dispatch(updateBudgetRange([minBudget, maxBudget]));
        //   }
        // }

        // Available seats
        const agesByType = Object.fromEntries(
          Object.entries(agesIdsList).map(([id, type]) => [type, id])
        );

        Object.entries(agesByType).forEach(([type, _]) => {
          const count = searchParams.get(type);
          if (count && !isNaN(parseInt(count))) {
            dispatch(
              updateGuestCount({
                type,
                count: parseInt(count),
              })
            );
          }
        });

        // Search term
        if (searchParams.has("searchTerm")) {
          dispatch(setSearchTerm(searchParams.get("searchTerm")));
        }

        // Sorting
        if (searchParams.has("sorting")) {
          dispatch(setSortBy(searchParams.get("sorting")));
        }

        // Categories
        if (searchParams.has("categories")) {
          const urlCategories = searchParams.getAll("categories") || [];
          if (urlCategories.length > 0) {
            urlCategories.forEach((category) => {
              if (
                category === "" ||
                category === null ||
                category === undefined
              ) {
                return;
              } else {
                dispatch(addCategory(category));
              }
            });
          }
        }

        // Languages
        if (searchParams.has("languages")) {
          const urlLanguages = searchParams.getAll("languages") || [];
          if (urlLanguages.length > 0) {
            urlLanguages.forEach((language) => {
              if (
                language === "" ||
                language === null ||
                language === undefined
              ) {
                return;
              } else {
                dispatch(addLanguage(language));
              }
            });
          }
        }

        // Rate
        if (searchParams.has("rate")) {
          dispatch(setRate(Number(searchParams.get("rate"))));
        }

        // Mark filters as initialized and trigger data fetch
        setIsFiltersInitialized(true);
        setShouldFetchData(true);
      } catch (error) {
        console.error("Error initializing filters:", error);
        setIsFiltersInitialized(true);
        setShouldFetchData(true);
      }
    };

    initializeFilters();
  }, [dispatch, searchParams]);

  // Build filter with proper dependencies
  const filter = useMemo(() => {
    if (!isFiltersInitialized) return {};

    return buildFilter({
      // tripsType,
      allTripsTypes,
      checkInDate,
      checkOutDate,
      activityDayDate,
      cities,
      tripsType,
      tripType,
      tripDuration,
      academicStage,
      // budgetRange: {
      //   min: budgetRange.min || CONSTANT_VALUES.MIN_BUDGET,
      //   max: budgetRange.max || CONSTANT_VALUES.MAX_BUDGET,
      // },
      // availableSeats: totalGuests,
      // targetAudiences: chosenTargetAudiences,
      searchTerm: searchParams.get("searchTerm") || "",
      categories,
      languages,
      rate: rate || null,
    });
  }, [
    isFiltersInitialized,
    // tripsType,
    allTripsTypes,
    checkInDate,
    checkOutDate,
    activityDayDate,
    cities,
    tripsType,
    tripDuration,
    academicStage,
    // budgetRange,
    // totalGuests,
    // chosenTargetAudiences,
    categories,
    languages,
    rate,
    searchParams,
  ]);

  // Discover trips request - only fetch when shouldFetchData is true
  useEffect(() => {
    if (!shouldFetchData || !isFiltersInitialized) {
      return;
    }

    // Reset the flag to prevent additional fetches
    setShouldFetchData(false);

    const sortingType = searchParams.get("sorting") || SORTING_TYPE.NEWEST;

    // Fetch data with current filter state
    dispatch(
      actGetDiscoverTrips({
        sortType: sortingType,
        filter,
        locale,
      })
    );

    // Keep track of current page
    dispatch(setCurrentPage(1));
    isInitialPageLoad.current = false; // Mark initial load as complete
  }, [
    dispatch,
    filter,
    locale,
    shouldFetchData,
    isFiltersInitialized,
    searchParams,
  ]);

  // Handle page changes
  useEffect(() => {
    // Skip if filters not initialized
    if (!isFiltersInitialized) {
      return;
    }

    // Skip the very first page load (handled by main useEffect above)
    if (isInitialPageLoad.current && currentPage === 1) {
      return;
    }

    const sortingType = searchParams.get("sorting") || SORTING_TYPE.NEWEST;

    

    dispatch(
      actGetDiscoverTrips({
        page: currentPage,
        sortType: sortingType,
        filter,
        locale,
      })
    );
  }, [currentPage]);

  // Side filters data request
  const {
    error: sideFiltersError,
    data
    // isLoading: sideFiltersLoading,
  } = useFetchData(
    `${B2B_END_POINTS.DISCOVER_SIDE_FILTERS}`,
    {},
    {
      method: "GET",
      lang: locale,
      cacheTime: 0,
      staleTime: 0,
      onSuccess: setDiscoverSideFiltersData,
      onError: setDiscoverSideFiltersDataError,
      onLoading: setDiscoverSideFiltersDataLoading,
    }
  );


  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.discover"
    )}`;
  }, [t]);

  // Expose a function to apply filters and trigger data fetch
  // This should be passed to your filter components
  const applyFilters = () => {
    setShouldFetchData(true);
  };

  const {
    // trips, loading,
    error,
  } = useSelector((state) => state.discoverData);

  // if (loading === "loading" || sideFiltersLoading || !isFiltersInitialized) {
  //   return (
  //     <div className="w-full min-h-screen centered">
  //       <FullScreenLoading status="pending" />
  //     </div>
  //   );
  // }

  if (error || sideFiltersError) {
    return (
      <ErrorComponent
        statusCode={error?.statusCode || "404"}
        errorMessage={error?.message || t("validations.tryAgain")}
      />
    );
  }

  return (
    <>
      <main className="bg-packageDetailsBg">
        <SubHeaderSection applyFilters={applyFilters} />
        <LargeSeparator />
        <GridSection applyFilters={applyFilters} />
        <SmallSeparator />

        {/* loading === "loading" ||
          sideFiltersLoading || */}
        {!isFiltersInitialized && (
          <div className="w-full min-h-screen centered">
            <FullScreenLoading status="pending" />
          </div>
        )}
      </main>
    </>
  );
};

export default Discover;
