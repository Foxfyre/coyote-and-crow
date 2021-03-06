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
    *       statSuccessNumber:
    *       physicalDefense:
    *       physicalDefenseDetail:
    *   }
    ***/
 
    const skills = data.data.data.skills;
    const stats = data.data.data.stats;
    const legendary = data.data.data.info.legendary.ranks;
    const mind = data.data.data.attributes.mind.currentValue;
    const specialization = data.items.filter(i => i.type === "specialization")
    let pDefense = data.data.data.attributes.body.modified > 0 ? data.data.data.attributes.body.modified : data.data.data.attributes.body.pd;
    // get rollName and match it with the relevant skill from players skill list.
    for (let x in Object(skills)) {
        if (skills[x].name === buildRollData.skillName) {
            buildRollData.successNumber = skills[x].snMod
        }
    }

    for (let s in Object(stats)) {
        if (stats[s].name.toLowerCase() === buildRollData.statName) {
            buildRollData.statSuccessNumber = stats[s].snMod
        }
    }

    if (rollData.type === "specialization") {
        for (let p in Object(specialization)) {
            if (specialization[p].name === buildRollData.specName) {
                buildRollData.successNumber = Number(specialization[p].data.modifier.sn.value);
            }
            //console.log(specialization);
            //console.log(p)
        }
    }

    buildRollData.legendary = legendary;

    buildRollData.mind = mind;

    if (rollData.type === "specialization") {
        buildRollData.totalDice = rollData.specRank + rollData.skillRank + rollData.statRank + Number(rollData.addDice);
    } else {
        buildRollData.totalDice = rollData.specRank + rollData.skillRank + rollData.statRank + Number(rollData.addDice);
    }
    buildRollData.physicalDefense = pDefense
    return buildRollData;
}
