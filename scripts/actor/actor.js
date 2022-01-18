/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */

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
        data.attributes.init.score = data.stats.agi.value + data.stats.per.value + data.stats.cha.value;
        data.attributes.body.pd = data.stats.agi.value + data.stats.end.value;
        data.attributes.mind.md = data.stats.per.value + data.stats.wis.value;
        data.attributes.soul.sd = data.stats.cha.value + data.stats.wll.value;
        data.attributes.body.value = data.stats.str.value + data.stats.agi.value + data.stats.end.value;
        data.attributes.mind.value = data.stats.int.value + data.stats.per.value + data.stats.wis.value;
        data.attributes.soul.value = data.stats.spi.value + data.stats.cha.value + data.stats.wll.value;

        if (this.type === "character") {
            this._calcTotalSkills()
            this._setPath(actorData);
        }

    }

    _initData() {
        this.data.data.attributes.body.pd = 0;
        this.data.data.attributes.mind.md = 0;
        this.data.data.attributes.soul.sd = 0;
        this.data.data.attributes.init.score = 0;


    }

    _calcTotalSkills() {
        for (let skillKey in this.data.data.skills) {

            let skill = this.data.data.skills[skillKey]
            let stat = this.data.data.skills[skillKey].stat;
            this._setSkillName(skill, skillKey);
            let skillModValue = this._skillMod(stat);
            skill.total = 0 + skillModValue + this.data.data.skills[skillKey].rank;
        }
    }

    _setSkillName(skill, skillKey) {
        switch (skill.stat) {
            case "str":
                this.data.data.skills[skillKey].statName = "Strength";
                break;
            case "agi":
                this.data.data.skills[skillKey].statName = "Agility";
                break;
            case "end":
                this.data.data.skills[skillKey].statName = "Endurance";
                break;
            case "int":
                this.data.data.skills[skillKey].statName = "Intelligence";
                break;
            case "per":
                this.data.data.skills[skillKey].statName = "Perception";
                break;
            case "wis":
                this.data.data.skills[skillKey].statName = "Wisdom";
                break;
            case "spi":
                this.data.data.skills[skillKey].statName = "Spirit";
                break;
            case "cha":
                this.data.data.skills[skillKey].statName = "Charisma";
                break;
            case "wll":
                this.data.data.skills[skillKey].statName = "Will";
                break;
        }
    }


    _skillMod(stat) {
        switch (stat) {
            case "str":
                return this.data.data.stats.str.value;
            case "agi":
                return this.data.data.stats.agi.value;
            case "end":
                return this.data.data.stats.end.value;
            case "int":
                return this.data.data.stats.int.value;
            case "per":
                return this.data.data.stats.per.value;
            case "wis":
                return this.data.data.stats.wis.value;
            case "spi":
                return this.data.data.stats.spi.value;
            case "cha":
                return this.data.data.stats.cha.value;
            case "wll":
                return this.data.data.stats.wll.value;
        }
    }

    _setPath(actorData) {
        switch (actorData.data.info.path.value) {
            case "badger":
                actorData.data.info.path.name = "Badger";
                actorData.data.info.path.stats = {
                    "stat1": "Intelligence",
                    "stat2": "Will"
                }
                return actorData;
            case "bear":
                actorData.data.info.path.name = "Bear";
                actorData.data.info.path.stats = {
                    "stat1": "Charisma",
                    "stat2": "Strength"
                }
                return actorData;
            case "beaver":
                actorData.data.info.path.name = "Beaver";
                actorData.data.info.path.stats = {
                    "stat1": "Endurance",
                    "stat2": "Perception"
                }
                return actorData;
            case "bison":
                actorData.data.info.path.name = "Bison";
                actorData.data.info.path.stats = {
                    "stat1": "Strength",
                    "stat2": "Will"
                }
                return actorData;
            case "coyote":
                actorData.data.info.path.name = "Coyote";
                actorData.data.info.path.stats = {
                    "stat1": "Agility",
                    "stat2": "Intelligence"
                }
                return actorData;
            case "crow":
                actorData.data.info.path.name = "Crow";
                actorData.data.info.path.stats = {
                    "stat1": "Spirit",
                    "stat2": "Wisdom"
                }
                return actorData;
            case "deer":
                actorData.data.info.path.name = "Deer";
                actorData.data.info.path.stats = {
                    "stat1": "Wisdom",
                    "stat2": "Charisma"
                }
                return actorData;
            case "eagle":
                actorData.data.info.path.name = "Eagle";
                actorData.data.info.path.stats = {
                    "stat1": "Strength",
                    "stat2": "Wisdom"
                }
                return actorData;
            case "falcon":
                actorData.data.info.path.name = "Falcon";
                actorData.data.info.path.stats = {
                    "stat1": "Perception",
                    "stat2": "Spirit"
                }
                return actorData;
            case "fox":
                actorData.data.info.path.name = "Fox";
                actorData.data.info.path.stats = {
                    "stat1": "Agility",
                    "stat2": "Spirit"
                };
                return actorData;
            case "owl":
                actorData.data.info.path.name = "Owl";
                actorData.data.info.path.stats = {
                    "stat1": "Endurance",
                    "stat2": "Intelligence"
                }
                return actorData;
            case "raccoon":
                actorData.data.info.path.name = "Raccoon";
                actorData.data.info.path.stats = {
                    "stat1": "Charisma",
                    "stat2": "Intelligence"
                }
                return actorData;
            case "salmon":
                actorData.data.info.path.name = "Salmon";
                actorData.data.info.path.stats = {
                    "stat1": "Will",
                    "stat2": "Agility"
                }
                return actorData;
            case "snake":
                actorData.data.info.path.name = "Snake";
                actorData.data.info.path.stats = {
                    "stat1": "Spirit",
                    "stat2": "Endurance"
                }
                return actorData;
            case "spider":
                actorData.data.info.path.name = "Spider";
                actorData.data.info.path.stats = {
                    "stat1": "Perception",
                    "stat2": "Strength"
                }
                return actorData;
        }

    }

}