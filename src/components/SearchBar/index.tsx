import React, { useState, useEffect, useRef, useCallback } from 'react';
import openSkillsApi from '../../Apis/openSkillsApi';
import { connect } from 'react-redux';
import { GET_JOBS_SEARCH_RESULTS, CLEAR_JOBS_SEARCH_RESULTS, SET_SEARCH_LOADER } from '../../Actions/jobSearchResults';
import styles from "./Search.module.scss";

type props = {
    history: any,
    location: any,
    GET_JOBS_SEARCH_RESULTS: (query: string) => void,
    CLEAR_JOBS_SEARCH_RESULTS : () => void,
    SET_SEARCH_LOADER: (bool:boolean) => void,
}

const SearchBar: React.FC<props> = ({ history, location, GET_JOBS_SEARCH_RESULTS, CLEAR_JOBS_SEARCH_RESULTS, SET_SEARCH_LOADER }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [jobsAutocompleteList, setJobsAutocompleteList] = useState<suggestion[] | null>(null);

    var timeId: React.MutableRefObject<number> = useRef(0);

    const fetchSuggestions = useCallback((textFragment: string): void => {
        openSkillsApi.get(`/jobs/autocomplete?contains=${textFragment}`)
            .then(({ data }) => {
                setJobsAutocompleteList(data.slice(0, 12));
            })
            .catch((error) => {
                const err = { ...error }.response?.data?.error;
                if (err?.code === 404) {
                    // console.log(err);
                    setJobsAutocompleteList(null);
                }
            })
    }, [])

    const AddToSearchHistory = (searchTerm: string): void => {
        // fetch the searchHistory object from local storage if any.
        const jsonSearchHistory: string | null = window.localStorage.getItem("searchHistory");
        const searchHistory = jsonSearchHistory ? JSON.parse(jsonSearchHistory) : {};
        // add the current search term to searchHistory object as a key,
        //  with the current time stamp as a value
        // to easily sort the search history list later  acording to time of search.
        searchHistory[searchTerm] = new Date().getTime();
        window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    useEffect(() => {
        const query = searchQuery.trim();
        if (query.length > 2) {
            SET_SEARCH_LOADER(true);
            if (history.location.pathname !== "/search") {
                // if currently in any other route, redirect to "/search"
                history.push("/search");
            }

            if (timeId.current) {
                // to debounce the timed out [suggestions and jobs results] fetching function (if any)
                // console.log("clearing timeout function : new timeout function");
                window.clearTimeout(timeId.current);
            }

            // set a new timed out [suggestions and jobs results] fetching function with the new "searcQuery"
            timeId.current = window.setTimeout(() => {
                fetchSuggestions(query);
                GET_JOBS_SEARCH_RESULTS(query);
                AddToSearchHistory(query)
            }, 1000)
        }
        else if (query.length <= 2 && query.length > 0 && timeId.current) {
            // to debounce the timed out [suggestions and jobs results] fetching function (if any)
            // console.log("clearing time out : search query length < 3");
            window.clearTimeout(timeId.current);
            timeId.current = 0;
            SET_SEARCH_LOADER(false);
        }
    }, [searchQuery, fetchSuggestions, history, GET_JOBS_SEARCH_RESULTS, SET_SEARCH_LOADER]);


    useEffect(() => {
        // if there is [urlSearchParams="query"] setSearchQuery with "query" value;
        const urlSearchParam: string | null = new URLSearchParams(location.search).get("query");
        if (urlSearchParam?.trim()) {
            // console.log(`there is a Url search query : '${urlSearchParam.trim()}'`);
            setSearchQuery(urlSearchParam.trim())
        }

    }, [location.search])


    const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue: string = e.target.value;
        setSearchQuery(inputValue);

        if (!inputValue) {
            history.push("/");
            setJobsAutocompleteList(null);
            CLEAR_JOBS_SEARCH_RESULTS()
        }

    }, [history, CLEAR_JOBS_SEARCH_RESULTS]);


    const inputFocusHandler = useCallback(() => {
        if (searchQuery?.length > 2) {
            history.push("/search")
        }
    }, [searchQuery, history])


    return (
        <div className={styles.search_wrapper}>
            <div className="container">
                <input
                    className={styles.search}
                    type="search"
                    placeholder="Search Keyword"
                    value={searchQuery}
                    onInput={inputChangeHandler}
                    onFocus={inputFocusHandler}
                    list={"jobsAutocomplete"}
                />
                <datalist id="jobsAutocomplete">
                    {jobsAutocompleteList?.map((suggestion: suggestion) => {
                        return (
                            <option key={suggestion.uuid} value={suggestion.suggestion} />
                        )
                    })}
                </datalist>
            </div>
        </div>
    )
}

const mapStateToProps = (state: store) => {
    return { store: state };
};

export default connect(mapStateToProps, { GET_JOBS_SEARCH_RESULTS, CLEAR_JOBS_SEARCH_RESULTS, SET_SEARCH_LOADER })(SearchBar);