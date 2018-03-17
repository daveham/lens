import React from 'react';

import ImageContainer from './ImageContainer';

export default () => {
  return (
    <div>
      <p>
        The analysis phase divides up the input photograph into a collection of tiles
        and calculates statistics on each tile. This is performed at multiple resolutions,
        typically at 8, 16, and 32 pixel square tiles.
      </p>
      <ImageContainer/>
      <p>
        The first level of analysis collects basic statistics over the three channels of the RGB
        and HSL color models. These statistics include min, max, mean, mode, as well as
        histograms as illustrated above.
      </p>
      <p>
        Other statistics include standard deviation and other measures of variance, as well
        as entropy and other measures of energy or chaos.
      </p>
      <p>
        The final level of analysis generations vector fields from the lower level statistics.
        The vector fields are primary drivers of some of the behaviors in the simulation
        phase.
      </p>
    </div>
  );
};
