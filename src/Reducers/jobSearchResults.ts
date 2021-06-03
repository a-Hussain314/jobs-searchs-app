import Types from '../Actions/Types';

const initState: suggestionsState = {
    allIds: [],
    isLoading: false,
    query: "",
    total: 0
};

const jobSearchResults = (state = initState, action: suggestionsAction) => {
    if (action.type === Types.GET_JOBS_SEARCH_RESULTS) {

        // normalizethe jobs state
        let allIds: uuid[] = state.allIds = [];

        action.payload.list?.slice(0, 12).forEach((suggestion: suggestion) => {
            // parse "job" object from "suggestion" object.
            let parsedJob: job = {
                uuid: suggestion.uuid,
                title: suggestion.suggestion,
                normalized_job_title: suggestion.normalized_job_title,
                parent_uuid: suggestion.parent_uuid
            }

            if (!allIds.find(i => i === parsedJob.uuid)) {
                allIds.push(parsedJob.uuid);
            }
        });

        let newState: suggestionsState = {
            ...state,
            allIds,
            query: action.payload.query,
            total: allIds.length,
            isLoading : action.payload.isLoading
        };

        return newState;
    }
    else if (action.type === Types.CLEAR_JOBS_SEARCH_RESULTS) {

        let newState: suggestionsState = {
            ...state,
            allIds: [],
            query: "",
            total: 0
        };

        return newState;
    }
    else if (action.type === Types.SET_SEARCH_LOADER) {
        let newState: suggestionsState = {
            ...state,
            isLoading :action.payload.isLoading
        };
        return newState
    }
    else {
        return state;
    };
};

export default jobSearchResults;