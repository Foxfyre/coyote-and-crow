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
            "1": '<img src="systems/coyote-and-crow/ui/dice/chat/b1.png" />',
            "2": '<img src="systems/coyote-and-crow/ui/dice/chat/b2.png" />',
            "3": '<img src="systems/coyote-and-crow/ui/dice/chat/b3.png" />',
            "4": '<img src="systems/coyote-and-crow/ui/dice/chat/b4.png" />',
            "5": '<img src="systems/coyote-and-crow/ui/dice/chat/b5.png" />',
            "6": '<img src="systems/coyote-and-crow/ui/dice/chat/b6.png" />',
            "7": '<img src="systems/coyote-and-crow/ui/dice/chat/b7.png" />',
            "8": '<img src="systems/coyote-and-crow/ui/dice/chat/b8.png" />',
            "9": '<img src="systems/coyote-and-crow/ui/dice/chat/b9.png" />',
            "10": '<img src="systems/coyote-and-crow/ui/dice/chat/b10.png" />',
            "11": '<img src="systems/coyote-and-crow/ui/dice/chat/b11.png" />',
            "12": '<img src="systems/coyote-and-crow/ui/dice/chat/b12.png" />',
        }[result.result];
    }
}