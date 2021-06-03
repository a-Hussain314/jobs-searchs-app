import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_SINGLE_JOB, GET_RELATED_JOBS } from '../../Actions/jobs';
import { GET_RELATED_SKILLS } from '../../Actions/skills';

import SideList from '../../components/Lists/SideList';
import RelatedInfoCard from '../../components/cards/RelatedInfoCard';
import styles from './Job.module.scss';
import Skeleton from 'react-loading-skeleton';

type props = {
    match: any,
    store: store,
    GET_SINGLE_JOB: (id: uuid) => void,
    GET_RELATED_SKILLS: (id: uuid) => void,
    GET_RELATED_JOBS: (id: uuid) => void,
}

const JobPage: React.FC<props> = ({ match, store, GET_SINGLE_JOB, GET_RELATED_SKILLS, GET_RELATED_JOBS }) => {
    const job = store.jobs.byId[match.params.id]
    useEffect(() => {

        if (!job) {
            // don't refetch the job details, if it's previously fetched 
            GET_SINGLE_JOB(match.params.id);
        }

        if (!store.skills.byJobId[match.params.id]) {
            // don't refetch the related skills, if it's previously fetched 
            GET_RELATED_SKILLS(match.params.id);
        }

        if (!store.jobs.relatedByJobId[match.params.id]) {
            // don't refetch the related jobs, if it's previously fetched 
            GET_RELATED_JOBS(match.params.id);
        }

    }, [
        job,
        GET_SINGLE_JOB,
        GET_RELATED_SKILLS,
        GET_RELATED_JOBS,
        store.jobs.relatedByJobId,
        store.jobs.byId,
        store.skills.byJobId,
        match.params.id
    ])

    let listItems: React.ReactNode[] = store.jobs.relatedByJobId[match.params.id]?.map((id: uuid) => {
        return (
            <li key={id}>
                <Link to={`/job/${id}`}>{store.jobs.byId[id].title}</Link>
            </li>
        )
    })

    return (
        <div className={"page_content"}>
            <div className={"container"}>
                {job ?
                    <>
                        <h1>{job.normalized_job_title || job.title}</h1>
                        <div className={styles.jobContainer}>

                            <div className={styles.jobDetails}>
                                <h3>Related Skills:</h3>

                                {store.skills.byJobId[match.params.id] ?
                                    store.skills.byJobId[match.params.id].length ?
                                        store.skills.byJobId[match.params.id].map((skill: skill) => {
                                            return (
                                                <RelatedInfoCard
                                                    key={skill.skill_uuid}
                                                    href={`/skill/${skill.skill_uuid}`}
                                                    title={skill.skill_name}
                                                    description={skill.description}
                                                    listData={{
                                                        ...(!!skill.skill_type && { Type: skill.skill_type }),
                                                        ...(!!skill.importance && { Importance: skill.importance }),
                                                        ...(!!skill.level && { Level: skill.level }),
                                                    }}
                                                />
                                            )
                                        })
                                        :
                                        <p>No associated skills found</p>
                                    :
                                    <>
                                        <Skeleton height="7.5rem" count={5} style={{margin:"0.5rem 0"}}/>
                                    </>
                                }



                            </div>

                            <div className={styles.jobSideList}>
                                <SideList
                                    title={"Related Jobs:"}
                                    listItems={listItems}
                                />
                            </div>

                        </div>
                    </>
                    :
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

export default connect(mapStateToProps, { GET_SINGLE_JOB, GET_RELATED_SKILLS, GET_RELATED_JOBS })(JobPage);