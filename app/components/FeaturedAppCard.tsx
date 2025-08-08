import React from "react";
import { Link } from "react-router";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

interface FeaturedAppCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  to?: string;
  tagline?: string;
  actionLabel?: string;
}

export const FeaturedAppCard: React.FC<FeaturedAppCardProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  to = "",
  tagline,
  actionLabel = "GET",
}) => {
  const CardContent = () => (
    <Card>
      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="text-xs text-blue-600 font-medium uppercase">
            {subtitle}
          </div>
        </div>
        <h3 className="font-bold text-base mb-1">{title}</h3>
        {tagline && <p className="text-sm mb-3">{tagline}</p>}
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: "9999px",
          }}
        >
          {actionLabel}
        </Button>
      </div>
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};
