export default function buildRoll(data, rollData) {
    let buildRollData = rollData

    // rollData argument comes in with the following information
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
    //console.log("There is the buildRoll Data");
    
    let actorData = data.actor.system;
    const skills = actorData.skills;
    const stats = actorData.stats;
    const legendary = actorData.info.legendary.ranks;
    const mind = actorData.attributes.mind.currentValue;
    const specialization = data.items.filter(i => i.type === "specialization")
    let pDefense = actorData.attributes.body.modified > 0 ? actorData.attributes.body.modified : actorData.attributes.body.pd;
    // get rollName and match it with the relevant skill from players skill list.
    switch (rollData.type) {
        case "stat":
            for (let s in Object(stats)) {
                if (stats[s].name === undefined) {
                    continue;
                }
                
                if (stats[s].name.toLowerCase() === buildRollData.statName) {
                    buildRollData.successNumber = stats[s].snMod
                }
            }
            break;
        case "skill":
            for (let x in Object(skills)) {
                if (skills[x].name === buildRollData.skillName) {
                    buildRollData.successNumber = skills[x].snMod
                }
            }
            break;
        case "specialization":
            for (let p in Object(specialization)) {
                if (specialization[p].name === buildRollData.specName) {
                    buildRollData.successNumber = Number(specialization[p].system.modifier.sn.value);
                }
            }
            break;
    }

    buildRollData.legendary = legendary;

    buildRollData.mind = mind;

    buildRollData.totalDice = rollData.statRank + Number(rollData.addDice) + (rollData.type === "specialization" ? rollData.specRank : rollData.skillRank);
    buildRollData.physicalDefense = pDefense
    buildRollData.critical = false;
    return buildRollData;
}
