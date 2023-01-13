import { createSelector } from "@reduxjs/toolkit";
import {
  selectInvoice,
  selectInvoicePaid,
  selectIsSocketConnected,
  selectNodes,
  selectPubKey,
} from "../../redux/global-slice";
import { NinjaText } from "./ninja-text.enum";

export const selectNinjaText = createSelector(
  selectIsSocketConnected,
  selectPubKey,
  selectInvoice,
  selectInvoicePaid,
  selectNodes,
  (isSocketConnected, pubKey, invoice, invoicePaid, nodes) => {
    if (!isSocketConnected) {
      return NinjaText.CONNECTING;
    }

    if (!invoice && !invoicePaid) {
      return NinjaText.CONNECTED;
    }

    if (nodes && nodes.length === 0) {
      return NinjaText.NO_NODES_FOUND;
    }

    if (pubKey && invoice && !invoicePaid) {
      return NinjaText.QR_CODE;
    }

    if (invoicePaid) {
      return NinjaText.RECOMMENDATION_LIST;
    }
  }
);
