import Types from '../Actions/Types';

const initState: skillState = {
    byJobId: {},
    bySkillId: {},
    byId: {},
    allIds: []
}

const skills = (state = initState, action: any) => {

    switch (action.type) {

        case Types.GET_RELATED_SKILLS: {
            let skillsAction: skillsAction = action;
            // normalizethe skills state
            let byJobId: { [uuid: string]: skill[] } = state.byJobId;
            let byId: { [uuid: string]: skill } = state.byId;
            let allIds: uuid[] = state.allIds;

            if (skillsAction.payload.job) {
                byJobId[skillsAction.payload.job.uuid] = action.payload.list;
            }

            skillsAction.payload.list.forEach((skill: skill) => {
                // don't add the "importance" and the "level" in "byId" array, its a job related skill property
                let genericSkill = { ...skill };
                delete genericSkill.importance;
                delete genericSkill.level;
                byId[skill.skill_uuid] = genericSkill;

                // make sure not to re-add skill uuid if already exists
                if (allIds.indexOf(genericSkill.skill_uuid) === -1) {
                    allIds.push(genericSkill.skill_uuid);
                }

            })

            let newState: skillState = {
                ...state,
                byJobId,
                byId,
                allIds
            }

            return newState;
        }

        case Types.GET_SINGLE_SKILL: {
            console.log(action)
            let skillAction: skillAction = action;
            let byId: { [uuid: string]: skill } = state.byId;
            let allIds: uuid[] = state.allIds;

            byId[skillAction.payload.skill_uuid] = skillAction.payload;
            allIds.push(skillAction.payload.skill_uuid);

            let newState: skillState = {
                ...state,
                byId,
                allIds
            }

            return newState
        }

        case Types.GET_SKILL_RELATED_SKILLS: {
            let skillsAction: skillsAction = action;

            // normalize the skills state
            let byId: { [uuid: string]: skill } = state.byId;
            let allIds: uuid[] = state.allIds;
            let bySkillId: { [uuid: string]: uuid[] } = state.bySkillId;

            // initiate a list to hold al the related skills Ids
            let relatedSkillsIdList: uuid[] = [];

            skillsAction.payload.list.forEach((skill: skill) => {

                let id: uuid = skill.uuid || skill.skill_uuid;

                // add it tothe global skills list
                if(!byId[id]){
                    byId[id] = skill;
                }

                // to prevent duplicate records, in case of skill related to more than one skill
                if (!allIds.find(i => i === id)) {
                    allIds.push(id);
                }

                // push the current skill id to the related skill id list
                relatedSkillsIdList.push(id);

            })

            // because "skillId" is an optional property in "skillsAction" type.
            if (skillsAction.payload.skillId) {
                bySkillId[skillsAction.payload.skillId] = relatedSkillsIdList;
            }

            let newState: skillState = {
                ...state,
                byId,
                allIds,
                bySkillId
            }

            return newState;
        }

        default: {
            return state
        }

    }

};

export default skills;