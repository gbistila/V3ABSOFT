const $ = (id) => document.getElementById(id);
const round = (n, d = 2) => Number.isFinite(n) ? Number(n.toFixed(d)) : 0;
const currency = (n) => `$${round(n, 2).toLocaleString()}`;

// SOD INSTALL
function calcSod(sf) {
  const sfOrdered = round(sf * 1.06, 0);
  const materialCost = round(sfOrdered * 0.45);
  const laborHours = round(sf / 150, 2);
  const laborCost = round(laborHours * 48);
  const totalCost = materialCost + laborCost;
  const price = round(totalCost * 1.43);
  const handoff = `Sod and Install - Premium Install:\n- ${laborHours} Hours\n- ${sf} square feet (order ${sfOrdered})`;
  return { sfOrdered, materialCost, laborHours, laborCost, totalCost, price, handoff };
}

// TOPSOIL
function calcTopsoil(sf, depthIn) {
  const yards = round((sf * (depthIn / 12)) / 27, 2);
  const materialCost = round(yards * 32);
  const laborHours = round(yards * 0.5, 2);
  const laborCost = round(laborHours * 48);
  const totalCost = materialCost + laborCost;
  const price = round(totalCost * 1.43);
  const handoff = `Top Soil:\n- ${laborHours} Hours\n- ${yards} yards at ${depthIn}"`;
  return { yards, materialCost, laborHours, laborCost, totalCost, price, handoff };
}

// SPRINKLER INSTALL
function calcSprinkler(zones, controllers, boxes, dripLines, tunnels) {
  const zoneCost = zones * 200;
  const controllerCost = controllers > 0 ? controllers * 185 : 0;
  const boxCost = boxes * 50;
  const dripCredit = dripLines * -50;
  const tunnelCost = tunnels * (48 * 4);
  const laborHours = zones * 10;
  const laborCost = laborHours * 48;
  const totalCost = zoneCost + controllerCost + boxCost + dripCredit + tunnelCost + laborCost;
  const price = round(totalCost * 1.43);
  const handoff = `Sprinkler System Install:\n- ${laborHours} hours${controllers === 0 ? `\n- No controller needed` : ""}`;
  return { totalCost, price, handoff };
}

// CONCRETE INSTALL
function calcConcrete(sf, thick) {
  const cy = round((sf * thick) / 324, 2);
  const soilLaborHours = round(cy * 0.6, 2);
  const soilLaborCost = round(soilLaborHours * 48);
  const roadLooseCY = round(cy * 1.2, 2);
  const roadMat = round(roadLooseCY * 35);
  const roadLab = round(roadLooseCY * 48);
  const roadEq = 250;
  const roadTotal = roadMat + roadLab + roadEq;
  const concOrderedCY = round(cy * 1.2, 2);
  const concMat = round(concOrderedCY * 225);
  const flatwork = Math.max(1500, round(sf * 1.75));
  const concTotal = concMat + flatwork;
  const combinedCost = soilLaborCost + roadTotal + concTotal;
  const price = round(combinedCost * 1.43);
  const handoff = `Concrete Installation:\n- ${soilLaborHours} Hours\n- ${roadLooseCY} yard road base at ${thick}" thick\n- ${concOrderedCY} yards concrete (${round(concMat / 225, 2)} budget)\n- ${currency(combinedCost)} budget`;
  return { combinedCost, price, handoff };
}

// CLEAR OUT PREP
function calcPrep(sf, depthIn) {
  const yards = round((sf * (depthIn / 12)) / 27, 2);
  const dumpFee = round(yards * 75);
  const laborHours = Math.max(round(yards, 2), 2.5);
  const laborCost = round(laborHours * 48);
  const totalCost = dumpFee + laborCost;
  const price = round(totalCost * 1.43);
  const handoff = `Haul Off of Dirt:\n- cost per yard is $75 (50 dump and 25 labor)\n- ${yards} yards`;
  return { totalCost, price, handoff };
}

// BOULDER WALL
function calcBoulderWall(length, height, fillYds) {
  const faceSF = round(length * height, 2);
  const laborHours = round((faceSF * 0.75) / 10, 2);
  const laborCost = round(laborHours * 48);
  const boulderCost = round(faceSF * 85);
  const fillCost = round(fillYds * 45);
  const equipment = 250;
  const totalCost = laborCost + boulderCost + fillCost + equipment;
  const price = round(totalCost * 1.43);
  const tonsNeeded = round(fillYds * 1.4, 2);
  const handoff = `Boulder Wall Install:\n- ${laborHours} Hours (budget)\n- ${faceSF} SF material needed\n- ${tonsNeeded} tons`;
  return { totalCost, price, handoff };
}

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
