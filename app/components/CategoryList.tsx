import React from "react";
import { Link } from "react-router";

interface CategoryProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgColor?: string;
  to?: string;
}

interface CategoryListProps {
  title: string;
  categories: CategoryProps[];
}

export const CategoryItem: React.FC<CategoryProps> = ({
  id,
  name,
  icon,
  bgColor = "bg-blue-500",
  to = "",
}) => {
  const Content = () => (
    <div className="flex flex-col items-center">
      <div
        className={`${bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-2`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <span className="text-xs text-center font-medium">{name}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        <Content />
      </Link>
    );
  }

  return <Content />;
};

export const CategoryList: React.FC<CategoryListProps> = ({
  title,
  categories,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            bgColor={category.bgColor}
            to={category.to}
          />
        ))}
      </div>
    </section>
  );
};
