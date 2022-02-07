export default function buildRoll(data, rollType, rollName) {
    let skillDice = 0;
    let statDice = 0;
    let skillName = "";
    let relSkillStat;
    let successNumber = 0;


    let dicePayload = {
        skillDice: 0,
        skillName: "",
        statDice: 0,
        statName: "",
        dp: 0,
        pd: 0,
        successNumber: 0,
        legendaryRank: 0,
        mind: 0
    }

    const items = data.items;
    const skills = data.data.data.skills;
    const stats = data.data.data.stats;
    const legendary = data.data.data.info.legendary.ranks;
    const mind = data.data.data.attributes.mind.currentValue;
    let pDefense = data.data.data.attributes.body.modified > 0 ? data.data.data.attributes.body.modified : data.data.data.attributes.body.pd;

    // get rollName and match it with the relevant skill from players skill list.
    for (let x in Object(skills)) {

        if (skills[x].name === rollName) {
            console.log(skills[x])
            skillName = skills[x].name;
            skillDice = skills[x].skillRank;
            relSkillStat = skills[x].statName;
            successNumber = skills[x].snMod
        }
    }

    for (let y in Object(stats)) {
        if (stats[y].name === relSkillStat) {
            statDice = stats[y].modified;
        }
    }

    dicePayload = {
        dp: data.data.data.attributes.addDicePool > 0 ? data.data.data.attributes.addDicePool : 0,
        pd: pDefense,
        skillDice: skillDice,
        skillName: skillName,
        successNumber: successNumber,
        statDice: statDice,
        statName: relSkillStat,
        legendaryRank: legendary,
        mind: mind
    }
    
    return dicePayload;
}
