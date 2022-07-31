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
            "1": '<img src="systems/coyote-and-crow/ui/dice/chat/c1.png" />',
            "2": '<img src="systems/coyote-and-crow/ui/dice/chat/c2.png" />',
            "3": '<img src="systems/coyote-and-crow/ui/dice/chat/c3.png" />',
            "4": '<img src="systems/coyote-and-crow/ui/dice/chat/c4.png" />',
            "5": '<img src="systems/coyote-and-crow/ui/dice/chat/c5.png" />',
            "6": '<img src="systems/coyote-and-crow/ui/dice/chat/c6.png" />',
            "7": '<img src="systems/coyote-and-crow/ui/dice/chat/c7.png" />',
            "8": '<img src="systems/coyote-and-crow/ui/dice/chat/c8.png" />',
            "9": '<img src="systems/coyote-and-crow/ui/dice/chat/c9.png" />',
            "10": '<img src="systems/coyote-and-crow/ui/dice/chat/c10.png" />',
            "11": '<img src="systems/coyote-and-crow/ui/dice/chat/c11.png" />',
            "12": '<img src="systems/coyote-and-crow/ui/dice/chat/c12.png" />',
        }[result.result];
    }
}