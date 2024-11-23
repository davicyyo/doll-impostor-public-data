const fs = require("fs");

const generateMapsWithValues = (maps, minCount, maxCount, minValue, maxValue) => {
  const selectedCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const selectedMaps = maps.sort(() => 0.5 - Math.random()).slice(0, selectedCount);

  return selectedMaps.map(map => ({
    map,
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  }));
};

const generateExtras = (maps) => {
  const extras = {};
  const possibleExtras = ["random", "time_trial", "endless"];
  const selectedExtras = possibleExtras.sort(() => 0.5 - Math.random()).slice(0, 2);

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

const generateDailyData = () => {
  const maps = ["daycareMap", "houseMap", "circusMap"];

  return {
    singleplayer: generateMapsWithValues(maps, 1, 4, 0, 3),
    multiplayer: generateMapsWithValues(maps, 0, 1, 0, 3),
    extras: generateExtras(maps),
  };
};

const mergeIntoWeekly = (weekly, daily) => {
  ["singleplayer", "multiplayer"].forEach(category => {
    if (!weekly[category]) {
      weekly[category] = [];
    }

    weekly[category] = weekly[category].concat(daily[category]);
  });

  if (!weekly.extras) {
    weekly.extras = [];
  }

  weekly.extras.push(daily.extras);
};

const taskData = {
  daily: [],
  weekly: {},
};

for (let i = 0; i < 7; i++) {
  const dailyTask = generateDailyData();
  taskData.daily.push(dailyTask);
  mergeIntoWeekly(taskData.weekly, dailyTask);
}

fs.writeFile("task.json", JSON.stringify(taskData, null, 4), (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("task.json has been saved!");
  }
});
