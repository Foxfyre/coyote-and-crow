/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */

//import { migration } from "../../module/migration.js";

export class cncActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    _preCreate(data) {
    }

    prepareBaseData() {
        this._initData();

    }

    prepareEmbeddedEntities() {
    }

    prepareDerivedData() {
        const actorData = this.data;
        const data = actorData.data;
        let pathData;

        data.attributes.init.score = data.stats.agility.value + data.stats.perception.value + data.stats.charisma.value;
        data.attributes.body.pd = data.stats.agility.value + data.stats.endurance.value;
        data.attributes.mind.md = data.stats.perception.value + data.stats.wisdom.value;
        data.attributes.soul.sd = data.stats.charisma.value + data.stats.will.value;
        data.attributes.body.value = data.stats.strength.value + data.stats.agility.value + data.stats.endurance.value;
        data.attributes.mind.value = data.stats.intelligence.value + data.stats.perception.value + data.stats.wisdom.value;
        data.attributes.soul.value = data.stats.spirit.value + data.stats.charisma.value + data.stats.will.value;
        data.attributes.init.total = data.attributes.init.score + data.attributes.init.modified;

        // Add any modifiers from items to the stat value;
        for (let r of Object.values(data.stats)) {
            r.modified = r.value + r.modified
        }
        if (this.type === "character" || this.type === "npc") {

            /*fetch('/systems/coyote-and-crow/scripts/data/path.json')
                .then(response => response.json())
                .then(data => {
                    pathData = data;
                    console.log(pathData);
                    this._setPath(actorData, pathData);
                })*/
            /*getPathJSON().then(pathData => {
                
            })*/
            this._setPath(actorData);
            this._deriveItemModifiers(actorData);
            this._calcTotalSkills()
        }
    }

    _initData() {
        this.data.data.attributes.body.pd = 0;
        this.data.data.attributes.mind.md = 0;
        this.data.data.attributes.soul.sd = 0;
        this.data.data.attributes.init.score = 0;
        this.data.data.attributes.addDicePool = 0;
    }

    _deriveItemModifiers(actorData) {
        let items = actorData.items;
        let armorGroup = 0;
        let diceGroup = 0;
        let actorStats = actorData.data.stats;
        let actorSkills = this.data.data.skills;
        let actorAttributes = this.data.data.attributes;
        let initiative;



        for (let x of items) {
            if (!x) { return }

            if (x.data.type === "specialization") { continue }
            
            if (x.data.type === "weapon" || x.data.type === "armor") {
                if (x.data.data.equipped === false) {
                    continue;
                }
            }
            if (x.data.type !== "ability") {
                if (x.data.data.modifier.init.value !== 0) {
                    let itemInit = x.data.data.modifier.init.value;
                    let initMod = actorData.data.attributes.init.score;
                    this.data.data.attributes.init.modified = itemInit + initMod;
                }
            }
            
            if (x.data.type === "weapon" && x.data.data.weaponTypes !== "") {
                let weaponType = x.data.data.weaponTypes; // get weapon type from item
                let dp = x.data.data.modifier.dp.value;   // get value of dp from item
                //actorSkills = actorData.data;
                let weaponSkill = actorSkills[weaponType].skillRank;  // get skill rank of weaponskill
                if (dp > weaponSkill) { dp = weaponSkill; }
                this.data.data.skills[weaponType].addDice = dp;
            }

            // cycle through the stat object, record the modifier on the item, pull actor stat value, add & write to actor. Valid on all items
            if (x.data.type === "ability") { continue }

            let armorPdMod = x.data.data.modifier.pd.value ? x.data.data.modifier.pd.value : 0;
            armorGroup += armorPdMod;

            const derivedStats = ["body", "mind", "soul"];
            const stats = ["agility", "charisma", "endurance", "intelligence", "perception", "spirit", "strength", "wisdom", "will"]

            for (let s of Object.values(x.data.data.modifier.stat)) {
                let itemStatName = s.name.toLowerCase();
                //console.log(itemStatName)
                if (s.value !== 0 && stats.includes(itemStatName)) {
                    actorStats[itemStatName].modified += s.value;
                } else if (derivedStats.includes(itemStatName)) {
                    actorAttributes[itemStatName].statMod += s.value;
                    actorAttributes[itemStatName].itemModified = actorAttributes[itemStatName].statMod + actorAttributes[itemStatName].value;
                }
            }

            // cycle through sn, record the skill and value, pull actor skill value, add & write to actor, valid on all items
            let snGroup = {
                sn: x.data.data.modifier.sn,
                sn1: x.data.data.modifier.sn1,
                sn2: x.data.data.modifier.sn2
            }

            let snStatGroup = {
                snStat1: x.data.data.modifier.snStat1,
                snStat2: x.data.data.modifier.snStat2,
                snStat3: x.data.data.modifier.snStat3,
                snStat4: x.data.data.modifier.snStat4,
                snStat5: x.data.data.modifier.snStat5,
                snStat6: x.data.data.modifier.snStat6,
                snStat7: x.data.data.modifier.snStat7,
                snStat8: x.data.data.modifier.snStat8,
            }

            let specGroup = {
                sn: x.data.data.modifier.sn
            }

            /*if (x.data.type === "specialization") {
                console.log(x)
            }*/

            for (let n of Object.values(snGroup)) {
                if (n.skill.length === 0) { continue; }
                let skillNameArr = n.skill.split(' ');
                let skillName = skillNameArr[0].toLowerCase();
                let itemSNValue = Number(n.value);
                let itemSNSkill = n.skill.toLowerCase();
                let skillSNMod = Number(actorSkills[skillName].snMod);
                skillSNMod += itemSNValue;
                actorSkills[skillName].snMod = Number(skillSNMod);
            }

            for (let n of Object.values(snStatGroup)) {
                if (n.value == 0 || n.statName === "") { continue; }
                let statName = n.statName.toLowerCase();
                let itemSNValue = Number(n.value);
                let statSNMod = Number(actorStats[statName].snMod);
                statSNMod = itemSNValue;
                actorStats[statName].snMod = Number(statSNMod);
            }

            this.data.data.attributes = actorAttributes // consolidate the other two into this. 
            this.data.data.stats = actorStats;
            this.data.data.attributes.addDicePool = diceGroup;
            this.data.data.attributes.body.modified = armorGroup + this.data.data.attributes.body.pd;
        }
    }

    _calcTotalSkills() {
        const skilledTests = ["Ceremony", "Cybernetics", "Herbalism", "Language", "Medicine", "Science"];
        for (let skillKey in this.data.data.skills) {
            let skill = this.data.data.skills[skillKey]
            let stat = this.data.data.skills[skillKey].stat;
            this._setSkillName(skill, skillKey);
            let skillModValue = this._skillMod(stat);
            let weaponDPMod = this.data.data.skills[skillKey].addDice ? this.data.data.skills[skillKey].addDice : 0;
            skill.statRank = skillModValue
            !this.data.data.skills[skillKey].dicePoolMod ? this.data.data.skills[skillKey].dicePoolMod = 0 : null;


            if (skill.name === "Knowledge" && skill.skillRank > 1) {
                ui.notifications ? ui.notifications.warn(game.i18n.format("WARN.KnowledgeMax", { name: this.name })) : null;
            }
            skill.skillRank = 0 + this.data.data.skills[skillKey].skillRank;
            skill.skillTotal = 0 + skillModValue + this.data.data.skills[skillKey].skillRank + this.data.data.skills[skillKey].dicePoolMod;
            // 0 out skilled only skills if no skill rank present. Prevents confusion on character sheet.
            if (skilledTests.includes(skill.name) === true && skill.skillRank === 0) {
                skill.skillTotal = 0;
            }


            skill.dicePoolMod = weaponDPMod + skill.skillTotal;
        }
    }

    _setSkillName(skill, skillKey) {
        switch (skill.stat) {
            case "strength":
                this.data.data.skills[skillKey].statName = "Strength";
                break;
            case "agility":
                this.data.data.skills[skillKey].statName = "Agility";
                break;
            case "endurance":
                this.data.data.skills[skillKey].statName = "Endurance";
                break;
            case "intelligence":
                this.data.data.skills[skillKey].statName = "Intelligence";
                break;
            case "perception":
                this.data.data.skills[skillKey].statName = "Perception";
                break;
            case "wisdom":
                this.data.data.skills[skillKey].statName = "Wisdom";
                break;
            case "spirit":
                this.data.data.skills[skillKey].statName = "Spirit";
                break;
            case "charisma":
                this.data.data.skills[skillKey].statName = "Charisma";
                break;
            case "will":
                this.data.data.skills[skillKey].statName = "Will";
                break;
        }
    }


    _skillMod(stat) {
        switch (stat) {
            case "strength":
                return this.data.data.stats.strength.modified;
            case "agility":
                return this.data.data.stats.agility.modified;
            case "endurance":
                return this.data.data.stats.endurance.modified;
            case "intelligence":
                return this.data.data.stats.intelligence.modified;
            case "perception":
                return this.data.data.stats.perception.modified;
            case "wisdom":
                return this.data.data.stats.wisdom.modified;
            case "spirit":
                return this.data.data.stats.spirit.modified;
            case "charisma":
                return this.data.data.stats.charisma.modified;
            case "will":
                return this.data.data.stats.will.modified;
        }
    }



    _setPath(actorData) {

        switch (actorData.data.info.path.value) {
            case "badger":
                actorData.data.info.path.name = "Badger";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    },
                    "stat2": {
                        "name": "Will",
                        "value": "will"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "intelligence": "Intelligence",
                    "will": "Will"
                }
                return actorData;
            case "bear":
                actorData.data.info.path.name = "Bear";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Charisma",
                        "value": "charisma"
                    },
                    "stat2": {
                        "name": "Strength",
                        "value": "strength"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "charisma": "Charisma",
                    "strength": "Strength"
                }
                return actorData;
            case "beaver":
                actorData.data.info.path.name = "Beaver";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Endurance",
                        "value": "endurance"
                    },
                    "stat2": {
                        "name": "Perception",
                        "value": "perception"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "endurance": "Endurance",
                    "perception": "Perception"
                }
                return actorData;
            case "bison":
                actorData.data.info.path.name = "Bison";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Strength",
                        "value": "strength"
                    },
                    "stat2": {
                        "name": "Will",
                        "value": "will"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "strength": "Strength",
                    "will": "Will"
                }
                return actorData;
            case "coyote":
                actorData.data.info.path.name = "Coyote";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Agility",
                        "value": "agility"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "agility": "Agility",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "crow":
                actorData.data.info.path.name = "Crow";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Spirit",
                        "value": "spirit"
                    },
                    "stat2": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "spirit": "Spirit",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "deer":
                actorData.data.info.path.name = "Deer";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    },
                    "stat2": {
                        "name": "Charisma",
                        "value": "charisma"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "wisdom": "Wisdom",
                    "charisma": "Charisma"
                }
                return actorData;
            case "eagle":
                actorData.data.info.path.name = "Eagle";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Strength",
                        "value": "strength"
                    },
                    "stat2": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "strength": "Strength",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "falcon":
                actorData.data.info.path.name = "Falcon";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Perception",
                        "value": "perception"
                    },
                    "stat2": {
                        "name": "Spirit",
                        "value": "spirit"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "perception": "Perception",
                    "spirit": "Spirit"
                }
                return actorData;
            case "fox":
                actorData.data.info.path.name = "Fox";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Agility",
                        "value": "agility"
                    },
                    "stat2": {
                        "name": "Spirit",
                        "value": "spirit"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "agility": "Agility",
                    "spirit": "Spirit"
                }
                return actorData;
            case "owl":
                actorData.data.info.path.name = "Owl";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Endurance",
                        "value": "endurance"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "endurance": "Endurance",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "raccoon":
                actorData.data.info.path.name = "Raccoon";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Charisma",
                        "value": "charisma"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "charisma": "Charisma",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "salmon":
                actorData.data.info.path.name = "Salmon";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Will",
                        "value": "will"
                    },
                    "stat2": {
                        "name": "Agility",
                        "value": "agility"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "will": "Will",
                    "agility": "Agility"
                }
                return actorData;
            case "snake":
                actorData.data.info.path.name = "Snake";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Spirit",
                        "value": "spirit"
                    },
                    "stat2": {
                        "name": "Endurance",
                        "value": "endurance"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "spirit": "Spirit",
                    "endurance": "Endurance"
                }
                return actorData;
            case "spider":
                actorData.data.info.path.name = "Spider";
                actorData.data.info.path.stats = {
                    "stat1": {
                        "name": "Perception",
                        "value": "perception"
                    },
                    "stat2": {
                        "name": "Strength",
                        "value": "strength"
                    }
                }
                actorData.data.info.path.allowedStats = {
                    "perception": "Perception",
                    "strength": "Strength"
                }
                return actorData;
            case "default":
                console.log("ERROR Path not set");
                break;
        }

    }



}

/*async function getPathJSON() {
    const response = await fetch('/systems/coyote-and-crow/scripts/data/path.json');
    const pathData = await response.json();

    return pathData;
}*/