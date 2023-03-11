export type UpdateNode = {
  alias: string;
  color: string;
  features: {
    bit: number;
    is_known: boolean;
    is_required: boolean;
    type: string;
  }[];
  public_key: string;
  sockets: string[];
  updated_at?: string;
};
