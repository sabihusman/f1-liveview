// Stylized SVG paths for F1 circuits. Each path is drawn in a 1000x600 viewBox.
// These are recognizable but simplified (no overlapping segments) so animated
// driver dots stay visually spread out around the loop.

export interface TrackDef {
  /** SVG path data for the racing line (closed loop) */
  d: string;
  /** Approx start/finish marker as a fraction of path length (0..1) */
  startOffset: number;
  /** Direction of travel: +1 forward, -1 reverse */
  direction: 1 | -1;
}

export const TRACKS: Record<string, TrackDef> = {
  // Hungaroring — twisty, tight, no long straights
  Hungaroring: {
    d: "M 160,470 C 160,420 200,395 250,400 C 305,406 330,450 380,450 C 430,450 450,405 495,400 C 550,395 575,440 625,435 C 680,430 690,380 735,365 C 790,348 850,365 870,415 C 888,460 855,500 800,510 C 740,520 700,495 640,500 C 575,506 540,535 470,535 C 400,535 360,510 295,510 C 230,510 160,520 160,470 Z",
    startOffset: 0.0,
    direction: 1,
  },
  // Spa — long flowing curves, big back straight
  "Spa-Francorchamps": {
    d: "M 130,470 C 130,420 180,400 230,410 C 285,422 305,470 360,475 C 420,480 445,425 430,375 C 415,325 365,310 380,260 C 395,210 460,200 510,225 C 560,250 575,310 625,330 C 690,355 760,335 815,365 C 870,395 880,455 825,495 C 770,532 695,520 620,515 C 540,510 490,545 410,545 C 320,545 230,535 175,520 C 130,508 130,505 130,470 Z",
    startOffset: 0.0,
    direction: 1,
  },
  // Monza — temple of speed, three long straights with chicanes
  Monza: {
    d: "M 130,440 L 760,340 C 810,332 855,355 860,400 C 865,450 825,480 775,475 L 240,415 C 195,410 165,440 175,485 C 185,525 230,535 275,525 L 800,425 C 855,415 895,440 895,485 C 895,530 855,550 810,545 L 175,490 C 130,485 110,460 130,440 Z",
    startOffset: 0.05,
    direction: 1,
  },
  // Marina Bay — rectangular street circuit
  "Marina Bay": {
    d: "M 130,500 L 410,500 C 445,500 465,480 465,445 L 465,360 C 465,330 485,310 515,310 L 605,310 C 635,310 650,290 650,260 L 650,200 C 650,170 670,150 700,150 L 830,150 C 865,150 880,170 880,205 L 880,290 C 880,320 860,340 830,340 L 770,340 C 740,340 720,360 720,390 L 720,460 C 720,495 700,515 665,515 L 165,515 C 130,515 110,500 130,500 Z",
    startOffset: 0.02,
    direction: 1,
  },
  // Suzuka — figure-8 inspired (without literal crossover)
  Suzuka: {
    d: "M 150,440 C 165,395 215,375 265,390 C 320,406 340,450 395,450 C 450,450 470,405 455,360 C 440,315 385,300 380,255 C 376,215 420,195 470,205 C 525,216 545,265 595,275 C 655,287 705,255 720,210 C 735,165 705,130 745,115 C 790,98 845,125 855,175 C 865,225 825,265 790,295 C 750,328 760,375 805,395 C 855,415 870,470 825,510 C 775,545 705,535 635,525 C 555,514 510,545 425,545 C 335,545 260,530 200,520 C 145,510 135,485 150,440 Z",
    startOffset: 0.02,
    direction: -1,
  },
};

export function getTrackForCircuit(circuitShortName: string): TrackDef {
  return TRACKS[circuitShortName] ?? TRACKS.Hungaroring;
}
