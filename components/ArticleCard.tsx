import React from "react";
import Image from "next/image";

interface ArticleCardProps {
  image: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  date,
  title,
  description,
  tags,
}) => {
  return (
    <div className="rounded-xl overflow-hidden h-110 shadow-md hover:shadow-lg transition duration-300 bg-white">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
          priority={true}
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">{date}</p>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <div
          className="mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
