export default async function getRoll(compiledRollData) {

    // rollData arguement comes in with the following information
    /***
    *   compiledRollData = {
    *       type: 
    *       specName: String
    *       specRank: Number
    *       skillName: String
    *       skillRank: Number
    *       statName: String
    *       statRank: Number
    *       legendary: Number
    *       mind: Number
    *       addDice: Number
    *       totalDice: Number
    *       successNumber: Number
    *       physicalDefense: Number
    *       physicalDefenseDetail: String
    *       critical: Boolean
    *   }
    ***/ 

    let preppedRollData = compiledRollData;

    let roll;

    if (!preppedRollData.critical){ // base roll
      let baseRoll = await new Roll("(@totalDice)da", preppedRollData).evaluate({ async: true });

      let results = baseRoll.terms[0].results;
      results.sort((a, b) => (a.result - b.result));
      baseRoll.terms[0].results = results;
      roll = baseRoll;
      roll.type = "Base";
    }
    else { // critical dice
      
      let criticalRoll = new Roll("(@totalDice)dbx12", preppedRollData).evaluate({ async: false });
      roll = criticalRoll;
      roll.type = "Critical";
    }

    return roll;
}