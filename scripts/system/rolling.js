export default function buildRoll(data, rollType, rollName) {
    let skillDice = 0;
    let statDice = 0;
    let relSkillStat;
    let itemModType;
    let itemModName;
    let itemModValue;

    console.log(data);

    const items = data.items;
    const skills = data.data.data.skills;
    const stats = data.data.data.stats;

    for (let x in Object(skills)) {
        if (skills[x].name === rollName) {
            skillDice = skills[x].rank;
            relSkillStat = skills[x].statName;
        }
    }

    for (let y in Object(stats)) {
        if (stats[y].name === relSkillStat) {
            statDice = stats[y].value;
        }
    }

    for (let item in items) {
        console.log(items[item]);
        if (item.type === "item"){

        }
    }

    let dicePayload = {
        skill: skillDice,
        stat: statDice,
        modifiers: {
            dp: 0,
            pd: 0,
            sn: 0,
            sn1: 1,
            sn2: 2,
            stat: {
                agi: 0,
                end: 0
            }
        }
    }
    return dicePayload;
}