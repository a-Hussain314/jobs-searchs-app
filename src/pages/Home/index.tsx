import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { GET_JOBS } from '../../Actions/jobs';
import JobCardsList from '../../components/cards/JobCardsList';
import styles from './Home.module.scss';

type props = {
    GET_JOBS: (href?: string) => void,
    store: store,
}

const HomePage: React.FC<props> = ({ GET_JOBS, store }) => {
    const [lastHref, setLastHref] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!store.jobs.homeJobs.length) {
            // fetch the first page on component load.
            GET_JOBS()
        }

        // hide the loader when the new 12 jobs gets fetched 
        setShowLoader(false);

    }, [GET_JOBS, store.jobs.homeJobs.length, store.jobs.links?.length]);

    const loadMore = useCallback(() => {
        // extract the next page href from jobs List links array.
        let nextPageLink = store?.jobs?.links?.find((link: link) => link.rel === "next");

        // make sure not to fetch next page in case of last page
        // and also not to fetch the same page multiple times
        if (nextPageLink && nextPageLink.href !== lastHref) {
            let href: string = nextPageLink.href;
            setLastHref(href);
            GET_JOBS(href);

            // show the loader to indicate fetching new 12 jobs
            setShowLoader(true)
        }
    }, [GET_JOBS, store.jobs.links, lastHref])

    useEffect(() => {
        window.addEventListener("scroll", () => {
            // fire the "load more" function just a little bit before reaching the page bottom
            if (window.document.body.getBoundingClientRect().bottom - window.innerHeight < 100) {
                buttonRef.current?.click();
            }
        });
    }, [])

    return (
        <div className={"container"}>
            <div className={styles.home}>

                {!store.jobs.homeJobsLoading &&
                    <>
                        <h1>{`All Jobs (${store.jobs.total})`}</h1>
                        {
                            store.jobs.homeJobs.length ?
                                <>
                                    <JobCardsList jobs={store.jobs.homeJobs} />
                                    <button
                                        ref={buttonRef}
                                        onClick={loadMore}
                                        style={{ display: "none", width: "100%" }}
                                    >
                                        load more Jobs
                                    </button>
                                </>
                                :
                                <p>{`No jobs found`}</p>

                        }
                    </>
                }

                {/* load more spinner */}
                {(showLoader || store.jobs.homeJobsLoading) &&
                    <div className="loaderContainer">
                        <div className="loader"></div>
                    </div>
                }

            </div>
        </div>
    )
}

const mapStateToProps = (state: store) => {
    return { store: state };
};

export default connect(mapStateToProps, { GET_JOBS })(HomePage);