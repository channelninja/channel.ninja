import { NodeResponseDto } from "../../generated";
import "./node.css";

const Node = ({ node }: { node: NodeResponseDto }) => {
  return (
    <div id={node.id} className="node">
      <div className="node__headline-container">
        <a
          href={`https://amboss.space/node/${node.id}`}
          target="_blank"
          rel="noreferrer"
          className="node__link"
        >
          <h2 className="node__headline">{node.alias}</h2>
        </a>
      </div>

      <div className="node__meta-container">
        <div className="node__meta">
          <div className="node__meta-title">number of channels</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.channelCount}</span>{" "}
            channels
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">distance</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.distance}</span> hops
          </div>
        </div>

        {/* 
        <div className="node__meta">
          <div className="node__meta-title">capacity</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.capacity || 0}</span>{" "}
            sat
          </div>
        </div> */}

        <div className="node__meta">
          <div className="node__meta-title">connections</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.connections}</span>
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">last updated</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">
              {node.lastUpdate
                ? new Date(node.lastUpdate).toDateString()
                : "unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Node;
