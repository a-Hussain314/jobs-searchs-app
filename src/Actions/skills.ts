import Types from './Types';
import openSkillsApi from '../Apis/openSkillsApi';
import history from '../utility/history';


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
                history.push("/404")
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