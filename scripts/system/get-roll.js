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
    let totalDiceRoll = preppedRollData.totalDice;

    if (!preppedRollData.critical){ // base roll
      let baseRoll = await new Roll(`${totalDiceRoll}da`).evaluate({ async: true });

      let results = baseRoll.terms[0].results;
      results.sort((a, b) => (a.result - b.result));
      baseRoll.terms[0].results = results;
      roll = baseRoll;
      roll.type = "Base";
    }
    else { // critical dice
      let criticalRoll = await new Roll(`${totalDiceRoll}dbx12`).evaluate({ async: true });

      roll = criticalRoll;
      roll.type = "Critical";
    }

    return roll;
}

//  Make function to check for 12s.

  // let count12 = 0;
  // let explodingRoll;
  // results.find(v => {
  //   if (v.result === 12) {
  //     count12++;
  //   }
  // })

  // if (count12 > 0) {
  //   explodingRoll = await new Roll(`${count12}dbx12`).evaluate({ async: true })
  //   //console.log(explodingRoll)

  //   let explodingResults = explodingRoll.terms[0].results;
  //   //console.log(explodingResults)

  //   //explodingResults.sort((a, b) => (a.result - b.result));
  //   //console.log(explodingResults)

  //   explodingRoll.terms[0].results = explodingResults;
  //   //console.log(explodingRoll.terms[0])

  //   const rolls = [baseRoll, explodingRoll];
  //   const pool = PoolTerm.fromRolls(rolls);
  //   roll = Roll.fromTerms([pool])
  //   roll.type = "PoolTerm";
  // } else {
  //   roll = baseRoll;
  // }