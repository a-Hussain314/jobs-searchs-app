// general 
type uuid = string;

// jobs
interface link {
    rel: string,
    href: string
};

interface job {
    uuid: uuid,
    parent_uuid?: uuid,
    title: string,
    normalized_job_title?: string,
    importance?: number,
    level?: number
};

interface jobAction {
    type: string,
    payload: job
};

interface jobsAction {
    type: string,
    payload: {
        list: job[],
        links?: link[],
        query?: string,
        jobId?: uuid,
        skillId?: uuid
    };
};

interface jobsState {
    byId: { [uuid: string]: job },
    homeJobs: uuid[],
    relatedByJobId: { [uuid: string]: uuid[] },
    relatedBySkillId: { [uuid: string]: job[] },
    allIds: uuid[],
    links?: link[]
    query?: string,
    total?: number,
    homeJobsLoading : boolean,
    jobPageLoading : boolean
};



// suggestions
interface suggestion {
    uuid: string,
    suggestion: string,
    normalized_job_title: string,
    parent_uuid: string
};

interface suggestionsAction {
    type: string,
    payload: {
        list: suggestion[],
        query?: string,
        isLoading?: bool
    };
};

interface suggestionsState {
    // yes, it's { [uuid: string]: job } not "suggestion", we parse "job" object from the dispatched "suggestion" action.
    allIds: uuid[],
    total?: number,
    query?: string
    isLoading? : boolean
};



// skills
interface skill {
    skill_uuid: uuid,
    uuid?: uuid,
    skill_name: string,
    description: string,
    normalized_skill_name: string,
    skill_type?: string,
    importance?: number,
    level?: number
};

interface skillAction {
    type: string,
    payload: skill
};

interface skillsAction {
    type: string,
    payload: {
        list: skill[],
        job?: job,
        skill?: skill,
        skillId?: string
    }
};

interface skillState {
    byJobId: { [uuid: string]: skill[] },
    bySkillId: { [uuid: string]: uuid[] },
    byId: { [uuid: string]: skill },
    allIds: string[]
};



// store
interface store {
    jobs: jobsState,
    jobSearchResults: jobsState,
    skills: skillState
};