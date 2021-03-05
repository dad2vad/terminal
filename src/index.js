import React, { useState } from "react";
import ReactDOM from "react-dom";
import Terminal from "react-console-emulator";

const places = {
  forest: {
    desc:
      "Tall trees drape their shade over you. There's a breeze. You hear chirping. There's a [road] leading outside.",
    neighbors: ["road"],
    items: ["branch", "saw"]
  },
  road: {
    desc:
      "This dirt road connects the [forest] with some buildings... A [town].",
    neighbors: ["forest", "town"]
  },
  town: {
    desc:
      "There doesn't seem to be anybody in the [streets]. Maybe they're in the [church].",
    neighbors: ["road", "streets", "church"]
  }
};

const STARTING_PLACE = "forest";

const items = {
  napkins: {
    name: "some used napkins"
  },
  stump: {
    tooHeavy: true
  }
};

let inventory = ["napkins"];

const MyTerminal = () => {
  let [place, setPlace] = useState(STARTING_PLACE);

  const commands = {
    look: {
      description: "Look around.",
      fn: () => {
        let thePlace = places[place];
        if (!thePlace) {
          return `You are in the ${place}.`;
        }
        let desc = thePlace.desc;
        desc += thePlace.items
          ? ` There is also ${thePlace.items
              .map(it in items ? items[it].name : it)
              .join(" and ")}.`
          : "";
        return desc;
      }
    },
    neighbors: {
      description: "List places you can go to.",
      fn: () => {
        return places[place]
          ? places[place].neighbors.join(", ")
          : "You are trapped!";
      }
    },
    restart: {
      description: "Restart the text adventure.",
      fn: () => {
        setPlace(STARTING_PLACE);
      }
    },
    inventory: {
      description: "Check your inventory.",
      fn: () => {
        return `You have: ${
          inventory.length ? inventory.join(", ") : "nothing!"
        }`;
      }
    },
    get: {
      description: "Get an item.",
      fn: args => {
        if (args) {
          let newItem = args;
          if (inventory.includes(newItem)) {
            return `You already have the ${newItem}.`;
          }
          if (!(places[place] ? places[place].items : []).includes(newItem)) {
            return `There's no "${newItem}" here.`;
          }
          if (!items[newItem].tooHeavy) {
            return `It's too heavy!`;
          } else {
            inventory = [...inventory, newItem];
            return `You got the ${newItem}.`;
          }
        } else {
          return `Pick what up?`;
        }
      }
    },
    goto: {
      description: "Go to another place.",
      fn: args => {
        if (args) {
          let newPlace = args;
          if (newPlace === place) {
            return `You already are in the ${newPlace}.`;
          }
          if (places[place].neighbors.includes(newPlace)) {
            setPlace(newPlace);
            return `You are now in the ${newPlace}.`;
          } else {
            return `You cannot go to any "${newPlace}" from here.`;
          }
        } else {
          return `Go where?`;
        }
      }
    }
  };

  return (
    <Terminal
      commands={commands}
      welcomeMessage={"Welcome to a Text Adventure! Type 'help'."}
      promptLabel={">_"}
    />
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<MyTerminal />, rootElement);
