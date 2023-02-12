//import { convertBurdenToGift } from "../system/utility.js";

export class cncItem extends Item {
    prepareData() {
        super.prepareData();
    }

    _preCreate(data) {
    }

    prepareBaseData() {
 
    }

    prepareDerivedData(data) {
        //const itemData = this.data;



        if (this.type === "ability") {
            // get value of activation
            let activationValue = this.system.activate;
            let activationName;
            //console.log(activationValue);


            // set activationName to lang file name
            if (activationValue === "primary") { activationName = game.i18n.localize("ACTIVATION.Primary") };
            if (activationValue === "secondary") { activationName = game.i18n.localize("ACTIVATION.Secondary") };
            if (activationValue === "reaction") { activationName = game.i18n.localize("ACTIVATION.Reaction") };
            if (activationValue === "prisec") { activationName = game.i18n.localize("ACTIVATION.PriSec") };
            if (activationValue === "narrative") { activationName = game.i18n.localize("ACTIVATION.Narrative") };

            // write activationName to item data structure

            this.system.activationName = activationName;
        }
    }
}