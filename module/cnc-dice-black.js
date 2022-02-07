export class CoyoteDiceBlack extends Die {
    constructor(termData) {
        termData.faces = 12;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "b";

    /* -------------------------------------------- */

    /** @override */
    getResultLabel(result) {
        return {
            "1": '<img src="systems/coyote-and-crow/ui/dice/b1.png" />',
            "2": '<img src="systems/coyote-and-crow/ui/dice/b2.png" />',
            "3": '<img src="systems/coyote-and-crow/ui/dice/b3.png" />',
            "4": '<img src="systems/coyote-and-crow/ui/dice/b4.png" />',
            "5": '<img src="systems/coyote-and-crow/ui/dice/b5.png" />',
            "6": '<img src="systems/coyote-and-crow/ui/dice/b6.png" />',
            "7": '<img src="systems/coyote-and-crow/ui/dice/b7.png" />',
            "8": '<img src="systems/coyote-and-crow/ui/dice/b8.png" />',
            "9": '<img src="systems/coyote-and-crow/ui/dice/b9.png" />',
            "10": '<img src="systems/coyote-and-crow/ui/dice/b10.png" />',
            "11": '<img src="systems/coyote-and-crow/ui/dice/b11.png" />',
            "12": '<img src="systems/coyote-and-crow/ui/dice/b12.png" />',
        }[result.result];
    }
}