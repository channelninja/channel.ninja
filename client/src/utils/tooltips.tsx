import { QRCodeSVG } from "qrcode.react";
import { LndInvoiceResponseDto } from "../dto/lnd-invoice-response.dto";

export enum TooltipState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  QR_CODE = "QR_CODE",
  NO_NODES_FOUND = "NO_NODES_FOUND",
  SHOW_MY_NODE = "SHOW_MY_NODE",
  MY_NODE_COPIED = "MY_NODE_COPIED",
  INVOICE_COPIED = "INVOICE_COPIED",
  RECOMMENDATION_LIST = "RECOMMENDATION_LIST",
}

export const tooltips = {
  CONNECTING: <p>connecting...</p>,
  CONNECTED: (
    <p>Enter your ⚡️ node's pubkey to find recommended channel partners.</p>
  ),
  QR_CODE: (
    nodeCount: number,
    invoice: LndInvoiceResponseDto,
    onClick: () => void
  ) => (
    <p>
      Found {nodeCount} nodes. Pay the invoice to continue.
      <br />
      <br />
      <QRCodeSVG onClick={onClick} value={invoice.request} size={260} />
    </p>
  ),
  NO_NODES_FOUND: <p>No nodes found. Try again later.</p>,
  SHOW_MY_NODE: (
    <p>
      Connect to my node!
      <br />
      <br />
      03a5f0c532cd4cc7a4d91956e6f66e1e80daee114e0be9244055168b005726d80c
      <br />
      <br />
      Click to copy pubkey.
    </p>
  ),
  MY_NODE_COPIED: <p>Node public key copied!</p>,
  INVOICE_COPIED: <p>Invoice copied!</p>,
  RECOMMENDATION_LIST: (
    <p>
      This is a opinionated list of nodes that might be good candidates to open
      channels to.
      <br />
      <br />
      They have a moderate amount of channels, but not too much so that the
      decentralized nature of the network stays intact.
    </p>
  ),
};
