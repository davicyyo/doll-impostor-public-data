const fs = require("fs");

const generateMapsWithDifficulties = (maps, minCount, maxCount, minDifficulty, maxDifficulty) => {
  const selectedCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const selectedMaps = maps.sort(() => 0.5 - Math.random()).slice(0, selectedCount);

  return selectedMaps.map(map => ({
    map,
    difficulty: Math.floor(Math.random() * (maxDifficulty - minDifficulty + 1)) + minDifficulty,
  }));
};

const generateExtras = (maps) => {
  const extras = {};
  const possibleExtras = ["random", "medal", "endless"];
  const selectedExtras = possibleExtras.sort(() => 0.5 - Math.random()).slice(0, 2); // 0-2 extras

  if (selectedExtras.includes("random")) {
    extras.random = maps[Math.floor(Math.random() * maps.length)];
  }

  if (selectedExtras.includes("medal")) {
    extras.medal = {
      map: maps[Math.floor(Math.random() * maps.length)],
      quantity: Math.floor(Math.random() * 3) + 1, // 1-3
    };
  }

  if (selectedExtras.includes("endless")) {
    extras.endless = {
      map: maps[Math.floor(Math.random() * maps.length)],
      quantity: Math.floor(Math.random() * 3) + 1, // 1-3
    };
  }

  return extras;
};

const generateDailyData = () => {
  const maps = ["daycareMap", "houseMap", "circusMap"];

  return {
    singleplayer: generateMapsWithDifficulties(maps, 1, 4, 0, 3),
    multiplayer: generateMapsWithDifficulties(maps, 0, 1, 0, 3),
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
    weekly.extras = { random: [], medal: {}, endless: {} };
  }

  if (daily.extras.random) {
    weekly.extras.random.push(daily.extras.random);
  }

  if (daily.extras.medal) {
    const { map, quantity } = daily.extras.medal;
    weekly.extras.medal[map] = (weekly.extras.medal[map] || 0) + quantity;
  }

  if (daily.extras.endless) {
    const { map, quantity } = daily.extras.endless;
    weekly.extras.endless[map] = (weekly.extras.endless[map] || 0) + quantity;
  }
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
