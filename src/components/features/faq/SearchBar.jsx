"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  clearFaq,
  setFaq,
  setFaqError,
  setFaqLoading,
} from "@store/faq/faqSlice";

import { END_POINTS } from "@constants/APIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import { createSearchBarSchema } from "@utils/validators/validationSchemas";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import TextInputGroup from "@components/forms/TextInputGroup";

import { Formik } from "formik";

import { Container } from "@mui/system";

import { searchBarIcon } from "@assets/svg";

import axios from "axios";

const SearchBar = () => {
  const { loading } = useSelector((state) => state.faqData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const searchBarSchema = createSearchBarSchema(t);

  const handleSubmit = async (values, { resetForm }) => {
    const headers = getHeaders(locale);

    const body = {
      filter: {
        searchTerm: values.searchBar,
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.FAQ}`,
      headers,
      data: body,
    };

    try {
      dispatch(setFaqLoading());
      const response = await axios.request(config);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length === 0
      ) {
        dispatch(clearFaq());
      } else {
        dispatch(setFaq(response.data));
      }

      resetForm();
    } catch (error) {
      const errorMessage = getErrorMessage(error, t);
      dispatch(setFaqError(errorMessage));
    }
  };

  return (
    <>
      <Container className="centered">
        <div className="p-3 w-full lg:w-[60%] transition-all duration-200 ease-in-out bg-white lg:p-5 rounded-2xl">
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
                className="flex items-center gap-7 lg:gap-[10px]  lg:justify-between flex-wrap lg:flex-nowrap"
              >
                <div className="flex items-center w-full gap-1">
                  <span>{searchBarIcon}</span>

                  <TextInputGroup
                    type="search"
                    name="searchBar"
                    placeholder={t("faq.searchPlaceholder")}
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

                <button
                  type="submit"
                  disabled={
                    !isValid || isSubmitting || values.searchBar.length === 0
                  }
                  className={`py-3 text-base w-full lg:w-[140px] font-semibold text-center text-white capitalize transition-all duration-200 ease-in-out border-2 rounded-lg px-9 bg-mainColor border-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                    isValid && "hover:bg-linksHover hover:border-linksHover"
                  }`}
                >
                  {t("links.search")}
                </button>
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
