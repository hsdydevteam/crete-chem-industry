import sharp from "sharp";
import fs from "node:fs";
const make = (kind, after) => {
  const bg = `<defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#284765"/><stop offset="1" stop-color="#101f33"/></linearGradient><linearGradient id="wall"><stop stop-color="${after ? "#b8c9d1" : "#888b89"}"/><stop offset="1" stop-color="${after ? "#7d9aaa" : "#585e60"}"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="15" stdDeviation="15" flood-opacity=".3"/></filter></defs><rect width="1200" height="750" fill="url(#bg)"/>`;
  let scene = "";
  if (kind === "basement") {
    scene = `<path d="M180 130 635 70 1050 245 600 340z" fill="#364f64"/><path d="M180 130 600 340v340L180 485z" fill="url(#wall)"/><path d="M600 340 1050 245v340L600 680z" fill="${after ? "#aac2cb" : "#777d7d"}"/><path d="m180 485 420 195 450-95-420-190z" fill="${after ? "#648ea4" : "#555c61"}"/>${after ? '<path d="M180 454 600 648 1050 554" fill="none" stroke="#01b8d5" stroke-width="18"/><path d="M580 335v310" stroke="#00a8c8" stroke-width="14"/>' : '<path d="M584 338q-90 50-30 115t-75 120l131 86 200-48q-51-95-175-126z" fill="#334543" opacity=".65"/><path d="m842 290-41 86 19 31-51 91" stroke="#394443" stroke-width="8" fill="none"/><ellipse cx="677" cy="589" rx="100" ry="22" fill="#405e6c"/>'}`;
  }
  if (kind === "concrete") {
    scene = `<path d="m220 110 615-15 195 170-615 20z" fill="#93a3ae"/><path d="m220 110 195 175v345L220 438z" fill="#677d8a"/><path d="m415 285 615-20v344L415 630z" fill="url(#wall)"/>${after ? '<path d="m415 285 615-20v344L415 630z" fill="#abc4ca"/><path d="m475 340 485-15M475 535l485-15" stroke="#83a5b5" stroke-width="3"/>' : '<path d="m590 310 50 57-32 68 51 43-35 57 111 15 86-86-13-97-105-81z" fill="#4a5256"/><path d="m618 348 74 33 75-54 29 111-89 75-66-48z" fill="#766552"/><path d="m664 360 25 137m51-158 20 126m-110-69 134-29m-132 77 138-36" stroke="#6a3526" stroke-width="14"/><path d="m566 286 26 39-20 25m260 152 40 32-16 44" stroke="#394850" stroke-width="6" fill="none"/>'}`;
  }
  if (kind === "structural") {
    scene = `<path d="m180 545 670-100 180 140-670 115z" fill="#425f75"/><path d="m310 120 440-60 180 115-440 65z" fill="#adb9c1"/><path d="m310 120 180 120v90L310 220z" fill="#7793a3"/><path d="m490 240 440-65v95l-440 65z" fill="${after ? "#75adc3" : "#969a98"}"/><path d="m370 278 95 48v320l-95-70z" fill="#698ca0"/><path d="m465 326 93-14v318l-93 16z" fill="url(#wall)"/><path d="m789 280 90-14v305l-90 11z" fill="url(#wall)"/><path d="m728 241 61 39v302l-61-49z" fill="#698ca0"/>${after ? '<path d="m460 335 104-16v315l-104 16z" fill="#427e9b"/><path d="m784 285 102-14v304l-102 14z" fill="#427e9b"/><path d="m465 405 93-14m-93 87 93-14m-93 87 93-14M790 365l89-12m-89 85 89-12m-89 85 89-12" stroke="#00b8d2" stroke-width="8"/>' : '<path d="m492 345 21 46-12 36 28 52-20 51 10 62m306-294 13 61-15 32 33 45-28 72" stroke="#3e4544" stroke-width="8" fill="none"/><path d="m540 270 90-29 24 40 55-16" stroke="#61635e" stroke-width="8" fill="none"/>'}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">${bg}<g filter="url(#shadow)">${scene}</g><rect x="34" y="678" width="293" height="35" rx="4" fill="#061a35b0"/><text x="50" y="701" fill="#b7c8da" font-family="Arial" font-size="12" letter-spacing="2">ILLUSTRATIVE SYSTEM STUDY</text></svg>`;
};
for (const kind of ["basement", "concrete", "structural"])
  for (const after of [false, true])
    await sharp(Buffer.from(make(kind, after)))
      .webp({ quality: 90 })
      .toFile(`public/assets/${kind}-${after ? "after" : "before"}.webp`);
console.log("Created six distinct illustrative comparison assets.");
