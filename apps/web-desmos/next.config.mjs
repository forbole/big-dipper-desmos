import nextTranslate from 'next-translate';

// for turborepo
import withTM from 'next-transpile-modules';
import withSentry from 'shared-utils/configs/withSentry.mjs';
import nextConfig from 'shared-utils/configs/next.mjs';

// each chain has its own chains/<chainName>.json
import config from 'shared-utils/configs/chains/desmos.json' assert { type: 'json' };

export default withTM(['ui'])(withSentry(nextTranslate(nextConfig(config))));
