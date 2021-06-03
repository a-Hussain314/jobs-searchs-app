import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_SKILL_RELATED_SKILLS, GET_SINGLE_SKILL } from '../../Actions/skills';
import { GET_SKILL_RELATED_JOBS } from '../../Actions/jobs';
import SideList from '../../components/Lists/SideList';
import RelatedInfoCard from '../../components/cards/RelatedInfoCard';
import styles from './Skill.module.scss';
import Skeleton from 'react-loading-skeleton';

type props = {
    match: any,
    store: store,
    GET_SINGLE_SKILL: (id: uuid) => void,
    GET_SKILL_RELATED_SKILLS: (id: uuid) => void,
    GET_SKILL_RELATED_JOBS: (id: uuid) => void
}

const SkillPage: React.FC<props> = ({ match, store, GET_SKILL_RELATED_SKILLS, GET_SKILL_RELATED_JOBS, GET_SINGLE_SKILL }) => {

    useEffect(() => {

        if(!store.skills.byId[match.params.id]?.description){
            GET_SINGLE_SKILL(match.params.id);
        }

        // fetch the skill data & its related skills data 
        if (!store.skills.bySkillId[match.params.id]) {
            GET_SKILL_RELATED_SKILLS(match.params.id)
        }

        if (!store.jobs.relatedBySkillId[match.params.id]) {
            GET_SKILL_RELATED_JOBS(match.params.id);
        }

    }, [
        match.params.id,
        store.skills.byId,
        store.skills.bySkillId,
        store.jobs.relatedBySkillId,
        GET_SINGLE_SKILL,
        GET_SKILL_RELATED_SKILLS,
        GET_SKILL_RELATED_JOBS,
    ])


    let listItems: React.ReactNode[] = store.skills.bySkillId[match.params.id]?.map((id: uuid) => {
        return (
            <li key={id}>
                <Link to={`/skill/${id}`}>{store.skills.byId[id]?.skill_name}</Link>
            </li>
        )
    })
    return (
        <div className={"page_content"}>
            <div className={"container"}>
                {store.skills.byId[match.params.id] ?
                    <>
                        <h1>{store.skills.byId[match.params.id]?.skill_name}</h1>
                        <div className={styles.skillContainer}>
                            <div className={styles.skillDetails}>

                                <h3>Description:</h3>
                                <p>{store.skills.byId[match.params.id]?.description || "No Description Available"}</p>

                                <h3>Related Jobs:</h3>
                                {store.jobs.relatedBySkillId[match.params.id] ?
                                    store.jobs.relatedBySkillId[match.params.id].length ?
                                        store.jobs.relatedBySkillId[match.params.id].map((job: any) => {

                                            let parsedJob: job = {
                                                uuid: job.job_uuid,
                                                title: job.job_title,
                                                normalized_job_title: job.job_title,
                                                importance: job.importance,
                                                level: job.level
                                            }
                                            return (
                                                <RelatedInfoCard
                                                    key={parsedJob.uuid}
                                                    href={`/job/${parsedJob.uuid}`}
                                                    title={parsedJob.title}
                                                    listData={{
                                                        ...(!!parsedJob.importance && { Importance: parsedJob.importance }),
                                                        ...(!!parsedJob.level && { Level: parsedJob.level }),
                                                    }}
                                                />
                                            )
                                        })
                                        :
                                        <p>No associated jobs found</p>
                                    :
                                    <>
                                        <Skeleton height="7.5rem" count={5} style={{ margin: "0.5rem 0" }} />
                                    </>
                                }
                            </div>
                            <div className={styles.skillSideList}>
                                <SideList
                                    title={"Related Skills:"}
                                    listItems={listItems?.length ? listItems : null}
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
        </div >
    )
}

const mapStateToProps = (state: any) => {
    return { store: state };
};

export default connect(mapStateToProps, { GET_SKILL_RELATED_SKILLS, GET_SKILL_RELATED_JOBS, GET_SINGLE_SKILL })(SkillPage);