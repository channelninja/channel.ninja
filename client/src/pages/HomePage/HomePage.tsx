import { useCallback, useEffect, useRef } from 'react';
import Dialog from '../../components/Dialog/Dialog';
import Form from '../../components/Form';
import ListItem from '../../components/ListItem';
import Ninja from '../../components/Ninja';
import { useTimeoutTooltip } from '../../components/Ninja/hooks/use-timeout-tooltip';
import { TooltipType } from '../../components/Ninja/tooltip-slice';
import { TooltipKey } from '../../components/Ninja/tooltip.enum';
import Node from '../../components/Node';
import NodeInfo from '../../components/NodeInfo';
import Social from '../../components/Social';
import { useSockets } from '../../context/useSocket';
import OpenChannelForm from '../../features/WebLN/components/OpenChannelForm';
import { openChannelTargetNodeChanged } from '../../features/WebLN/web-ln-slice';
import { LndService } from '../../generated';
import {
  fetchSuggestions,
  invoiceFetched,
  invoicePaid,
  nodeInfoChanged,
  validPubKeyEntered,
} from '../../redux/global-slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import './home.css';

const HomePage = () => {
  const socket = useSockets();
  const state = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timer>();
  const setTooltip = useTimeoutTooltip();
  const openChannelTargetNode = useAppSelector((state) => state.webLN.openChannelTargetNode);

  useEffect(() => {
    socket?.on('lnd:invoice-confirmed', (id) => {
      if (id === state.invoice?.id) {
        dispatch(invoicePaid());
      }
    });

    if (state.invoice && !state.invoicePaid) {
      intervalRef.current = setInterval(() => {
        socket?.emit('lnd:check-invoice-status', { id: state.invoice?.id });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      socket?.off('lnd:invoice-confirmed');
    };
  }, [state.invoice, dispatch, socket, state.invoicePaid]);

  const getInvoice = useCallback(async () => {
    try {
      const invoice = await LndService.createInvoice();
      if (invoice.isPaid) {
        dispatch(invoicePaid());
      } else {
        dispatch(invoiceFetched(invoice));
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.nodes) {
      return;
    }

    if (state.invoicePaid) {
      return;
    }

    if (!state.invoice) {
      getInvoice();
    }
  }, [state.invoice, state.invoicePaid, state.nodes, getInvoice]);

  const handleFormSubmit = useCallback(
    async ({ pubKey }: { pubKey: string }) => {
      try {
        const nodeInfo = await LndService.getNodeInfo(pubKey);

        if (!nodeInfo) {
          setTooltip(TooltipKey.INVALID_PUB_KEY, 10_000, TooltipType.ERROR);
          return;
        }

        dispatch(nodeInfoChanged(nodeInfo));
        dispatch(validPubKeyEntered(pubKey));
      } catch (error) {
        setTooltip(TooltipKey.INVALID_PUB_KEY, 10_000, TooltipType.ERROR);
        return;
      }

      try {
        await dispatch(fetchSuggestions(pubKey)).unwrap();
      } catch (error) {
        if (typeof error === 'string') {
          if (error === 'GRAPH_NOT_READY') {
            setTooltip(TooltipKey.GRAPH_NOT_READY, 10_000, TooltipType.ERROR);
            return;
          }

          if (error === 'NODE_NOT_FOUND') {
            setTooltip(TooltipKey.NODE_NOT_FOUND, 10_000, TooltipType.ERROR);
            return;
          }

          if (error === 'NODE_HAS_NO_PEERS') {
            setTooltip(TooltipKey.NODE_HAS_NO_PEERS, 10_000, TooltipType.ERROR);
            return;
          }
        }

        setTooltip(TooltipKey.ERROR_FETCHING_SUGGESTIONS, 10_000, TooltipType.ERROR);
      }
    },
    [dispatch, setTooltip],
  );

  const handleDialogCloseClick = () => {
    dispatch(openChannelTargetNodeChanged(undefined));
  };

  return (
    <div className="home">
      <div className="home__ninja">
        <Ninja />
      </div>

      <div className="home__content">
        <div className="home__title">
          <h1>
            channel.ninja <span className="home__title--beta">(alpha)</span>
          </h1>
        </div>

        <div className="home__form">
          <Form onSubmit={handleFormSubmit} />
        </div>

        {openChannelTargetNode ? (
          <Dialog
            title={`Open channel to ${openChannelTargetNode.alias}`}
            onCloseClick={handleDialogCloseClick}
          >
            <OpenChannelForm node={openChannelTargetNode} />
          </Dialog>
        ) : (
          <div className="overflow-y-auto">
            {state.nodeInfo && !state.invoicePaid && state.pubKey && (
              <div className="home__node-info">
                <NodeInfo
                  nodeInfo={state.nodeInfo}
                  pubKey={state.pubKey}
                />
              </div>
            )}

            {!openChannelTargetNode && state.invoicePaid && state.nodes && (
              <ul style={{ width: '100%' }}>
                {state.nodes.map((node) => (
                  <ListItem key={node.id}>
                    <Node node={node} />
                  </ListItem>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Social />
    </div>
  );
};

export default HomePage;
