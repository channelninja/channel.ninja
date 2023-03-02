import { createSelector } from '@reduxjs/toolkit';
import { selectIsOpenChannelDialogOpen } from '../../features/WebLN/web-ln-slice';
import {
  selectInvoice,
  selectInvoicePaid,
  selectIsSocketConnected,
  selectNodes,
  selectPubKey,
} from '../../redux/global-slice';
import { NinjaText } from './ninja-text.enum';

export const selectNinjaText = createSelector(
  selectIsSocketConnected,
  selectPubKey,
  selectInvoice,
  selectInvoicePaid,
  selectNodes,
  selectIsOpenChannelDialogOpen,
  (isSocketConnected, pubKey, invoice, invoicePaid, nodes, isOpenChannelDialogOpen) => {
    if (!isSocketConnected) {
      return NinjaText.CONNECTING;
    }

    if (isOpenChannelDialogOpen) {
      return NinjaText.OPEN_CHANNEL;
    }

    if (!pubKey && !nodes && !invoice && !invoicePaid) {
      return NinjaText.CONNECTED;
    }

    if (nodes && nodes.length === 0) {
      return NinjaText.NO_NODES_FOUND;
    }

    if (pubKey && !invoice) {
      return NinjaText.LOADING;
    }

    if (pubKey && nodes && invoice && !invoicePaid) {
      return NinjaText.QR_CODE;
    }

    if (invoicePaid) {
      return NinjaText.RECOMMENDATION_LIST;
    }
  },
);
