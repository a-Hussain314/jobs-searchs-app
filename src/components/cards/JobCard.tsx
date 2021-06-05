import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { GET_RELATED_SKILLS } from '../../Actions/skills';
import Skeleton from 'react-loading-skeleton';
import styles from './JobCard.module.scss';
type props = {
    job: job;
    GET_RELATED_SKILLS: (id: string) => void,
    store: store
}

const JobCard: React.FC<props> = React.memo(({ job, GET_RELATED_SKILLS, store }) => {
    useEffect(() => {
        // don't refetch the job related skills, if it's previously fetched 
        if (!store.skills.byJobId[job.uuid]) {
            GET_RELATED_SKILLS(job.uuid)
        }
    }, [GET_RELATED_SKILLS, job, store.skills.byJobId])

    let relatedskillsList = store?.skills?.byJobId[job.uuid];
    return (
        <div className={styles.JobCard}>
            <div>
                <h3><Link to={`/job/${job.uuid}`}>{job.normalized_job_title || job.title}</Link></h3>
                <h4>{"Related Skills:"}</h4>
                <ul>

                    {relatedskillsList ?
                        relatedskillsList.map((skill: skill) => {
                            return (
                                <Link key={skill.skill_uuid} to={`/skill/${skill.skill_uuid}`}>
                                    <li>{skill.skill_name}</li>
                                </Link>
                            )
                        })
                        :
                        <Skeleton count={5} width={"31.33%"} height={"1.4rem"} style={{margin:"0.75% 1%"}}/>
                    }

                    {!!store?.skills?.byJobId[job.uuid] && !store?.skills?.byJobId[job.uuid].length &&
                        <li>{"No associated skills found"}</li>
                    }

                </ul>
            </div>

            <span><Link to={`/job/${job.uuid}`}>View Job details</Link></span>
        </div>
    )
})

const mapStateToProps = (state: store) => {
    return { store: state };
};

export default connect(mapStateToProps, { GET_RELATED_SKILLS })(JobCard);