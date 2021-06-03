import Types from './Types';
import openSkillsApi from '../Apis/openSkillsApi';


export const GET_JOBS_SEARCH_RESULTS = (query: string) => {
    return async function (dispatch: any) {
        openSkillsApi.get(`/jobs/autocomplete?contains=${query}`)
            .then(({ data }: { data: suggestion[] }) => {
                let action: suggestionsAction = {
                    type: Types.GET_JOBS_SEARCH_RESULTS,
                    payload: {
                        list: data,
                        query,
                        isLoading : false
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
                            isLoading : false
                        }
                    }
                    dispatch(action);
                }
            })
    };
};

export const SET_SEARCH_LOADER = (bool : boolean) => {
    return async function (dispatch: any) {
        let action: suggestionsAction = {
            type: Types.SET_SEARCH_LOADER,
            payload: {
                list: [],
                isLoading : bool
            }
        }
        dispatch(action)
    };
};

export const CLEAR_JOBS_SEARCH_RESULTS = () => {
    return async function (dispatch: any) {
        dispatch({
            type: Types.CLEAR_JOBS_SEARCH_RESULTS
        })
    };
};