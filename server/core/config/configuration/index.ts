import channelNinja from './channel-ninja.config';
import database from './database.config';
import lndNode from './lnd-node.config';
import suggestions from './suggestions.config';

const configuration = () => ({
  lndNode: lndNode(),
  database: database(),
  channelNinja: channelNinja(),
  suggestions: suggestions(),
});

export default configuration;
