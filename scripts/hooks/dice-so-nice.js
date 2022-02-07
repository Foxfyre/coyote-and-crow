export function registerDiceSoNice(dice3d) {
    dice3d.addSystem({ id: "coyote-and-crow", name: "Coyote And Crow" }, "preferred");
    dice3d.addColorset({
        name: "d12-white",
        category: "Coyote And Crow",
        description: "Standard Dice",
        edge: "#ffffff",
        background: "#ffffff",
        material: "plastic",
    });

    dice3d.addColorset({
        name: "d12-black",
        category: "Coyote And Crow",
        description: "Critical Dice",
        edge: "#000000",
        background: "#000000",
        material: "plastic",
    });

    dice3d.addDicePreset(
        {
            type: "da",
            labels: [
                "systems/coyote-and-crow/ui/dice/w1.png",
                "systems/coyote-and-crow/ui/dice/w2.png",
                "systems/coyote-and-crow/ui/dice/w3.png",
                "systems/coyote-and-crow/ui/dice/w4.png",
                "systems/coyote-and-crow/ui/dice/w5.png",
                "systems/coyote-and-crow/ui/dice/w6.png",
                "systems/coyote-and-crow/ui/dice/w7.png",
                "systems/coyote-and-crow/ui/dice/w8.png",
                "systems/coyote-and-crow/ui/dice/w9.png",
                "systems/coyote-and-crow/ui/dice/w10.png",
                "systems/coyote-and-crow/ui/dice/w11.png",
                "systems/coyote-and-crow/ui/dice/w12.png",
            ],
            bumpMaps: [
                "systems/coyote-and-crow/ui/dice/bump-1.png",
                "systems/coyote-and-crow/ui/dice/bump-2.png",
                "systems/coyote-and-crow/ui/dice/bump-3.png",
                "systems/coyote-and-crow/ui/dice/bump-4.png",
                "systems/coyote-and-crow/ui/dice/bump-5.png",
                "systems/coyote-and-crow/ui/dice/bump-6.png",
                "systems/coyote-and-crow/ui/dice/bump-7.png",
                "systems/coyote-and-crow/ui/dice/bump-8.png",
                "systems/coyote-and-crow/ui/dice/bump-9.png",
                "systems/coyote-and-crow/ui/dice/bump-10.png",
                "systems/coyote-and-crow/ui/dice/bump-11.png",
                "systems/coyote-and-crow/ui/dice/bump-12.png",
            ],
            colorset: "d12-white",
            system: "coyote-and-crow",
        },
        "d12"
    );

    dice3d.addDicePreset(
        {
            type: "db",
            labels: [
                "systems/coyote-and-crow/ui/dice/b1.png",
                "systems/coyote-and-crow/ui/dice/b2.png",
                "systems/coyote-and-crow/ui/dice/b3.png",
                "systems/coyote-and-crow/ui/dice/b4.png",
                "systems/coyote-and-crow/ui/dice/b5.png",
                "systems/coyote-and-crow/ui/dice/b6.png",
                "systems/coyote-and-crow/ui/dice/b7.png",
                "systems/coyote-and-crow/ui/dice/b8.png",
                "systems/coyote-and-crow/ui/dice/b9.png",
                "systems/coyote-and-crow/ui/dice/b10.png",
                "systems/coyote-and-crow/ui/dice/b11.png",
                "systems/coyote-and-crow/ui/dice/b12.png",
            ],
            bumpMaps: [
                "systems/coyote-and-crow/ui/dice/bump-1.png",
                "systems/coyote-and-crow/ui/dice/bump-2.png",
                "systems/coyote-and-crow/ui/dice/bump-3.png",
                "systems/coyote-and-crow/ui/dice/bump-4.png",
                "systems/coyote-and-crow/ui/dice/bump-5.png",
                "systems/coyote-and-crow/ui/dice/bump-6.png",
                "systems/coyote-and-crow/ui/dice/bump-7.png",
                "systems/coyote-and-crow/ui/dice/bump-8.png",
                "systems/coyote-and-crow/ui/dice/bump-9.png",
                "systems/coyote-and-crow/ui/dice/bump-10.png",
                "systems/coyote-and-crow/ui/dice/bump-11.png",
                "systems/coyote-and-crow/ui/dice/bump-12.png",
            ],
            colorset: "d12-black",
            system: "coyote-and-crow",
        },
        "d12"
    );

}