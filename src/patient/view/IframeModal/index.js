import React from 'react';
import Iframe from "react-iframe";

const IframeModal = ({url}) => {
    return(
        <div className="iframe-modal-container">
          <Iframe url={url}
                  width="100%"
                  height="100%"
                  id="IframeModal"
                  loading="eager"
          />
        </div>
    )
}

export default IframeModal;
