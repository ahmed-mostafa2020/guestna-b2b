"use client";

import { useLocale, useTranslations } from "next-intl";

import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@store/discover/discoverSlice";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { useUpdateQueryParams } from "@hooks/useUpdateQueryParams";
import { createSearchBarSchema } from "@utils/validationSchemas";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import TextInputGroup from "@components/forms/TextInputGroup";

import { Formik } from "formik";

import { Container } from "@mui/system";

import { searchBarIcon } from "@assets/svg";
// import ResetButton from "../gridSection/filterGrid/resetButton";

const SearchBar = () => {
  const { loading, sortBy } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const updateQueryParams = useUpdateQueryParams();

  const searchBarSchema = createSearchBarSchema(t);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(setSearchTerm(values.searchBar));

    const filter = {
      searchTerm: values.searchBar,
    };

    updateQueryParams({
      sorting: sortBy,
      page: 1,
      searchTerm: values.searchBar,
    });

    dispatch(actGetDiscoverTrips({ sortType: sortBy, filter, locale }));

    resetForm();
  };

  return (
    <>
      <Container className="centered">
        <div className="p-3 transition-all duration-200 ease-in-out bg-white w-fit lg:p-5 rounded-2xl">
          <Formik
            initialValues={{
              searchBar: "",
            }}
            validationSchema={searchBarSchema}
            onSubmit={handleSubmit}
            enableReinitialize
            validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={true}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-7 lg:gap-[10px] flex-wrap lg:justify-center"
              >
                <div className="flex items-center w-full gap-1 lg:w-fit">
                  <span>{searchBarIcon}</span>

                  <TextInputGroup
                    type="search"
                    name="searchBar"
                    placeholder={t("forms.searchBar.placeholder")}
                    border={false}
                    value={values.searchBar}
                    errors={errors.searchBar}
                    touched={touched.searchBar}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    minLength="3"
                    maxLength="200"
                  />
                </div>
                <div className="relative w-full lg:w-fit">
                  <button
                    type="submit"
                    disabled={
                      !isValid || isSubmitting || values.searchBar.length === 0
                    }
                    className={`py-3 text-base w-full lg:w-[140px] font-semibold text-center text-white capitalize transition-all duration-200 ease-in-out border-2 rounded-lg px-9 bg-mainColor border-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                      isValid && "hover:bg-linksHover hover:border-linksHover"
                    }`}
                    {...getGtmTag(GTM_TAGS.FILTERS.SEARCH, "search")}
                  >
                    {t("links.search")}
                  </button>

                  {/* <div
                    className={`absolute flex opacity-0 inset-0 ${
                      !isValid || values.searchBar.length === 0
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    <ResetButton className="w-full h-full" />
                  </div> */}
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Container>

      {loading === "loading" && <FullScreenLoading status="pending" />}
    </>
  );
};

export default SearchBar;
