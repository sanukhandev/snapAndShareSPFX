// src/webparts/snapAndShare/components/Post.tsx
import React, { Key } from "react";
import Slider from "react-slick"; // Importing the react-slick carousel
import IPostWithComments from "./SnapAndShare"; // Assuming this is where the interface is defined

interface IPostProps {
  post: IPostWithComments;
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onShare: (postId: number) => void;
}

const Post: React.FC<IPostProps> = ({ post, onAddComment, onLike, onShare }: IPostProps) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img src={post.avatarUrl} alt="User Avatar" />
        <h2>{post.user}</h2>
      </div>

      <Slider {...sliderSettings}>
        {post.images.map((image: { FileRef: string | undefined; }, index: Key | null | undefined) => (
          <div key={index}>
            <img src={image.FileRef} alt={`Post Image ${index}`} className="w-full" />
          </div>
        ))}
      </Slider>

      <div className="post-body">
        <p>{post.Title}</p>
        <button onClick={() => onLike(Number(post.ID))}>Like</button>
        <button onClick={() => onShare(Number(post.ID))}>Share</button>
        {/* Handle comment input and submission */}
      </div>
    </div>
  );
};

export default Post;
