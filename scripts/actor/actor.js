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
            let skillModValue = this._skillMod(stat);
            skill.total = skillModValue + this.data.data.skills[skillKey].rank;
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

}