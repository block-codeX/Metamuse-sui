import { createFileRoute } from '@tanstack/react-router';
import DrawingCanvas from '../components/DrawingCanvas';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Header from "../components/Navs/Header";

export const Route = createFileRoute('/drawing-canvas')({
  component: () => {
    return (
      <div className="relative">
        <ThirdwebProvider activeChain={ChainId.Arbitrum}> {/* Arbitrum chain ID */}
          <Header />
        </ThirdwebProvider>
        <DrawingCanvas/>
      </div>
    );
  },
});
