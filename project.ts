import {
  CosmosDatasourceKind,
  CosmosHandlerKind,
  CosmosProject,
} from "@subql/types-cosmos";

import * as dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'production';

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env${mode !== 'production' ? `.${mode}` : ''}`);
dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the genreic param
const project: CosmosProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "neutron-starter",
  description:
    "This project can be use as a starting point for developing your Cosmos neutron based SubQuery project",
  runner: {
    node: {
      name: "@subql/node-cosmos",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  
  network: {
    /* The unique chainID of the Cosmos Zone */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.ENDPOINT!?.split(',') as string[] | string,
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 13379322,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleAirdropClaim",
            kind: CosmosHandlerKind.Message,
            filter: {
              includeFailedTx: false,
              type: "/cosmwasm.wasm.v1.MsgExecuteContract",
              contractCall: "claim",
              values: {
                contract:
                  "neutron198sxsrjvt2v2lln2ajn82ks76k97mj72mtgl7309jehd0vy8rezs7e6c56",
              },
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
