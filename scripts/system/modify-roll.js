/**
 * CNC Dice Roll Modifier Dialog
 * @extends {FormApplication}
 */
export class modifyRollDialog extends FormApplication {
    /**
     * Assign default options
     * @override
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cnc", "modify-roll-dialog"],
            template: "/systems/coyote-and-crow/templates/dialog/dice-roll.html",
            title: game.i18n.localize("COYOTE.DIALOG.ModifyRoll"),
            closeOnSubmit: true,
        })
    }
}