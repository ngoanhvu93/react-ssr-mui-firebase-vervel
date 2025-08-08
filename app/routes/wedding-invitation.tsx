import WeddingInvitationPage from "~/wedding-invitation/page";
import type { Route } from "./+types/wedding-invitation";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Thư mời cưới - Đức Phú & Hồng Loan` },
    {
      name: "description",
      content: "Thư mời cưới của Đức Phú & Hồng Loan - Thứ Bảy, 23/08/2025",
    },
    {
      name: "og:image",
      content:
        "https://deewedding.com/wp-content/uploads/2023/10/372763945_844636273716650_9026782117946223657_n-682x1024.jpg.webp",
    },
  ];
}

export default function WeddingInvitationRoute() {
  return <WeddingInvitationPage />;
}
