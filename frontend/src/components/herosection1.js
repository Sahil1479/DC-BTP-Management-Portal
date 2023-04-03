import React from 'react';
import Grid from '@material-ui/core/Grid';
export default function HeroSection() {
  return (
    <React.Fragment>
      <Grid
        container
        spacing={4}
        style={{
          width: '100%',
          margin: 'auto',
          background: '#f9f5ff',
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          style={{
            width: '100%',
            padding: 0,
          }}
        >
          <div className="logo">
            <picture>
              <source srcSet="Artboard3.png" media="(min-width: 700px)" />
              <source srcSet="ArtboardMobile.png" media="(min-width: 600px)" />
              <img width="100%" src="ArtboardMobile.png" alt="Baby Sleeping" />
            </picture>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
