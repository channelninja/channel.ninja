import { openChannelTargetNodeChanged, selectIsOpenChannelAvailable } from '../../features/WebLN/web-ln-slice';
import { NodeResponseDto } from '../../generated';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Button from '../Button/Button';
import Info from '../Info/Info';
import { connectionsMouseEntered, resetTooltip } from '../Ninja/tooltip-slice';
import './node.css';
import Socket from './Socket';

const Node = ({ node }: { node: NodeResponseDto }) => {
  const dispatch = useAppDispatch();
  const isOpenChannelAvailable = useAppSelector(selectIsOpenChannelAvailable);
  const transactionIdsByPubkey = useAppSelector((state) => state.global.transactionIdsByPubkey);
  const txExplorerUrl = useAppSelector((state) => state.global.txExplorerUrl);

  const transactionId = transactionIdsByPubkey[node.id];

  const handleConnectionsMouseEnter = () => {
    dispatch(connectionsMouseEntered());
  };

  const handleTooltipReset = () => {
    dispatch(resetTooltip());
  };

  const handleOpenChannelClick = () => {
    dispatch(openChannelTargetNodeChanged(node));
  };

  return (
    <div
      id={node.id}
      className="node bg-neutral-900"
    >
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
            <span className="node__meta-data--bold">{node.channelCount}</span> channels
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">distance</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.distance}</span> hops
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">
            connections{' '}
            <Info
              onMouseEnter={handleConnectionsMouseEnter}
              onMouseLeave={handleTooltipReset}
            />
          </div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.connections}</span>
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">last updated</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">
              {node.lastUpdate ? new Date(node.lastUpdate).toDateString() : 'unknown'}
            </span>
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">capacity</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.capacity?.toLocaleString('en-US') || '-'}</span>
            sats
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">largest channel</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.maxChannelSize?.toLocaleString('en-US') || '-'}</span>
            sats
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">smallest channel</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.minChannelSize?.toLocaleString('en-US') || '-'}</span>
            sats
          </div>
        </div>

        <div className="node__meta">
          <div className="node__meta-title">avg channel</div>
          <div className="node__meta-data">
            <span className="node__meta-data--bold">{node.avgChannelSize?.toLocaleString('en-US') || '-'}</span>
            sats
          </div>
        </div>
      </div>

      {transactionId && txExplorerUrl ? (
        <div>
          <a
            className="underline underline-offset-2 hover:no-underline"
            href={`${txExplorerUrl}/${transactionId}`}
            target="_blank"
            rel="noreferrer"
          >
            Funding Transaction
          </a>
        </div>
      ) : (
        <div>
          <ul className="node__sockets-list">
            {node.sockets.map((socket, i) => (
              <li
                key={i}
                className="node__sockets-list-item"
              >
                <Socket
                  socket={socket}
                  pubkey={node.id}
                />
              </li>
            ))}

            {window?.webln && node.sockets.length && isOpenChannelAvailable ? (
              <li
                key={node.sockets.length}
                className="node__sockets-list-item"
              >
                <Button onPress={handleOpenChannelClick}>open channel</Button>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Node;
