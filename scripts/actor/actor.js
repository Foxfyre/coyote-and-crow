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
        data.attributes.init.score = data.stats.agility.value + data.stats.perception.value + data.stats.charisma.value;
        data.attributes.body.pd = data.stats.agility.value + data.stats.endurance.value;
        data.attributes.mind.md = data.stats.perception.value + data.stats.wisdom.value;
        data.attributes.soul.sd = data.stats.charisma.value + data.stats.will.value;
        data.attributes.body.value = data.stats.strength.value + data.stats.agility.value + data.stats.endurance.value;
        data.attributes.mind.value = data.stats.intelligence.value + data.stats.perception.value + data.stats.wisdom.value;
        data.attributes.soul.value = data.stats.spirit.value + data.stats.charisma.value + data.stats.will.value;

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
                return this.data.data.stats.strength.value;
            case "agility":
                return this.data.data.stats.agility.value;
            case "endurance":
                return this.data.data.stats.endurance.value;
            case "intelligence":
                return this.data.data.stats.intelligence.value;
            case "perception":
                return this.data.data.stats.perception.value;
            case "wisdom":
                return this.data.data.stats.wisdom.value;
            case "spirit":
                return this.data.data.stats.spirit.value;
            case "charisma":
                return this.data.data.stats.charisma.value;
            case "will":
                return this.data.data.stats.will.value;
        }
    }

    _setPath(actorData) {
        switch (actorData.data.info.path.value) {
            case "badger":
                actorData.data.info.path.name = "Badger";
                actorData.data.info.path.stats = {
                    "intelligence": "Intelligence",
                    "will": "Will"
                }
                return actorData;
            case "bear":
                actorData.data.info.path.name = "Bear";
                actorData.data.info.path.stats = {
                    "charisma": "Charisma",
                    "strength": "Strength"
                }
                return actorData;
            case "beaver":
                actorData.data.info.path.name = "Beaver";
                actorData.data.info.path.stats = {
                    "endurance": "Endurance",
                    "perception": "Perception"
                }
                return actorData;
            case "bison":
                actorData.data.info.path.name = "Bison";
                actorData.data.info.path.stats = {
                    "strength": "Strength",
                    "willl": "Will"
                }
                return actorData;
            case "coyote":
                actorData.data.info.path.name = "Coyote";
                actorData.data.info.path.stats = {
                    "agility": "Agility",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "crow":
                actorData.data.info.path.name = "Crow";
                actorData.data.info.path.stats = {
                    "spirit": "Spirit",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "deer":
                actorData.data.info.path.name = "Deer";
                actorData.data.info.path.stats = {
                    "wisdom": "Wisdom",
                    "charisma": "Charisma"
                }
                return actorData;
            case "eagle":
                actorData.data.info.path.name = "Eagle";
                actorData.data.info.path.stats = {
                    "strength": "Strength",
                    "wisdom": "Wisdom"
                }
                return actorData;
            case "falcon":
                actorData.data.info.path.name = "Falcon";
                actorData.data.info.path.stats = {
                    "perception": "Perception",
                    "spirit": "Spirit"
                }
                return actorData;
            case "fox":
                actorData.data.info.path.name = "Fox";
                actorData.data.info.path.stats = {
                    "agility": "Agility",
                    "spirit": "Spirit"
                };
                return actorData;
            case "owl":
                actorData.data.info.path.name = "Owl";
                actorData.data.info.path.stats = {
                    "endurance": "Endurance",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "raccoon":
                actorData.data.info.path.name = "Raccoon";
                actorData.data.info.path.stats = {
                    "charisma": "Charisma",
                    "intelligence": "Intelligence"
                }
                return actorData;
            case "salmon":
                actorData.data.info.path.name = "Salmon";
                actorData.data.info.path.stats = {
                    "will": "Will",
                    "agility": "Agility"
                }
                return actorData;
            case "snake":
                actorData.data.info.path.name = "Snake";
                actorData.data.info.path.stats = {
                    "spirit": "Spirit",
                    "endurance": "Endurance"
                }
                return actorData;
            case "spider":
                actorData.data.info.path.name = "Spider";
                actorData.data.info.path.stats = {
                    "perception": "Perception",
                    "strength": "Strength"
                }
                return actorData;
        }

    }

}