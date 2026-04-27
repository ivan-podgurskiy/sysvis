export type NodeType =
  | "client"
  | "gateway"
  | "service"
  | "cache"
  | "database"
  | "queue"
  | "cdn"
  | "storage"
  | "worker"
  | "index";

export interface ArchNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  position: { x: number; y: number };
  size?: "sm" | "md" | "lg";
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export type ScenarioColor = "write" | "read" | "error" | "process";

export interface ScenarioStep {
  from: string;
  to: string;
  description: string;
  color: ScenarioColor;
  delayMs: number;
}

export interface Scenario {
  id: string;
  label: string;
  steps: ScenarioStep[];
}

export interface Architecture {
  id: string;
  label: string;
  description: string;
  tagline: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  scenarios: Scenario[];
}

export const architectures: Architecture[] = [
  // ─── TWITTER ───────────────────────────────────────────────────────────────
  {
    id: "twitter",
    label: "Twitter",
    description: "Fan-out on write",
    tagline: "How 500M tweets/day reach your timeline in milliseconds",
    nodes: [
      {
        id: "client",
        label: "Client",
        type: "client",
        description: "Mobile / web app",
        position: { x: 60, y: 310 },
        size: "md",
      },
      {
        id: "api-gateway",
        label: "API Gateway",
        type: "gateway",
        description: "Rate limiting, routing",
        position: { x: 330, y: 310 },
        size: "md",
      },
      {
        id: "auth",
        label: "Auth Service",
        type: "service",
        description: "JWT validation",
        position: { x: 330, y: 130 },
        size: "sm",
      },
      {
        id: "tweet-service",
        label: "Tweet Service",
        type: "service",
        description: "Write / read tweets",
        position: { x: 600, y: 310 },
        size: "lg",
      },
      {
        id: "kafka",
        label: "Kafka",
        type: "queue",
        description: "Event streaming bus",
        position: { x: 900, y: 310 },
        size: "lg",
      },
      {
        id: "fanout-worker",
        label: "Fanout Worker",
        type: "worker",
        description: "Pushes to follower timelines",
        position: { x: 1170, y: 180 },
        size: "md",
      },
      {
        id: "timeline-cache",
        label: "Timeline Cache",
        type: "cache",
        description: "Redis — pre-computed timelines",
        position: { x: 1460, y: 180 },
        size: "md",
      },
      {
        id: "user-db",
        label: "User DB",
        type: "database",
        description: "Postgres — user profiles",
        position: { x: 600, y: 500 },
        size: "md",
      },
      {
        id: "search-indexer",
        label: "Search Indexer",
        type: "index",
        description: "Elasticsearch ingestion",
        position: { x: 1170, y: 430 },
        size: "sm",
      },
      {
        id: "notification",
        label: "Notification Service",
        type: "service",
        description: "Push / email alerts",
        position: { x: 1460, y: 430 },
        size: "sm",
      },
    ],
    edges: [
      { id: "e1", source: "client", target: "api-gateway" },
      { id: "e2", source: "api-gateway", target: "auth" },
      { id: "e3", source: "api-gateway", target: "tweet-service" },
      { id: "e4", source: "tweet-service", target: "user-db" },
      { id: "e5", source: "tweet-service", target: "kafka" },
      { id: "e6", source: "kafka", target: "fanout-worker" },
      { id: "e7", source: "kafka", target: "search-indexer" },
      { id: "e8", source: "kafka", target: "notification" },
      { id: "e9", source: "fanout-worker", target: "timeline-cache" },
      { id: "e10", source: "timeline-cache", target: "client", label: "read" },
    ],
    scenarios: [
      {
        id: "post-tweet",
        label: "Post Tweet",
        steps: [
          {
            from: "client",
            to: "api-gateway",
            description: "Client sends POST /tweet with auth token.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "auth",
            description: "Gateway validates JWT with Auth Service.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "api-gateway",
            to: "tweet-service",
            description: "Authenticated request forwarded to Tweet Service.",
            color: "write",
            delayMs: 800,
          },
          {
            from: "tweet-service",
            to: "user-db",
            description: "Tweet written to Postgres with user metadata.",
            color: "write",
            delayMs: 1200,
          },
          {
            from: "tweet-service",
            to: "kafka",
            description: "TweetCreated event published to Kafka topic.",
            color: "write",
            delayMs: 1600,
          },
          {
            from: "kafka",
            to: "fanout-worker",
            description: "Fanout Worker consumes event, iterates follower list.",
            color: "process",
            delayMs: 2100,
          },
          {
            from: "fanout-worker",
            to: "timeline-cache",
            description:
              "Tweet ID prepended to each follower's timeline in Redis.",
            color: "write",
            delayMs: 2600,
          },
          {
            from: "kafka",
            to: "notification",
            description: "Notification Service triggers push alerts.",
            color: "process",
            delayMs: 2200,
          },
        ],
      },
      {
        id: "load-timeline",
        label: "Load Timeline",
        steps: [
          {
            from: "client",
            to: "api-gateway",
            description: "Client requests GET /timeline.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "tweet-service",
            description: "Gateway routes read request.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "tweet-service",
            to: "timeline-cache",
            description:
              "Tweet Service reads pre-computed timeline IDs from Redis.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "timeline-cache",
            to: "client",
            description: "Cached timeline returned — p99 < 10ms.",
            color: "read",
            delayMs: 1200,
          },
        ],
      },
      {
        id: "search-tweets",
        label: "Search Tweets",
        steps: [
          {
            from: "client",
            to: "api-gateway",
            description: "Client sends search query.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "tweet-service",
            description: "Tweet Service handles search routing.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "tweet-service",
            to: "search-indexer",
            description: "Query sent to Elasticsearch for full-text search.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "search-indexer",
            to: "client",
            description: "Ranked results returned to the client.",
            color: "read",
            delayMs: 1400,
          },
        ],
      },
    ],
  },

  // ─── NETFLIX ───────────────────────────────────────────────────────────────
  {
    id: "netflix",
    label: "Netflix",
    description: "Streaming + CDN",
    tagline: "How video reaches 270M subscribers with 99.99% uptime",
    nodes: [
      {
        id: "client",
        label: "Client",
        type: "client",
        description: "Smart TV / mobile / browser",
        position: { x: 60, y: 310 },
        size: "md",
      },
      {
        id: "cdn-edge",
        label: "Open Connect",
        type: "cdn",
        description: "CDN edge server — peered ISP",
        position: { x: 380, y: 150 },
        size: "lg",
      },
      {
        id: "api-gateway",
        label: "API Gateway",
        type: "gateway",
        description: "Zuul — auth + routing",
        position: { x: 380, y: 450 },
        size: "md",
      },
      {
        id: "recommendation",
        label: "Recommendation",
        type: "service",
        description: "ML-based personalization",
        position: { x: 720, y: 160 },
        size: "lg",
      },
      {
        id: "metadata",
        label: "Metadata Service",
        type: "service",
        description: "Title info, thumbnails, cast",
        position: { x: 720, y: 420 },
        size: "md",
      },
      {
        id: "user-service",
        label: "User Service",
        type: "service",
        description: "Profiles, subscription state",
        position: { x: 720, y: 600 },
        size: "md",
      },
      {
        id: "playback-manifest",
        label: "Playback Manifest",
        type: "service",
        description: "Adaptive bitrate manifest",
        position: { x: 1040, y: 300 },
        size: "md",
      },
      {
        id: "encoding-pipeline",
        label: "Encoding Pipeline",
        type: "worker",
        description: "Transcodes to 1200+ profiles",
        position: { x: 1360, y: 150 },
        size: "lg",
      },
      {
        id: "s3",
        label: "S3 Storage",
        type: "storage",
        description: "Source + encoded video chunks",
        position: { x: 1360, y: 430 },
        size: "md",
      },
    ],
    edges: [
      { id: "e1", source: "client", target: "cdn-edge" },
      { id: "e2", source: "client", target: "api-gateway" },
      { id: "e3", source: "api-gateway", target: "recommendation" },
      { id: "e4", source: "api-gateway", target: "metadata" },
      { id: "e5", source: "api-gateway", target: "user-service" },
      { id: "e6", source: "api-gateway", target: "playback-manifest" },
      { id: "e7", source: "playback-manifest", target: "cdn-edge" },
      { id: "e8", source: "encoding-pipeline", target: "s3" },
      { id: "e9", source: "s3", target: "cdn-edge" },
      { id: "e10", source: "recommendation", target: "metadata" },
    ],
    scenarios: [
      {
        id: "play-video",
        label: "Play Video",
        steps: [
          {
            from: "client",
            to: "api-gateway",
            description: "Client sends play request with title ID.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "playback-manifest",
            description: "Playback Manifest Service generates ABR manifest.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "playback-manifest",
            to: "cdn-edge",
            description: "CDN edge selected based on ISP + geography.",
            color: "read",
            delayMs: 900,
          },
          {
            from: "cdn-edge",
            to: "client",
            description: "Video chunks streamed from nearest Open Connect node.",
            color: "read",
            delayMs: 1400,
          },
        ],
      },
      {
        id: "recommendations",
        label: "Get Recommendations",
        steps: [
          {
            from: "client",
            to: "api-gateway",
            description: "Client requests homepage recommendations.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "user-service",
            description: "Fetch user profile and viewing history.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "api-gateway",
            to: "recommendation",
            description: "ML models score 10k+ titles for this user.",
            color: "process",
            delayMs: 700,
          },
          {
            from: "recommendation",
            to: "metadata",
            description: "Enrich top-N results with title metadata.",
            color: "read",
            delayMs: 1300,
          },
          {
            from: "metadata",
            to: "client",
            description: "Personalized row returned to client.",
            color: "read",
            delayMs: 1800,
          },
        ],
      },
      {
        id: "upload-title",
        label: "Upload New Title",
        steps: [
          {
            from: "s3",
            to: "encoding-pipeline",
            description: "Raw video uploaded to S3 triggers encoding job.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "encoding-pipeline",
            to: "s3",
            description:
              "1200+ resolution/codec profiles written back to S3.",
            color: "write",
            delayMs: 800,
          },
          {
            from: "s3",
            to: "cdn-edge",
            description: "Encoded chunks distributed to Open Connect fleet.",
            color: "process",
            delayMs: 1600,
          },
          {
            from: "cdn-edge",
            to: "client",
            description: "Title becomes available for streaming globally.",
            color: "read",
            delayMs: 2400,
          },
        ],
      },
    ],
  },

  // ─── UBER ──────────────────────────────────────────────────────────────────
  {
    id: "uber",
    label: "Uber",
    description: "Geospatial matching",
    tagline: "How a ride request matches driver to rider in under 2 seconds",
    nodes: [
      {
        id: "rider-app",
        label: "Rider App",
        type: "client",
        description: "iOS / Android",
        position: { x: 60, y: 190 },
        size: "md",
      },
      {
        id: "driver-app",
        label: "Driver App",
        type: "client",
        description: "iOS / Android",
        position: { x: 60, y: 490 },
        size: "md",
      },
      {
        id: "location-service",
        label: "Location Service",
        type: "service",
        description: "GPS ingestion, ~5s heartbeat",
        position: { x: 380, y: 490 },
        size: "md",
      },
      {
        id: "geo-index",
        label: "Geo Index (H3)",
        type: "index",
        description: "Uber H3 hexagonal grid",
        position: { x: 700, y: 490 },
        size: "lg",
      },
      {
        id: "matching",
        label: "Matching Service",
        type: "service",
        description: "ETA + driver scoring",
        position: { x: 700, y: 270 },
        size: "lg",
      },
      {
        id: "trip-service",
        label: "Trip Service",
        type: "service",
        description: "Trip state machine",
        position: { x: 1010, y: 160 },
        size: "md",
      },
      {
        id: "pricing",
        label: "Pricing Service",
        type: "service",
        description: "Surge + base fare calculation",
        position: { x: 1010, y: 440 },
        size: "md",
      },
      {
        id: "payment",
        label: "Payment Service",
        type: "service",
        description: "Stripe / Braintree integration",
        position: { x: 1300, y: 160 },
        size: "md",
      },
      {
        id: "notification",
        label: "Notification Service",
        type: "service",
        description: "Push / SMS dispatch",
        position: { x: 1300, y: 440 },
        size: "sm",
      },
    ],
    edges: [
      { id: "e1", source: "rider-app", target: "matching" },
      { id: "e2", source: "driver-app", target: "location-service" },
      { id: "e3", source: "location-service", target: "geo-index" },
      { id: "e4", source: "geo-index", target: "matching" },
      { id: "e5", source: "matching", target: "trip-service" },
      { id: "e6", source: "matching", target: "pricing" },
      { id: "e7", source: "trip-service", target: "payment" },
      { id: "e8", source: "trip-service", target: "notification" },
      { id: "e9", source: "pricing", target: "matching" },
      { id: "e10", source: "payment", target: "rider-app" },
    ],
    scenarios: [
      {
        id: "request-ride",
        label: "Request a Ride",
        steps: [
          {
            from: "rider-app",
            to: "matching",
            description: "Rider taps 'Request' — destination + pickup sent.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "matching",
            to: "pricing",
            description: "Pricing Service calculates fare based on demand.",
            color: "read",
            delayMs: 500,
          },
          {
            from: "geo-index",
            to: "matching",
            description: "H3 index returns nearby drivers in hexagonal cells.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "matching",
            to: "trip-service",
            description: "Best driver selected — Trip created in state machine.",
            color: "write",
            delayMs: 1000,
          },
          {
            from: "trip-service",
            to: "notification",
            description: "Driver receives push notification with trip details.",
            color: "write",
            delayMs: 1500,
          },
        ],
      },
      {
        id: "driver-location",
        label: "Driver Location Update",
        steps: [
          {
            from: "driver-app",
            to: "location-service",
            description: "Driver heartbeat sent every 5 seconds via websocket.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "location-service",
            to: "geo-index",
            description: "Location written to H3 geospatial index.",
            color: "write",
            delayMs: 500,
          },
          {
            from: "geo-index",
            to: "matching",
            description:
              "Matching Service refreshes driver availability scores.",
            color: "process",
            delayMs: 1000,
          },
        ],
      },
      {
        id: "surge-pricing",
        label: "Trigger Surge Pricing",
        steps: [
          {
            from: "geo-index",
            to: "pricing",
            description:
              "Demand spike detected in H3 cell — rider/driver ratio threshold crossed.",
            color: "process",
            delayMs: 0,
          },
          {
            from: "pricing",
            to: "matching",
            description: "Surge multiplier applied to fare calculation.",
            color: "write",
            delayMs: 600,
          },
          {
            from: "matching",
            to: "rider-app",
            description: "Surge notification shown to riders in affected zone.",
            color: "write",
            delayMs: 1200,
          },
        ],
      },
    ],
  },

  // ─── GOOGLE SEARCH ─────────────────────────────────────────────────────────
  {
    id: "google",
    label: "Google Search",
    description: "Inverted index + shards",
    tagline: "How 8.5B queries/day return results in under 500ms",
    nodes: [
      {
        id: "client",
        label: "Client",
        type: "client",
        description: "Browser / search app",
        position: { x: 60, y: 330 },
        size: "md",
      },
      {
        id: "load-balancer",
        label: "Load Balancer",
        type: "gateway",
        description: "Anycast routing",
        position: { x: 340, y: 330 },
        size: "sm",
      },
      {
        id: "query-parser",
        label: "Query Parser",
        type: "service",
        description: "Tokenization + intent",
        position: { x: 600, y: 210 },
        size: "md",
      },
      {
        id: "spell-correction",
        label: "Spell Correction",
        type: "service",
        description: "Did you mean…",
        position: { x: 600, y: 450 },
        size: "sm",
      },
      {
        id: "shard-1",
        label: "Index Shard A",
        type: "index",
        description: "Inverted index partition",
        position: { x: 880, y: 80 },
        size: "md",
      },
      {
        id: "shard-2",
        label: "Index Shard B",
        type: "index",
        description: "Inverted index partition",
        position: { x: 880, y: 230 },
        size: "md",
      },
      {
        id: "shard-3",
        label: "Index Shard C",
        type: "index",
        description: "Inverted index partition",
        position: { x: 880, y: 380 },
        size: "md",
      },
      {
        id: "shard-4",
        label: "Index Shard D",
        type: "index",
        description: "Inverted index partition",
        position: { x: 880, y: 530 },
        size: "md",
      },
      {
        id: "ranker",
        label: "Ranker",
        type: "service",
        description: "PageRank + ML scoring",
        position: { x: 1160, y: 270 },
        size: "lg",
      },
      {
        id: "knowledge-graph",
        label: "Knowledge Graph",
        type: "database",
        description: "Entity + fact store",
        position: { x: 1160, y: 500 },
        size: "md",
      },
      {
        id: "result-cache",
        label: "Result Cache",
        type: "cache",
        description: "Memcached — popular queries",
        position: { x: 1460, y: 170 },
        size: "sm",
      },
      {
        id: "ads",
        label: "Ads Service",
        type: "service",
        description: "Auction + targeting",
        position: { x: 1460, y: 440 },
        size: "sm",
      },
    ],
    edges: [
      { id: "e1", source: "client", target: "load-balancer" },
      { id: "e2", source: "load-balancer", target: "query-parser" },
      { id: "e3", source: "load-balancer", target: "spell-correction" },
      { id: "e4", source: "query-parser", target: "shard-1" },
      { id: "e5", source: "query-parser", target: "shard-2" },
      { id: "e6", source: "query-parser", target: "shard-3" },
      { id: "e7", source: "query-parser", target: "shard-4" },
      { id: "e8", source: "shard-1", target: "ranker" },
      { id: "e9", source: "shard-2", target: "ranker" },
      { id: "e10", source: "shard-3", target: "ranker" },
      { id: "e11", source: "shard-4", target: "ranker" },
      { id: "e12", source: "ranker", target: "knowledge-graph" },
      { id: "e13", source: "ranker", target: "result-cache" },
      { id: "e14", source: "ranker", target: "ads" },
      { id: "e15", source: "result-cache", target: "client" },
    ],
    scenarios: [
      {
        id: "standard-search",
        label: "Standard Search",
        steps: [
          {
            from: "client",
            to: "load-balancer",
            description: "Query dispatched to nearest data center via Anycast.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "load-balancer",
            to: "query-parser",
            description:
              "Query tokenized, intent classified, operators extracted.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "query-parser",
            to: "shard-1",
            description: "Query fan-out across 4 index shards in parallel.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "query-parser",
            to: "shard-2",
            description: "Parallel shard B lookup.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "query-parser",
            to: "shard-3",
            description: "Parallel shard C lookup.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "query-parser",
            to: "shard-4",
            description: "Parallel shard D lookup.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "shard-1",
            to: "ranker",
            description: "Top candidates merged and ranked by PageRank + ML.",
            color: "process",
            delayMs: 1400,
          },
          {
            from: "ranker",
            to: "result-cache",
            description: "Results cached in Memcached for repeat queries.",
            color: "write",
            delayMs: 1900,
          },
          {
            from: "result-cache",
            to: "client",
            description: "10 blue links returned in ~200ms.",
            color: "read",
            delayMs: 2300,
          },
        ],
      },
      {
        id: "autocomplete",
        label: "Autocomplete",
        steps: [
          {
            from: "client",
            to: "load-balancer",
            description: "Keypress triggers suggest request (debounced 150ms).",
            color: "read",
            delayMs: 0,
          },
          {
            from: "load-balancer",
            to: "result-cache",
            description: "Popular prefix lookups served from Memcached.",
            color: "read",
            delayMs: 300,
          },
          {
            from: "result-cache",
            to: "client",
            description: "5 suggestions returned in < 50ms.",
            color: "read",
            delayMs: 600,
          },
        ],
      },
      {
        id: "image-search",
        label: "Image Search",
        steps: [
          {
            from: "client",
            to: "load-balancer",
            description: "Image search query sent.",
            color: "read",
            delayMs: 0,
          },
          {
            from: "load-balancer",
            to: "query-parser",
            description: "Query classified as image intent.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "query-parser",
            to: "knowledge-graph",
            description: "Entity linking enriches visual query context.",
            color: "read",
            delayMs: 800,
          },
          {
            from: "knowledge-graph",
            to: "ranker",
            description: "Image results ranked with visual relevance signals.",
            color: "process",
            delayMs: 1300,
          },
          {
            from: "ranker",
            to: "ads",
            description: "Contextual image ads auctioned.",
            color: "process",
            delayMs: 1700,
          },
          {
            from: "ranker",
            to: "client",
            description: "Image grid returned with metadata.",
            color: "read",
            delayMs: 2100,
          },
        ],
      },
    ],
  },

  // ─── STRIPE ────────────────────────────────────────────────────────────────
  {
    id: "stripe",
    label: "Stripe",
    description: "Payment orchestration",
    tagline: "How a card charge completes in 800ms with full auditability",
    nodes: [
      {
        id: "merchant",
        label: "Merchant Client",
        type: "client",
        description: "Checkout / API caller",
        position: { x: 60, y: 310 },
        size: "md",
      },
      {
        id: "api-gateway",
        label: "API Gateway",
        type: "gateway",
        description: "TLS termination, versioning",
        position: { x: 350, y: 310 },
        size: "md",
      },
      {
        id: "idempotency",
        label: "Idempotency Layer",
        type: "service",
        description: "Deduplication via idempotency keys",
        position: { x: 640, y: 160 },
        size: "md",
      },
      {
        id: "fraud",
        label: "Fraud Detection",
        type: "service",
        description: "Radar ML — risk scoring",
        position: { x: 640, y: 430 },
        size: "lg",
      },
      {
        id: "card-network",
        label: "Card Network",
        type: "service",
        description: "Visa / Mastercard network",
        position: { x: 960, y: 160 },
        size: "lg",
      },
      {
        id: "bank-auth",
        label: "Bank Authorization",
        type: "service",
        description: "Issuing bank approval",
        position: { x: 1270, y: 160 },
        size: "md",
      },
      {
        id: "ledger",
        label: "Ledger Service",
        type: "database",
        description: "Immutable double-entry ledger",
        position: { x: 960, y: 450 },
        size: "md",
      },
      {
        id: "webhook-dispatcher",
        label: "Webhook Dispatcher",
        type: "worker",
        description: "Retry queue + delivery",
        position: { x: 1270, y: 420 },
        size: "md",
      },
      {
        id: "merchant-webhook",
        label: "Merchant Webhook",
        type: "client",
        description: "Merchant's endpoint",
        position: { x: 1560, y: 420 },
        size: "sm",
      },
    ],
    edges: [
      { id: "e1", source: "merchant", target: "api-gateway" },
      { id: "e2", source: "api-gateway", target: "idempotency" },
      { id: "e3", source: "api-gateway", target: "fraud" },
      { id: "e4", source: "fraud", target: "card-network" },
      { id: "e5", source: "card-network", target: "bank-auth" },
      { id: "e6", source: "bank-auth", target: "card-network" },
      { id: "e7", source: "card-network", target: "ledger" },
      { id: "e8", source: "ledger", target: "webhook-dispatcher" },
      { id: "e9", source: "webhook-dispatcher", target: "merchant-webhook" },
      { id: "e10", source: "idempotency", target: "fraud" },
    ],
    scenarios: [
      {
        id: "charge-card",
        label: "Charge Card",
        steps: [
          {
            from: "merchant",
            to: "api-gateway",
            description: "POST /v1/charges with card token + amount.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "idempotency",
            description:
              "Idempotency key checked — prevents duplicate charges.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "api-gateway",
            to: "fraud",
            description:
              "Radar ML scores transaction risk in real time (< 100ms).",
            color: "process",
            delayMs: 700,
          },
          {
            from: "fraud",
            to: "card-network",
            description: "Authorization request sent to Visa / Mastercard.",
            color: "write",
            delayMs: 1200,
          },
          {
            from: "card-network",
            to: "bank-auth",
            description: "Bank validates available balance and approves.",
            color: "write",
            delayMs: 1700,
          },
          {
            from: "card-network",
            to: "ledger",
            description: "Approved charge written to double-entry ledger.",
            color: "write",
            delayMs: 2300,
          },
          {
            from: "ledger",
            to: "webhook-dispatcher",
            description: "payment_intent.succeeded event queued.",
            color: "write",
            delayMs: 2700,
          },
          {
            from: "webhook-dispatcher",
            to: "merchant-webhook",
            description: "Webhook delivered to merchant endpoint with retry.",
            color: "write",
            delayMs: 3100,
          },
        ],
      },
      {
        id: "refund",
        label: "Refund Payment",
        steps: [
          {
            from: "merchant",
            to: "api-gateway",
            description: "POST /v1/refunds with charge_id.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "api-gateway",
            to: "fraud",
            description: "Refund validated against original charge.",
            color: "read",
            delayMs: 400,
          },
          {
            from: "fraud",
            to: "card-network",
            description: "Reversal request sent to card network.",
            color: "write",
            delayMs: 900,
          },
          {
            from: "card-network",
            to: "ledger",
            description: "Refund entry written — ledger stays balanced.",
            color: "write",
            delayMs: 1500,
          },
          {
            from: "ledger",
            to: "webhook-dispatcher",
            description: "charge.refunded event dispatched.",
            color: "write",
            delayMs: 1900,
          },
          {
            from: "webhook-dispatcher",
            to: "merchant-webhook",
            description: "Merchant notified of successful refund.",
            color: "write",
            delayMs: 2300,
          },
        ],
      },
      {
        id: "webhook-retry",
        label: "Webhook Retry",
        steps: [
          {
            from: "ledger",
            to: "webhook-dispatcher",
            description: "Event enqueued for delivery.",
            color: "write",
            delayMs: 0,
          },
          {
            from: "webhook-dispatcher",
            to: "merchant-webhook",
            description: "First attempt — merchant endpoint returns 500.",
            color: "error",
            delayMs: 500,
          },
          {
            from: "webhook-dispatcher",
            to: "merchant-webhook",
            description: "Retry 1 after exponential backoff (30s).",
            color: "error",
            delayMs: 1200,
          },
          {
            from: "webhook-dispatcher",
            to: "merchant-webhook",
            description: "Retry 2 — endpoint recovers, returns 200.",
            color: "write",
            delayMs: 2000,
          },
        ],
      },
    ],
  },
];

export const getArchitecture = (id: string) =>
  architectures.find((a) => a.id === id);
