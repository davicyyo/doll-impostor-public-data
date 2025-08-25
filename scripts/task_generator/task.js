const fs = require("fs");

const generateMapsWithValues = (
  maps,
  minCount,
  maxCount,
  minValue,
  maxValue
) => {
  const selectedCount =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const selectedMaps = maps
    .sort(() => 0.5 - Math.random())
    .slice(0, selectedCount);

  return selectedMaps.map((map) => ({
    map,
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  }));
};

const generateExtras = (maps) => {
  const extras = {};
  const possibleExtras = ["random", "time_trial", "endless"];
  const selectedExtras = possibleExtras
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  if (selectedExtras.includes("random")) {
    extras.random = maps[Math.floor(Math.random() * maps.length)];
  }

  if (selectedExtras.includes("time_trial")) {
    extras.time_trial = {
      map: maps[Math.floor(Math.random() * maps.length)],
      value: Math.floor(Math.random() * 3) + 1,
    };
  }

  if (selectedExtras.includes("endless")) {
    extras.endless = {
      map: maps[Math.floor(Math.random() * maps.length)],
      value: Math.floor(Math.random() * 3) + 1,
    };
  }

  return extras;
};

const generateCareer = () => {
  return {
    map: "career",
    value: Number(Math.random() < 0.4),
  };
};

const generateDailyData = () => {
  const maps = ["daycareMap", "houseMap", "circusMap","cabinMap","toyFactoryMap"];

  return {
    singleplayer: generateMapsWithValues(maps, 1, 4, 0, 3),
    multiplayer: generateMapsWithValues(maps, 0, 1, 0, 3),
    extras: generateExtras(maps),
    career: generateCareer(),
  };
};

const dailyTasks = [];

for (let i = 0; i < 7; i++) {
  dailyTasks.push(generateDailyData());
}

fs.writeFile("task.json", JSON.stringify(dailyTasks, null, 4), (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("task.json has been saved!");
  }
});
