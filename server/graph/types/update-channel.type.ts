export type UpdateChannel = {
  base_fee_mtokens: string;
  capacity: number;
  cltv_delta: number;
  fee_rate: number;
  id: string;
  is_disabled: boolean;
  max_htlc_mtokens: string;
  min_htlc_mtokens: string;
  public_keys: [string, string];
  transaction_id: string;
  transaction_vout: number;
  updated_at?: string;
};
