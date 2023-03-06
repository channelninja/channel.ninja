import { useFormik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import Button from '../../../components/Button/Button';
import { useTimeoutTooltip } from '../../../components/Ninja/hooks/use-timeout-tooltip';
import { TooltipKey } from '../../../components/Ninja/tooltip.enum';
import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { FeesService, NodeResponseDto } from '../../../generated';
import { channelOpened } from '../../../redux/global-slice';
import { useAppDispatch } from '../../../redux/hooks';
import { openChannelTargetNodeChanged } from '../web-ln-slice';
import { getTransactionId } from './utils/get-transaction-id';

type ChannelOpenParams = {
  capacity: number;
  fee: number;
  // baseFee: number;
  // feeRate: number;
};

const OpenChannelForm = ({ node }: { node: NodeResponseDto }) => {
  const setTooltip = useTimeoutTooltip();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');

  const { data: onchainFeeEstimate } = useQuery('onchainFeeEstimate', FeesService.getOnchainFeesEstimate);

  const handleOpenChannel = async (values: ChannelOpenParams) => {
    setError('');

    if (window.webln) {
      try {
        await window.webln.request('connectpeer', { addr: { pubkey: node.id, host: node.sockets[0] } });
      } catch (error) {
        const err = error as Error;
        console.error(error);

        if (!err.message.includes('already connected to peer')) {
          setError(err.message);
          setTooltip(TooltipKey.CHANNEL_OPENED_FAIL);

          return;
        }
      }

      try {
        const res = (await window.webln.request('openchannel', {
          node_pubkey_string: node.id,
          local_funding_amount: values.capacity,
          sat_per_vbyte: values.fee,
          // fee_rate: values.feeRate,
          // base_fee: values.baseFee,
          // use_base_fee: true,
          // use_fee_rate: true,
        })) as { funding_txid_bytes?: string };

        if (res.funding_txid_bytes) {
          const transactionId = getTransactionId(res.funding_txid_bytes);

          dispatch(channelOpened({ transactionId, pubKey: node.id }));
        }

        setTooltip(TooltipKey.CHANNEL_OPENED);
        dispatch(openChannelTargetNodeChanged(undefined));
      } catch (error) {
        setError((error as Error).message);
        setTooltip(TooltipKey.CHANNEL_OPENED_FAIL);
      }
    }
  };

  const handleSubmit = (values: ChannelOpenParams) => {
    handleOpenChannel(values);
  };

  const validationSchema = Yup.object().shape({
    capacity: Yup.number().min(100_000, 'Capacity is too low!').required('Required'),
    fee: Yup.number().min(1, 'Fee is to low!').required('Required'),
  });

  const form = useFormik({
    initialValues: {
      capacity: 500_000,
      fee: onchainFeeEstimate?.fastestFee || 1,
      // feeRate: 500,
      // baseFee: 0,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <form
      onSubmit={form.handleSubmit}
      className="flex h-full flex-col"
    >
      <div className="-mr-8 flex flex-wrap">
        <div className="mb-8 w-full pr-8 sm:w-1/2">
          <NumberInput
            label="Capacity"
            unit="sats"
            required
            step={100_000}
            min={100_000}
            {...form.getFieldProps('capacity')}
            error={form.touched.capacity && form.errors.capacity ? form.errors.capacity : ''}
          />
        </div>

        {/* <div className="w-full sm:w-1/2 pr-8 mb-8">
          <NumberInput
            label="Base Fee"
            required
            unit="sats"
            {...form.getFieldProps("baseFee")}
          />
        </div>

        <div className="w-full sm:w-1/2 pr-8 mb-8">
          <NumberInput
            label="Fee Rate"
            required
            unit="ppm"
            {...form.getFieldProps("feeRate")}
          />
        </div> */}

        <div className="mb-8 w-full pr-8 sm:w-1/2">
          <NumberInput
            label="Funding Fee"
            required
            unit="sats/vB"
            {...form.getFieldProps('fee')}
            error={form.touched.fee && form.errors.fee ? form.errors.fee : ''}
          />
        </div>
      </div>

      <div>{error}</div>

      <div className="mt-8 text-right">
        <Button type="submit">open channel</Button>
      </div>
    </form>
  );
};

export default OpenChannelForm;
