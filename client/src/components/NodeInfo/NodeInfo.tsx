import { NodeInfoDto } from "../../generated";
import "./node-info.css";

const NodeInfo = ({
  nodeInfo,
  pubKey,
}: {
  nodeInfo: NodeInfoDto;
  pubKey: string;
}) => {
  return (
    <div className="node-info">
      <h1 className="node-info__headline">Your node:</h1>

      <dl className="node-info__definition-list">
        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">id</dt>
          <dd className="node-info__definition-data">{pubKey}</dd>
        </div>

        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">alias</dt>
          <dd className="node-info__definition-data">{nodeInfo.alias}</dd>
        </div>

        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">color</dt>
          <dd
            className="node-info__definition-data"
            style={{ color: nodeInfo.color }}
          >
            {nodeInfo.color}
          </dd>
        </div>

        {nodeInfo.updated_at && (
          <div className="node-info__dl-wrap">
            <dt className="node-info__definition-term">updated_at</dt>
            <dd className="node-info__definition-data">
              {new Date(nodeInfo.updated_at).toUTCString()}
            </dd>
          </div>
        )}

        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">capacity</dt>
          <dd className="node-info__definition-data">{nodeInfo.capacity}</dd>
        </div>

        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">channels</dt>
          <dd className="node-info__definition-data">
            {nodeInfo.channel_count}
          </dd>
        </div>

        <div className="node-info__dl-wrap">
          <dt className="node-info__definition-term">sockets</dt>
          <div>
            {nodeInfo.sockets.map((socket, index) => (
              <dd key={index} className="node-info__definition-data">
                {socket.socket}
              </dd>
            ))}
          </div>
        </div>
      </dl>
    </div>
  );
};

export default NodeInfo;
