import React from 'react';
import { connect } from 'react-redux';
import JobCard from './JobCard';
import styles from './JobCardList.module.scss';

type props = {
    jobs : uuid[],
    limit ?: number,
    store : store
}

const JobCardsList: React.FC<props> = ({jobs, limit, store}) => {
    return (
        <>
            {/* {history.location.pathname==="/search" && <h1>{`“query” jobs (number)`}</h1>} */}
            <div className={styles.cardsConatiner}>
                {jobs.slice(0, limit).map((uuid:uuid, index:number)=>{
                    const singleJob:job = store.jobs.byId[uuid];
                    return <JobCard key={uuid} job={singleJob}/>
                })}
            </div>
            
        </>
    )
}

const mapStateToProps = (state: store) => {
    return { store: state };
};

export default connect(mapStateToProps, {})(JobCardsList);

