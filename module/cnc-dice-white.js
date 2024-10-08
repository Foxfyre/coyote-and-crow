export class CoyoteDiceWhite extends foundry.dice.terms.Die {
    constructor(termData) {
        termData.faces = 12;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "a";

    /* -------------------------------------------- */

    /** @override */
    getResultLabel(result) {
        return {
            "1": '<img src="systems/coyote-and-crow/ui/dice/chat/w1.png" />',
            "2": '<img src="systems/coyote-and-crow/ui/dice/chat/w2.png" />',
            "3": '<img src="systems/coyote-and-crow/ui/dice/chat/w3.png" />',
            "4": '<img src="systems/coyote-and-crow/ui/dice/chat/w4.png" />',
            "5": '<img src="systems/coyote-and-crow/ui/dice/chat/w5.png" />',
            "6": '<img src="systems/coyote-and-crow/ui/dice/chat/w6.png" />',
            "7": '<img src="systems/coyote-and-crow/ui/dice/chat/w7.png" />',
            "8": '<img src="systems/coyote-and-crow/ui/dice/chat/w8.png" />',
            "9": '<img src="systems/coyote-and-crow/ui/dice/chat/w9.png" />',
            "10": '<img src="systems/coyote-and-crow/ui/dice/chat/w10.png" />',
            "11": '<img src="systems/coyote-and-crow/ui/dice/chat/w11.png" />',
            "12": '<img src="systems/coyote-and-crow/ui/dice/chat/w12.png" />',
        }[result.result];
    }
}