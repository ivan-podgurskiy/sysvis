# System Design Visualizer

An interactive system design playground for exploring how large-scale products move requests through distributed infrastructure.

The app renders architecture diagrams as animated React Flow canvases, then lets you run step-by-step scenarios that highlight request paths, service interactions, and data movement. It currently includes guided visualizations for:

- Twitter timeline fan-out
- Netflix streaming and CDN delivery
- Uber geospatial ride matching
- Google Search indexing and query serving
- Stripe payment orchestration

## Tech Stack

- [Next.js](https://nextjs.org) 16 and React 19
- [React Flow](https://reactflow.dev) for graph rendering
- [Framer Motion](https://www.framer.com/motion/) for scenario and particle animations
- Tailwind CSS 4, Geist fonts, and small Radix UI primitives

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create a production build
pnpm start    # Run the production server
pnpm lint     # Run ESLint
```

## Project Structure

```text
src/app/                         Next.js app entry point and global styles
src/components/visualizer.tsx     Main visualizer shell and scenario controls
src/components/graph-canvas/      React Flow canvas, custom nodes, and custom edges
src/components/detail-panel/      Scenario timeline and step details
src/components/architecture-selector/
                                  Architecture picker and preview cards
src/hooks/use-scenario-runner.ts  Scenario playback state machine
src/lib/architectures.ts          Architecture graph data and scenario definitions
```

## Adding Architectures

New visualizations are data-driven. Add an entry to `src/lib/architectures.ts` with:

- `nodes`: services, databases, queues, clients, caches, and other system components
- `edges`: connections between nodes
- `scenarios`: ordered steps that animate traffic through the graph

Each scenario step defines a source node, target node, short explanation, color category, and delay. The visualizer uses that data to animate the request path and populate the detail panel.

