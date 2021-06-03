import Types from './Types';
import openSkillsApi from '../Apis/openSkillsApi';
import history from '../utility/history';


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
                history.push("/404")
            }
        });
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