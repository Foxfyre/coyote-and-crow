//import { convertBurdenToGift } from "../system/utility.js";

export class cncItem extends Item {
    prepareDerivedData() {
      super.prepareDerivedData();
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

    /** @inheritdoc */
    static migrateData(source) {
      // Some items have system.relstat instead of system.relStat.
      if (foundry.utils.hasProperty(source, "system.relstat")) {
        if (!foundry.utils.hasProperty(source, "system.relStat")) source.system.relStat = source.system.relstat;
        delete source.system.relstat;
      }

      // Some items were created with capitalized system.relStat value.
      if (source.system?.relStat) source.system.relStat = source.system.relStat.toLowerCase();

      return super.migrateData(source);
    }
}
