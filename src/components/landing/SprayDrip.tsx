'use client';

/**
 * SprayDrip - Paint drip SVG divider between sections
 * Renders an organic blobby drip path divider with spray-paint filter for rough edges.
 * Props:
 *   colorFrom - the background color of the section above
 *   colorTo   - the background color of the section below
 *   variant   - optional 0-3 to pick a specific drip path (defaults to random-ish)
 */

interface SprayDripProps {
  colorFrom: string;
  colorTo: string;
  variant?: number;
  flip?: boolean;
}

// 4 variations of organic drip paths
// Each path spans the full 1440 width and has irregular blobby drips hanging down
const dripPaths = [
  // Variation 0: Heavy left drip, medium center, small right drips
  `M0,0 L0,25
   Q30,28 55,26 Q70,24 80,30 Q85,55 88,70 Q92,80 98,75 Q105,50 108,30 Q115,24 140,26
   Q200,28 280,25 Q310,24 320,32 Q325,60 328,72 Q332,78 338,65 Q342,42 345,30 Q350,24 400,26
   Q500,28 560,25 Q580,24 590,28 Q595,45 597,55 Q600,60 605,50 Q608,36 612,28 Q620,24 700,26
   Q780,28 840,25 Q860,24 870,35 Q875,65 880,82 Q885,90 892,80 Q898,55 902,35 Q908,24 960,26
   Q1020,28 1080,25 Q1100,24 1110,30 Q1114,50 1116,58 Q1120,62 1125,52 Q1128,38 1132,28 Q1140,24 1200,26
   Q1280,28 1340,25 Q1360,24 1370,32 Q1375,55 1378,65 Q1382,70 1388,60 Q1392,40 1396,30 Q1400,26 1440,25
   L1440,0 Z`,

  // Variation 1: Lots of thin drips scattered across
  `M0,0 L0,22
   Q40,24 70,22 Q78,21 82,28 Q84,42 85,50 Q87,54 90,45 Q92,32 95,26 Q100,22 160,24
   Q220,26 250,22 Q265,21 270,30 Q272,48 274,58 Q276,62 280,52 Q283,36 286,28 Q292,22 380,24
   Q430,26 460,22 Q470,21 475,26 Q477,38 478,44 Q480,48 483,40 Q485,30 488,24 Q494,22 560,24
   Q620,26 680,22 Q700,21 706,32 Q710,56 714,70 Q718,78 724,68 Q728,48 732,32 Q738,22 820,24
   Q880,26 920,22 Q930,21 935,26 Q937,36 938,42 Q940,46 943,38 Q945,28 948,24 Q954,22 1020,24
   Q1080,26 1120,22 Q1140,21 1148,34 Q1152,58 1156,72 Q1160,78 1166,66 Q1170,44 1175,32 Q1180,22 1260,24
   Q1340,26 1380,22 Q1395,21 1400,28 Q1403,42 1405,50 Q1408,54 1412,44 Q1415,30 1420,24 Q1430,22 1440,22
   L1440,0 Z`,

  // Variation 2: Asymmetric - big drips right side, subtle left
  `M0,0 L0,20
   Q60,22 120,20 Q140,19 148,24 Q150,32 151,36 Q153,38 156,32 Q158,26 162,22 Q170,20 300,22
   Q400,24 480,20 Q500,19 510,28 Q514,44 516,52 Q518,56 522,48 Q525,36 528,26 Q535,20 640,22
   Q720,24 780,20 Q800,19 810,36 Q816,62 822,80 Q828,90 836,78 Q842,54 848,36 Q855,20 940,22
   Q1000,24 1060,20 Q1080,19 1092,40 Q1098,68 1104,88 Q1110,96 1118,82 Q1124,56 1130,38 Q1138,20 1200,22
   Q1260,24 1310,20 Q1330,19 1340,32 Q1345,56 1350,68 Q1355,74 1362,62 Q1367,42 1372,30 Q1380,20 1440,22
   L1440,0 Z`,

  // Variation 3: Wavy with medium evenly-spaced drips
  `M0,0 L0,28
   Q50,32 100,28 Q120,26 130,34 Q135,52 138,62 Q142,68 148,58 Q152,42 156,32 Q165,26 240,30
   Q310,34 380,28 Q400,26 412,36 Q418,56 422,68 Q426,74 432,64 Q436,46 440,34 Q450,26 530,30
   Q600,34 660,28 Q680,26 692,38 Q698,60 702,74 Q706,80 712,68 Q716,48 720,36 Q730,26 810,30
   Q880,34 940,28 Q960,26 972,36 Q978,58 982,70 Q986,76 992,64 Q996,44 1000,34 Q1010,26 1100,30
   Q1160,34 1220,28 Q1240,26 1252,38 Q1258,58 1262,70 Q1266,76 1272,64 Q1276,44 1280,34 Q1290,26 1370,30
   Q1410,32 1440,28
   L1440,0 Z`,
];

export default function SprayDrip({ colorFrom, colorTo, variant, flip = false }: SprayDripProps) {
  const pathIndex = variant !== undefined ? variant % dripPaths.length : 0;
  const path = dripPaths[pathIndex];

  return (
    <div
      className="relative w-full overflow-hidden pointer-events-none select-none"
      style={{
        marginTop: '-1px',
        marginBottom: '-1px',
        height: 'clamp(40px, 6vw, 100px)',
        backgroundColor: colorTo,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
        style={{
          transform: flip ? 'scaleY(-1)' : undefined,
          filter: 'url(#spray-paint)',
        }}
      >
        <path d={path} fill={colorFrom} />
      </svg>
    </div>
  );
}
