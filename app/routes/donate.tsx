import Donate from "~/donate/page";
import type { Route } from "./+types/donate";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Ủng hộ dự án App Việt",
      description: "Ủng hộ dự án App Việt của chúng tôi",
    },
    {
      name: "og:image",
      content:
        "https://deewedding.com/wp-content/uploads/2023/10/372763945_844636273716650_9026782117946223657_n-682x1024.jpg.webp",
    },
  ];
}

export default function DonatePage() {
  return <Donate />;
}
