import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import JobCardsList from '../../components/cards/JobCardsList';
import styles from './Search.module.scss';
import SideList from '../../components/Lists/SideList';

type props = {
    store: store
}

const SearchPage: React.FC<props> = ({ store }) => {
    const results : suggestionsState = store.jobSearchResults;

    const getSearchHistory = (): string[] => {
        let jsonSearchHistory: string | null = window.localStorage.getItem("searchHistory");
        let searchHistory: { [key: string]: number };
        let sortedSearchHistoryArray: string[] = [];

        if (jsonSearchHistory) {
            searchHistory = JSON.parse(jsonSearchHistory);
            // sorting according to time stamp.
            sortedSearchHistoryArray = Object.keys(searchHistory).sort(function (x, y) {
                return searchHistory[y] - searchHistory[x];
            })
        }
        return sortedSearchHistoryArray;
    }

    const listItems: React.ReactNode[] = getSearchHistory().map((searchTerm, index) => {
        return (
            <li key={index}>
                <Link to={`/search?query=${searchTerm}`}>{searchTerm}</Link>
            </li>
        )
    })

    return (
        <>
            <div className={styles.Search}>
                <div className={"container"}>

                    {!!results.query &&
                        <>
                            <h1>{`“${results.query}” jobs (${results.total})`}</h1>
                            {!results.total && <p>{`No jobs found`}</p>}
                        </>
                    }

                    <div className={styles.searchContainer}>
                        <div className={styles.searchResults}>
                            {!results.isLoading?
                                <JobCardsList jobs={results.allIds} limit={12} />
                                : 
                                <div className="loaderContainer">
                                    <div className="loader"></div>
                                </div>
                            }
                        </div>
                        <div className={styles.searchSideList}>
                            <SideList
                                title={"Search History:"}
                                listItems={listItems}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state: store) => {
    return { store: state };
};

export default connect(mapStateToProps, {})(SearchPage);