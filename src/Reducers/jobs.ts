import Types from '../Actions/Types';

const initState: jobsState = {
    byId: {},
    homeJobs: [],
    relatedByJobId: {},
    relatedBySkillId: {},
    allIds: [],
    links: [],
    total: 0,
    homeJobsLoading : true,
    jobPageLoading : true
}
const jobs = (state = initState, action: any) => {
    switch (action.type) {

        case Types.GET_JOBS: {
            let jobsAction: jobsAction = action;
            // extracting the total jobs count from the last page link offset ("/jobs?offset=46275&limit=12").
            let lastPageLink = jobsAction.payload.links?.find((link: { rel: string }) => link.rel === "last") || { href: "0" };
            let total = parseInt(lastPageLink.href.slice(lastPageLink.href.indexOf("=") + 1)) + 12;

            // normalize the jobs state
            let homeJobs: uuid[] = state.homeJobs;
            let byId: { [uuid: string]: job } = state.byId;
            let allIds: uuid[] = state.allIds;

            // add every job object as "value" to its id as a "key" to the "byId" object.
            // add each job id to the "allIds" array
            jobsAction.payload.list?.forEach((job: job) => {

                // add it to the global jobs list
                byId[job.uuid] = job;

                homeJobs.push(job.uuid);
                allIds.push(job.uuid);
            })

            let newState: jobsState = {
                ...state,
                byId,
                homeJobs,
                homeJobsLoading :false,
                allIds,
                links: jobsAction.payload.links,
                total
            }

            return newState
        };

        case Types.GET_SINGLE_JOB: {
            let jobAction: jobAction = action;

            let byId: { [uuid: string]: job } = state.byId;
            let allIds: uuid[] = state.allIds;

            // no need to check if it's already exsists, because if it is exist, 
            // we don't even dispatch the action in the first place in [job page]

            // add it to the global jobs list
            byId[jobAction.payload.uuid] = jobAction.payload;

            allIds.push(jobAction.payload.uuid);

            let newState: jobsState = {
                ...state,
                byId,
                jobPageLoading : false,
                allIds
            }
            return newState
        };

        case Types.GET_JOBS_SEARCH_RESULTS: {
            let jobsAction: suggestionsAction = action;

            // normalizethe jobs state
            let byId: { [uuid: string]: job } = state.byId;
            let allIds: uuid[] = state.allIds;

            jobsAction.payload.list?.forEach((suggestion: suggestion) => {
                // becuase its a suggestion object originally.
                // and we cache it in jobs state to not have to refetch it if user visits its page
                let parsedJob: job = {
                    uuid: suggestion.uuid,
                    title: suggestion.suggestion,
                    normalized_job_title: suggestion.normalized_job_title,
                    parent_uuid: suggestion.parent_uuid
                }

                // add it to the global jobs list
                byId[parsedJob.uuid] = parsedJob;

                // to prevent duplicate records, in case repeated search for the same "seach Query" in the same session
                if (!allIds.find(i => i === parsedJob.uuid)) {
                    allIds.push(parsedJob.uuid);
                }
            })

            let newState: jobsState = {
                ...state,
                byId,
                allIds
            }

            return newState
        };

        case Types.GET_RELATED_JOBS: {
            let jobsAction: jobsAction = action;

            // normalizethe jobs state
            let byId: { [uuid: string]: job } = state.byId;
            let relatedByJobId: { [uuid: string]: uuid[] } = state.relatedByJobId;
            let allIds: uuid[] = state.allIds;

            // initiate a list to hold al the related jobs Ids
            let relatedJobsIdList: uuid[] = [];

            jobsAction.payload.list?.forEach((job: job) => {
                // add it to the global jobs list
                byId[job.uuid] = job;

                // to prevent duplicate records, in case of job related to more than one job
                if (!allIds.find(i => i === job.uuid)) {
                    allIds.push(job.uuid);
                }

                // push the current job id to the related jobs id list
                relatedJobsIdList.push(job.uuid);

            })

            // because "jobId" is an optional property in "jobsAction" type.
            if (jobsAction.payload.jobId) {
                relatedByJobId[jobsAction.payload.jobId] = relatedJobsIdList;
            }

            let newState: jobsState = {
                ...state,
                byId,
                allIds,
                relatedByJobId
            }

            return newState
        }
        case Types.GET_SKILL_RELATED_JOBS: {
            let jobsAction: jobsAction = action;

            // normalizethe jobs state
            let byId: { [uuid: string]: job } = state.byId;
            let relatedBySkillId: { [uuid: string]: job[] } = state.relatedBySkillId;
            let allIds: uuid[] = state.allIds;

            jobsAction.payload.list?.forEach((job: any) => {
                let parsedJob: job = {
                    uuid: job.job_uuid,
                    title: job.job_title,
                    normalized_job_title: job.job_title,
                }

                // add it to the global jobs list
                byId[job.job_uuid] = parsedJob

                // to prevent duplicate records, in case of job relatedto more than one job
                if (!allIds.find(i => i === job.job_uuid)) {
                    allIds.push(job.job_uuid);
                }
            })

            // because "jobId" is an optional property in "jobsAction" type.
            if (jobsAction.payload.skillId) {
                relatedBySkillId[jobsAction.payload.skillId] = jobsAction.payload.list;
            }

            let newState: jobsState = {
                ...state,
                byId,
                allIds,
                relatedBySkillId
            }

            return newState
        }
        default:
            return state
    }

}

export default jobs;