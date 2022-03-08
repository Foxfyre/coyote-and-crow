export class cncItem extends Item {
    prepareData() {
        super.prepareData();
    }

    _preCreate(data) {
    }

    prepareBaseData() {

    }

    prepareDerivedData() {
        const itemData = this.data;
        if (itemData.type === "ability") {
            // get value of activation
            let activationValue = itemData.data.activate;
            let activationName;
            //console.log(activationValue);
            

            // set activationName to lang file name
            if (activationValue === "primary") { activationName = game.i18n.localize("REACTION.Primary") };
            if (activationValue === "secondary") { activationName = game.i18n.localize("REACTION.Secondary") };
            if (activationValue === "reaction") { activationName = game.i18n.localize("REACTION.Reaction") };
            if (activationValue === "prisec") { activationName = game.i18n.localize("REACTION.PriSec") }

            // write activationName to item data structure

            this.data.data.activationName = activationName;
        }
    }
}