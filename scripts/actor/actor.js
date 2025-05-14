/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */

//import { migration } from "../../module/migration.js";

export class cncActor extends Actor {
    prepareData() {
    }

    _preCreate(data) {
        //console.log(data);
        let createData = {};
        if (!data.token) {
          foundry.utils.mergeObject(createData,
            {
              "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,    // Default display name to be on owner hover
              "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,    // Default display bars to be on owner hover
              "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,         // Default disposition to neutral
              "token.name": data.name,                                       // Set token name to actor name
            }
          )
        } else if (data.token) {
          createData.token = data.token
        }
    
        if (data.type == "character" ||  data.type == "npc") {
          createData.token.vision = true;
          createData.token.actorLink = true;
        }
        // changed from this.data.update(createData) to this.update(createDate);
        this.updateSource(createData);
    }

    prepareBaseData() {
        this._initData();

    }

    prepareEmbeddedEntities() {
    }

    prepareData() {
        const newSystem = this.system;
        newSystem.items = this.items;
        console.log(newSystem);
        newSystem.attributes.init.score = newSystem.stats.agility.value + newSystem.stats.perception.value + newSystem.stats.charisma.value;
        newSystem.attributes.body.pd = newSystem.stats.agility.value + newSystem.stats.endurance.value;
        newSystem.attributes.mind.md = newSystem.stats.perception.value + newSystem.stats.wisdom.value;
        newSystem.attributes.soul.sd = newSystem.stats.charisma.value + newSystem.stats.will.value;
        newSystem.attributes.body.value = newSystem.stats.strength.value + newSystem.stats.agility.value + newSystem.stats.endurance.value;
        newSystem.attributes.mind.value = newSystem.stats.intelligence.value + newSystem.stats.perception.value + newSystem.stats.wisdom.value;
        newSystem.attributes.soul.value = newSystem.stats.spirit.value + newSystem.stats.charisma.value + newSystem.stats.will.value;
        newSystem.attributes.init.total = newSystem.attributes.init.score + newSystem.attributes.init.modified;

        // Add any modifiers from items to the stat value;
        for (let r of Object.values(newSystem.stats)) {
            r.modified = r.value + r.modified
        }
        if (this.type === "character" || this.type === "npc") {
            this._setPath(newSystem);
            this._deriveItemModifiers(newSystem.items, newSystem);
            this._calcTotalSkills()
        }
    }

    _initData() {
        this.system.attributes.body.pd = 0;
        this.system.attributes.mind.md = 0;
        this.system.attributes.soul.sd = 0;
        this.system.attributes.init.score = 0;
        this.system.attributes.addDicePool = 0;
    }

    _deriveItemModifiers(items, newSystem) {
        //let items = actorData.items;
        let armorGroup = 0;
        let diceGroup = 0;
        let actorStats = newSystem.stats;
        let actorSkills = newSystem.skills;
        let actorAttributes = newSystem.attributes;
        let initiative;



        for (let x of items) {
            if (!x) { return }

            if (x.type === "specialization") { continue }

            if (x.type === "weapon" || x.type === "armor" || x.type === "item") {
                if (x.system.equipped === false) {
                    continue;
                }
            }
            if (x.type !== "ability") {
                if (x.system.modifier.init.value !== 0) {
                    let itemInit = x.system.modifier.init.value;
                    let initMod = newSystem.attributes.init.score;
                    newSystem.attributes.init.modified = itemInit + initMod;
                }
            }

            if (x.type === "weapon" && x.system.weaponTypes) {
                let weaponType = x.system.weaponTypes; // get weapon type from item
                let dp = x.system.modifier?.dp?.value || 0; // safely get dp value, default to 0 if undefined

                if (!actorSkills[weaponType]) {
                    console.warn(`Weapon skill '${weaponType}' not found in actorSkills.`);
                    return; // Skip if the weapon skill does not exist
                }

                let weaponSkill = actorSkills[weaponType].skillRank || 0; // default skill rank to 0 if undefined
                if (dp > weaponSkill) {
                    dp = weaponSkill; // cap dp at weaponSkill
                }

                actorSkills[weaponType].addDice = (actorSkills[weaponType].addDice || 0) + dp; // safely add dp to addDice
            }

            // cycle through the stat object, record the modifier on the item, pull actor stat value, add & write to actor. Valid on all items
            if (x.type === "ability") { continue }

            let armorPdMod = x.system.modifier.pd.value ? x.system.modifier.pd.value : 0;
            armorGroup += armorPdMod;

            const derivedStats = ["body", "mind", "soul"];
            const stats = ["agility", "charisma", "endurance", "intelligence", "perception", "spirit", "strength", "wisdom", "will"]

            for (let s of Object.values(x.system.modifier.stat)) {
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
                sn: x.system.modifier.sn,
                sn1: x.system.modifier.sn1,
                sn2: x.system.modifier.sn2
            }

            let snStatGroup = {
                snStat1: x.system.modifier.snStat1,
                snStat2: x.system.modifier.snStat2,
                snStat3: x.system.modifier.snStat3,
                snStat4: x.system.modifier.snStat4,
                snStat5: x.system.modifier.snStat5,
                snStat6: x.system.modifier.snStat6,
                snStat7: x.system.modifier.snStat7,
                snStat8: x.system.modifier.snStat8,
            }

            let specGroup = {
                sn: x.system.modifier.sn
            }

            /*if (x.data.type === "specialization") {
                console.log(x)
            }*/

            for (let n of Object.values(snGroup)) {
                if (!n || !n.skill || typeof n.skill !== "string" || n.skill.length === 0) {
                    continue; // Skip if `n` or `n.skill` is invalid
                }

                let skillNameArr = n.skill.split(' ');
                let skillName = skillNameArr[0].toLowerCase();
                let itemSNValue = Number(n.value) || 0;

                if (!actorSkills[skillName]) {
                    //console.warn(`Skill '${skillName}' not found in actorSkills.`);
                    continue; // Skip if the skill does not exist in `actorSkills`
                }

                let skillSNMod = Number(actorSkills[skillName].snMod) || 0;
                skillSNMod += itemSNValue;
                actorSkills[skillName].snMod = skillSNMod;
            }

            for (let n of Object.values(snStatGroup)) {
                if (n.value == 0 || n.statName === "") { continue; }
                let statName = n.statName.toLowerCase();
                let itemSNValue = Number(n.value);
                let statSNMod = Number(actorStats[statName].snMod);
                statSNMod = itemSNValue;
                actorStats[statName].snMod = Number(statSNMod);
            }

            this.system.attributes = actorAttributes // consolidate the other two into this. 
            this.system.stats = actorStats;
            this.system.attributes.addDicePool = diceGroup;
            this.system.attributes.body.modified = armorGroup + this.system.attributes.body.pd;
        }
    }

    _calcTotalSkills() {
        const skilledTests = ["Ceremony", "Cybernetics", "Herbalism", "Language", "Medicine", "Science"];
        for (let skillKey in this.system.skills) {
            let skill = this.system.skills[skillKey]
            // XORs the stat comparison with whether the rank is > 0
            // If the first stat is smaller AND skillrank > 0, 1 != 1 is 0
            // If the first stat is smaller BUT skillrank == 0, 1 != 0 is 1
            // If the first stat is bigger AND skillrank > 0, 0 != 1 is 1
            // If the first stat is bigger BUT skillrank == 0, 0 != 0 is 0
            let whichStat = (this._skillMod(Object.keys(skill.relStats)[0]) < this._skillMod(Object.keys(skill.relStats)[1])) != (skill.skillRank > 0) ? 0 : 1
			skill.stat = Object.keys(skill.relStats)[whichStat];
            let stat = this.system.skills[skillKey].stat;
            this._setSkillName(skill, skillKey);
            let skillModValue = this._skillMod(stat);
            let weaponDPMod = this.system.skills[skillKey].addDice ? this.system.skills[skillKey].addDice : 0;
            skill.statRank = skillModValue
            !this.system.skills[skillKey].dicePoolMod ? this.system.skills[skillKey].dicePoolMod = 0 : null;


            if (skill.name === "Knowledge" && skill.skillRank > 1) {
                ui.notifications ? ui.notifications.warn(game.i18n.format("WARN.KnowledgeMax", { name: this.name })) : null;
            }
            skill.skillRank = 0 + this.system.skills[skillKey].skillRank;
            skill.skillTotal = 0 + skillModValue + this.system.skills[skillKey].skillRank + this.system.skills[skillKey].dicePoolMod;
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
                this.system.skills[skillKey].statName = "Strength";
                break;
            case "agility":
                this.system.skills[skillKey].statName = "Agility";
                break;
            case "endurance":
                this.system.skills[skillKey].statName = "Endurance";
                break;
            case "intelligence":
                this.system.skills[skillKey].statName = "Intelligence";
                break;
            case "perception":
                this.system.skills[skillKey].statName = "Perception";
                break;
            case "wisdom":
                this.system.skills[skillKey].statName = "Wisdom";
                break;
            case "spirit":
                this.system.skills[skillKey].statName = "Spirit";
                break;
            case "charisma":
                this.system.skills[skillKey].statName = "Charisma";
                break;
            case "will":
                this.system.skills[skillKey].statName = "Will";
                break;
        }
    }


    _skillMod(stat) {
        switch (stat) {
            case "strength":
                return this.system.stats.strength.modified;
            case "agility":
                return this.system.stats.agility.modified;
            case "endurance":
                return this.system.stats.endurance.modified;
            case "intelligence":
                return this.system.stats.intelligence.modified;
            case "perception":
                return this.system.stats.perception.modified;
            case "wisdom":
                return this.system.stats.wisdom.modified;
            case "spirit":
                return this.system.stats.spirit.modified;
            case "charisma":
                return this.system.stats.charisma.modified;
            case "will":
                return this.system.stats.will.modified;
        }
    }



    _setPath(actorData) {
        if (this.type === "npc") {
            actorData.info.path.allowedStats = {
                "agility": "Agility",
                "charisma": "Charisma",
                "endurance": "Endurance",
                "intelligence": "Intelligence",
                "perception": "Perception",
                "spirit": "Spirit",
                "strength": "Strength",
                "wisdom": "Wisdom",
                "will": "Will"
            }
            actorData.info.path.stats = {
                "stat1": {
                    "name": "Agility",
                    "value": "agility"
                },
                "stat2": {
                    "name": "Charisma",
                    "value": "charisma"
                }, 
                "stat3": {
                    "name": "Endurance",
                    "value": "endurance"
                },
                "stat4": {
                    "name": "Intelligence",
                    "value": "intelligence"
                },
                "stat5": {
                    "name": "Perception",
                    "value": "perception"
                },
                "stat6": {
                    "name": "Spirit",
                    "value": "spirit"
                },
                "stat7": {
                    "name": "Strength",
                    "value": "strength"
                },
                "stat8": {
                    "name": "Will",
                    "value": "will"
                },
                "stat9": {
                    "name": "Wisdom",
                    "value": "wisdom"
                },

            }
            return actorData.info.path;
        }
        switch (actorData.info.path.value) {
            case "badger":
                actorData.info.path.name = "Badger";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    },
                    "stat2": {
                        "name": "Will",
                        "value": "will"
                    }
                }
                actorData.info.path.allowedStats = {
                    "intelligence": "Intelligence",
                    "will": "Will"
                }
                return actorData;
            case "bear":
                actorData.info.path.name = "Bear";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Charisma",
                        "value": "charisma"
                    },
                    "stat2": {
                        "name": "Strength",
                        "value": "strength"
                    }
                }
                actorData.info.path.allowedStats = {
                    "charisma": "Charisma",
                    "strength": "Strength"
                }
                return actorData;
            case "beaver":
                actorData.info.path.name = "Beaver";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Endurance",
                        "value": "endurance"
                    },
                    "stat2": {
                        "name": "Perception",
                        "value": "perception"
                    }
                }
                actorData.info.path.allowedStats = {
                    "endurance": "Endurance",
                    "perception": "Perception"
                }
                return actorData;
            case "bison":
                actorData.info.path.name = "Bison";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Strength",
                        "value": "strength"
                    },
                    "stat2": {
                        "name": "Will",
                        "value": "will"
                    }
                }
                actorData.info.path.allowedStats = {
                    "strength": "Strength",
                    "will": "Will"
                }
                return actorData;
            case "coyote":
                actorData.info.path.name = "Coyote";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Agility",
                        "value": "agility"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.info.path.allowedStats = {
                    "agility": "Agility",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "crow":
                actorData.info.path.name = "Crow";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Spirit",
                        "value": "spirit"
                    },
                    "stat2": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    }
                }
                actorData.info.path.allowedStats = {
                    "spirit": "Spirit",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "deer":
                actorData.info.path.name = "Deer";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    },
                    "stat2": {
                        "name": "Charisma",
                        "value": "charisma"
                    }
                }
                actorData.info.path.allowedStats = {
                    "wisdom": "Wisdom",
                    "charisma": "Charisma"
                }
                return actorData;
            case "eagle":
                actorData.info.path.name = "Eagle";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Strength",
                        "value": "strength"
                    },
                    "stat2": {
                        "name": "Wisdom",
                        "value": "wisdom"
                    }
                }
                actorData.info.path.allowedStats = {
                    "strength": "Strength",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "falcon":
                actorData.info.path.name = "Falcon";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Perception",
                        "value": "perception"
                    },
                    "stat2": {
                        "name": "Spirit",
                        "value": "spirit"
                    }
                }
                actorData.info.path.allowedStats = {
                    "perception": "Perception",
                    "spirit": "Spirit"
                }
                return actorData;
            case "fox":
                actorData.info.path.name = "Fox";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Agility",
                        "value": "agility"
                    },
                    "stat2": {
                        "name": "Spirit",
                        "value": "spirit"
                    }
                }
                actorData.info.path.allowedStats = {
                    "agility": "Agility",
                    "spirit": "Spirit"
                }
                return actorData;
            case "owl":
                actorData.info.path.name = "Owl";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Endurance",
                        "value": "endurance"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.info.path.allowedStats = {
                    "endurance": "Endurance",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "raccoon":
                actorData.info.path.name = "Raccoon";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Charisma",
                        "value": "charisma"
                    },
                    "stat2": {
                        "name": "Intelligence",
                        "value": "intelligence"
                    }
                }
                actorData.info.path.allowedStats = {
                    "charisma": "Charisma",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "salmon":
                actorData.info.path.name = "Salmon";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Will",
                        "value": "will"
                    },
                    "stat2": {
                        "name": "Agility",
                        "value": "agility"
                    }
                }
                actorData.info.path.allowedStats = {
                    "will": "Will",
                    "agility": "Agility"
                }
                return actorData;
            case "snake":
                actorData.info.path.name = "Snake";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Spirit",
                        "value": "spirit"
                    },
                    "stat2": {
                        "name": "Endurance",
                        "value": "endurance"
                    }
                }
                actorData.info.path.allowedStats = {
                    "spirit": "Spirit",
                    "endurance": "Endurance"
                }
                return actorData;
            case "spider":
                actorData.info.path.name = "Spider";
                actorData.info.path.stats = {
                    "stat1": {
                        "name": "Perception",
                        "value": "perception"
                    },
                    "stat2": {
                        "name": "Strength",
                        "value": "strength"
                    }
                }
                actorData.info.path.allowedStats = {
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