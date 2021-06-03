import Types from './Types';
import openSkillsApi from '../Apis/openSkillsApi';


export const GET_JOBS = (pageUrl: string = "/jobs?offset=0&limit=12") => {
    return async function (dispatch: any) {
        openSkillsApi.get(pageUrl).then(({ data }) => {

            // seprate the jobs array last item becuase it is a links array, not a job object
            let action: jobsAction = {
                type: Types.GET_JOBS,
                payload: {
                    links: data.pop().links,
                    list: data,
                }
            }

            dispatch(action);
        }).catch((error) => {
            const err = { ...error }.response?.data?.error;
            if (err?.code === 404) {
                console.log(err);
                let action: jobsAction = {
                    type: Types.GET_JOBS,
                    payload: {
                        list: [],
                    }
                }
                dispatch(action);
            }
        });
    };
};


export const GET_SINGLE_JOB = (jobId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/jobs/${jobId}`).then(({ data }) => {
            let job: job = data;
            let action: jobAction = {
                type: Types.GET_SINGLE_JOB,
                payload: job
            }
            dispatch(action);
        }).catch((error) => {
            const err = { ...error }?.response?.data?.error;
            if (err?.code === 404) {
                console.log(err);
            }
        });
    };
};


export const GET_JOBS_SEARCH_RESULTS = (query: string) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/jobs/autocomplete?contains=${query}`)
            .then(({ data }: { data: suggestion[] }) => {
                let action: suggestionsAction = {
                    type: Types.GET_JOBS_SEARCH_RESULTS,
                    payload: {
                        list: data,
                        query
                    }
                }
                dispatch(action);
            })
            .catch((error) => {
                const err = { ...error }?.response?.data?.error;
                if (err?.code === 404) {
                    console.log(err);
                    let action: suggestionsAction = {
                        type: Types.GET_JOBS_SEARCH_RESULTS,
                        payload: {
                            list: [],
                            query,
                        }
                    }
                    dispatch(action);
                }
            })
    };
};


export const CLEAR_JOBS_SEARCH_RESULTS = () => {
    return async function (dispatch: any) {
        dispatch({
            type: Types.CLEAR_JOBS_SEARCH_RESULTS
        })
    };
};


export const GET_RELATED_JOBS = (jobId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/jobs/${jobId}/related_jobs`)
            .then(({ data }) => {
                let action: jobsAction = {
                    type: Types.GET_RELATED_JOBS,
                    payload: {
                        list: data.related_job_titles.slice(0, 12),
                        jobId
                    }
                };
                dispatch(action);
            }).catch((error) => {
                const err = { ...error }?.response?.data?.error;
                if (err?.code === 404) {
                    console.log(err);
                    let action: jobsAction = {
                        type: Types.GET_RELATED_JOBS,
                        payload: {
                            list: [],
                            jobId
                        }
                    }
                    dispatch(action);
                }
            })
    };
};


export const GET_RELATED_SKILLS = (jobId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/jobs/${jobId}/related_skills`).then(({ data }) => {
            let job: job = {
                title: data.job_title,
                normalized_job_title: data.normalized_job_title,
                uuid: data.job_uuid
            }
            let action: skillsAction = {
                type: Types.GET_RELATED_SKILLS,
                payload: {
                    job,
                    list: data.skills.slice(0, 6)
                }
            };
            dispatch(action);
        }).catch((error) => {
            const err = { ...error }?.response?.data?.error;
            if (err?.code === 404) {
                console.log(err);
                let job: job = {
                    uuid: jobId,
                    title: ""
                }
                let action: skillsAction = {
                    type: Types.GET_RELATED_SKILLS,
                    payload: {
                        job,
                        list: []
                    }
                };
                dispatch(action);
            }
        });

    };
};


export const GET_SINGLE_SKILL = (skillId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/skills/${skillId}`).then(({ data }) => {
            let skill: skill = {
                skill_uuid: data.uuid,
                ...data
            }
            let action: skillAction = {
                type: Types.GET_SINGLE_SKILL,
                payload: { ...skill }
            };
            dispatch(action);
        }).catch((error) => {
            const err = { ...error }?.response?.data?.error;
            if (err?.code === 404) {
                console.log(err);
            }
        });

    };
};


export const GET_SKILL_RELATED_SKILLS = (skillId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/skills/${skillId}/related_skills`).then(({ data }) => {
            let skills: skill[] = data.skills;

            let action: skillsAction = {
                type: Types.GET_SKILL_RELATED_SKILLS,
                payload: {
                    list: skills,
                    skillId
                }
            };
            dispatch(action);
        }).catch((error) => {
            const err = { ...error }?.response?.data?.error;
            if (err?.code === 404) {
                let action: skillsAction = {
                    type: Types.GET_SKILL_RELATED_SKILLS,
                    payload: {
                        list: [],
                        skillId
                    }
                };
                dispatch(action);
            }
        });

    };
};


export const GET_SKILL_RELATED_JOBS = (skillId: uuid) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/skills/${skillId}/related_jobs`)
            .then(({ data }) => {
                let action: jobsAction = {
                    type: Types.GET_SKILL_RELATED_JOBS,
                    payload: {
                        list: data.jobs.slice(0, 12),
                        skillId
                    }
                };
                dispatch(action);
            }).catch((error) => {
                const err = { ...error }?.response?.data?.error;
                if (err?.code === 404) {
                    console.log(err);
                    let action: jobsAction = {
                        type: Types.GET_SKILL_RELATED_JOBS,
                        payload: {
                            list: [],
                            skillId
                        }
                    };
                    dispatch(action);
                }
            })
    };
};