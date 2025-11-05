import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

// Allow overriding the RPC via env var for local/dev workflows.
// If NEXT_PUBLIC_SEPOLIA_RPC_URL is not set, wagmi will use its default transport.
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: sepoliaRpcUrl ? http(sepoliaRpcUrl) : http(),
  },
});
