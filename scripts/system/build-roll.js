export default function buildRoll(data, rollData) {
    let buildRollData = rollData

    // rollData arguement comes in with the following information
    /***
    *   rollData = {
    *       type: 
    *       specName: 
    *       specRank: 
    *       skillName: 
    *       skillRank: 
    *       statName: 
    *       statRank:
    *       legendary:
    *       mind:
    *       addDice:
    *       totalDice:
    *       successNumber:
    *       physicalDefense:
    *       physicalDefenseDetail:
    *   }
    ***/
 
    const skills = data.data.data.skills;
    const legendary = data.data.data.info.legendary.ranks;
    const mind = data.data.data.attributes.mind.currentValue;
    let pDefense = data.data.data.attributes.body.modified > 0 ? data.data.data.attributes.body.modified : data.data.data.attributes.body.pd;
    // get rollName and match it with the relevant skill from players skill list.
    for (let x in Object(skills)) {

        if (skills[x].name === buildRollData.skillName) {
            buildRollData.successNumber = skills[x].snMod
        }
    }

    buildRollData.legendary = legendary;
    buildRollData.mind = mind;
    if (rollData.type === "specialization") {
        buildRollData.totalDice = rollData.specRank + rollData.statRank + Number(rollData.addDice);
    } else {
        buildRollData.totalDice = rollData.specRank + rollData.skillRank + rollData.statRank + Number(rollData.addDice);
    }
    buildRollData.physicalDefense = pDefense
    return buildRollData;
}
