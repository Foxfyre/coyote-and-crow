function convertStatName(statName) {
    let stat = "";

    switch (statName) {
        case "strength":
            stat = "Strength";
            break;
        case "agi":
            stat = "Agility";
            break;
        case "end":
            stat = "Endurance";
            break;
        case "int":
            stat = "Intelligence";
            break;
        case "per":
            stat = "Perception";
            break;
        case "wis":
            stat = "Wisdom";
            break;
        case "spi":
            stat = "Spirit";
            break;
        case "cha":
            stat = "Charisma";
            break;
        case "wll":
            stat = "Will";
            break;
    }

    return stat;
}

function convertBurdenToGift(itemData) {
    let item = foundry.utils.deepClone(itemData);
    console.log(item);
    if (item.type === "burden") {
        console.log("Converting pre 0.1.5 burdens to gifts")
        item.type = "gift";
        item.data.type = "burden";
    }
    this.data.type = item;
}

export { convertStatName, convertBurdenToGift }