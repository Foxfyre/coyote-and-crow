export class CoyoteDiceWhite extends Die {
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
            "1": '<img src="systems/coyote-and-crow/ui/dice/w1.png" />',
            "2": '<img src="systems/coyote-and-crow/ui/dice/w2.png" />',
            "3": '<img src="systems/coyote-and-crow/ui/dice/w3.png" />',
            "4": '<img src="systems/coyote-and-crow/ui/dice/w4.png" />',
            "5": '<img src="systems/coyote-and-crow/ui/dice/w5.png" />',
            "6": '<img src="systems/coyote-and-crow/ui/dice/w6.png" />',
            "7": '<img src="systems/coyote-and-crow/ui/dice/w7.png" />',
            "8": '<img src="systems/coyote-and-crow/ui/dice/w8.png" />',
            "9": '<img src="systems/coyote-and-crow/ui/dice/w9.png" />',
            "10": '<img src="systems/coyote-and-crow/ui/dice/w10.png" />',
            "11": '<img src="systems/coyote-and-crow/ui/dice/w11.png" />',
            "12": '<img src="systems/coyote-and-crow/ui/dice/w12.png" />',
        }[result.result];
    }
}