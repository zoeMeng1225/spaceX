import { geoKavrayskiy7 } from "d3-geo-projection";

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 700;

// Shared by the base map and the satellite layer so dots land on the
// same coordinates as the countries underneath them.
export const projection = geoKavrayskiy7()
  .scale(190)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
  .precision(0.1);
