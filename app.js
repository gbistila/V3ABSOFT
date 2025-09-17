const $ = (id) => document.getElementById(id);
const round = (n, d = 2) => Number.isFinite(n) ? Number(n.toFixed(d)) : 0;
const currency = (n) => `$${round(n, 2).toLocaleString()}`;

// --- CALCULATORS ---
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

function calcSod(sf, topsoilDepth) {
  const sfOrdered = round(sf * 1.06, 0);
  const sodMaterialCost = round(sfOrdered * 0.45);
  const sodLaborHours = round(sf / 150, 2);
  const sodLaborCost = round(sodLaborHours * 48);
  const sodTotalCost = sodMaterialCost + sodLaborCost;

  const topsoilYards = round((sf * (topsoilDepth / 12)) / 27, 2);
  const topsoilMaterialCost = round(topsoilYards * 32);
  const topsoilLaborHours = round(topsoilYards * 0.5, 2);
  const topsoilLaborCost = round(topsoilLaborHours * 48);
  const topsoilTotalCost = topsoilMaterialCost + topsoilLaborCost;

  const combinedCost = round(sodTotalCost + topsoilTotalCost);
  const price = round(combinedCost * 1.43);

  const handoff = `Sod and Install - Premium Install:\n- ${sodLaborHours} Hours\n- ${sf} square feet (order ${sfOrdered})\nTop Soil:\n- ${topsoilLaborHours} Hours\n- ${topsoilYards} yards at ${topsoilDepth}"`;

  return { combinedCost, price, handoff };
}

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

// --- EVENT WIRING ---
window.addEventListener('DOMContentLoaded', () => {
  // Clear Out Prep
  $('calc-prep').addEventListener('click', () => {
    const sf = Number($('prep-sf').value || 0);
    const depth = Number($('prep-depth').value || 0);
    const r = calcPrep(sf, depth);
    $('nums-prep').innerHTML = `<span class="stat">Cost: <b>${currency(r.totalCost)}</b></span><span class="stat">Price: <b>${currency(r.price)}</b></span>`;
    $('out-prep').textContent = r.handoff;
  });
  $('copy-prep').addEventListener('click', () => navigator.clipboard.writeText($('out-prep').textContent));

  // Sod + Topsoil
  $('calc-sod').addEventListener('click', () => {
    const sf = Number($('sod-sf').value || 0);
    const depth = Number($('topsoil-depth').value || 0);
    const r = calcSod(sf, depth);
    $('nums-sod').innerHTML = `<span class="stat">Cost: <b>${currency(r.combinedCost)}</b></span><span class="stat">Price: <b>${currency(r.price)}</b></span>`;
    $('out-sod').textContent = r.handoff;
  });
  $('copy-sod').addEventListener('click', () => navigator.clipboard.writeText($('out-sod').textContent));

  // Sprinkler
  $('calc-sprinkler').addEventListener('click', () => {
    const z = Number($('sp-zones').value || 0);
    const c = Number($('sp-controllers').value || 0);
    const b = Number($('sp-boxes').value || 0);
    const d = Number($('sp-drip').value || 0);
    const t = Number($('sp-tunnels').value || 0);
    const r = calcSprinkler(z, c, b, d, t);
    $('nums-sprinkler').innerHTML = `<span class="stat">Cost: <b>${currency(r.totalCost)}</b></span><span class="stat">Price: <b>${currency(r.price)}</b></span>`;
    $('out-sprinkler').textContent = r.handoff;
  });
  $('copy-sprinkler').addEventListener('click', () => navigator.clipboard.writeText($('out-sprinkler').textContent));

  // Concrete
  $('calc-concrete').addEventListener('click', () => {
    const sf = Number($('conc-sf').value || 0);
    const thick = Number($('conc-thick').value || 0);
    const r = calcConcrete(sf, thick);
    $('nums-concrete').innerHTML = `<span class="stat">Cost: <b>${currency(r.combinedCost)}</b></span><span class="stat">Price: <b>${currency(r.price)}</b></span>`;
    $('out-concrete').textContent = r.handoff;
  });
  $('copy-concrete').addEventListener('click', () => navigator.clipboard.writeText($('out-concrete').textContent));

  // Boulder Wall
$('calc-bw').addEventListener('click', () => {
  const len = Number($('bw-length').value || 0);
  const ht = Number($('bw-height').value || 0);
  const fill = Number($('bw-fill').value || 0);
  const r = calcBoulderWall(len, ht, fill);
  $('nums-bw').innerHTML = `
    <span class="stat">Cost: <b>${currency(r.totalCost)}</b></span>
    <span class="stat">Price: <b>${currency(r.price)}</b></span>
  `;
  $('out-bw').textContent = r.handoff;
});

$('copy-bw').addEventListener('click', () => {
  navigator.clipboard.writeText($('out-bw').textContent);
});
