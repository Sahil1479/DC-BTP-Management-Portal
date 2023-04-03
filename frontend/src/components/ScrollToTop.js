import React from 'react';
import { withRouter } from 'react-router-dom';
class ScrollToTop extends React.Component {
  componentDidUpdate({ location: previousLocation }) {
    const { location } = this.props;
    if (previousLocation !== location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
