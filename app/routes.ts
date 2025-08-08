import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("donate", "routes/donate.tsx"),
  // Search and App store pages
  route("search", "routes/search.tsx"),
  route("games", "routes/games.tsx"),
  route("arcade", "routes/arcade.tsx"),
  route("app-store", "routes/app-store.tsx"),
  // Lotto Room
  route("create-lotto-room", "routes/create-lotto-room.tsx"),
  route("join-lotto-room", "routes/join-lotto-room.tsx"),
  route("lotto-room/:id", "routes/lotto-room.tsx"),
  // Thirteen Card Room
  route("create-thirteen-card-room", "routes/create-thirteen-card-room.tsx"),
  route("join-thirteen-card-room", "routes/join-thirteen-card-room.tsx"),
  route("thirteen-card-room/:id", "routes/thirteen-card-room.tsx"),
  // Thirteen Card Game History
  route(
    "thirteen-card-game-history/:id",
    "routes/thirteen-card-game-history.tsx"
  ),
  // Thirteen Card Game Detail
  route(
    "thirteen-card-game-detail/:id",
    "routes/thirteen-card-game-detail.tsx"
  ),
  // Tournament
  route("create-tournament", "routes/create-tournament.tsx"),
  route("join-tournament", "routes/join-tournament.tsx"),
  route("round-robin-tournament/:id", "routes/round-robin-tournament.tsx"),
  // Count Down
  route("count-down", "routes/count-down.tsx"),
  // Coming Soon
  route("coming-soon", "coming-soon/page.tsx"),
  // About
  route("about", "about/page.tsx"),
  // Contact
  route("contact", "contact/page.tsx"),
  // Flappy Bird
  route("flappy-bird", "game-flappy-bird/page.tsx"),
  // Weather
  route("weather", "weather/page.tsx"),
  // Keyboard Tester
  route("keyboard-tester", "keyboard-tester/page.tsx"),
  // Wedding Invitation
  route("thiep-cuoi/:slug", "routes/wedding-invitation.tsx"),
  // Entertainment
  route("entertainment", "entertainment/page.tsx"),
  // Duocards
  route("flash-cards", "./flash-cards-vocablary/page.tsx"),
] satisfies RouteConfig;
