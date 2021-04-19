/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
import { Button } from "strapi-helper-plugin";

// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
      <Button>Sync Photos</Button>
    </div>
  );
};

export default memo(HomePage);
