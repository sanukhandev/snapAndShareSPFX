import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

interface IPost {
  id: number;
  title: string;
  postedBy: string;
  images: string[];
  likes: number;
  comments: IComment[];
}

interface IComment {
  id: number;
  comment: string;
  postedBy: string;
  likes?: number;
}

interface PostProps {
  post: IPost;
  likedPosts: Set<number>;
  likedComments: Set<number>;
  onLikePost: (postId: number) => void;
  onLikeComment: (commentId: number) => void;
}

const Post: React.FC<PostProps> = ({
  post,
  likedPosts,
  likedComments,
  onLikePost,
  onLikeComment,
}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);

  const openModal = (index: number): void => {
    setSelectedImage(index);
    setModalOpen(true);
  };

  return (
    <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
      <h3 className="font-bold text-lg mb-1">{post.title}</h3>
      <p className="text-sm text-gray-500 mb-2">By {post.postedBy}</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        {post.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Post"
            width={160}
            className="w-24 h-24 object-cover rounded-md cursor-pointer"
            onClick={() => openModal(index)}
          />
        ))}
      </div>
      <div className="flex items-center mt-2 space-x-2">
        <FontAwesomeIcon
          icon={faHeart}
          className={`cursor-pointer text-lg ${
            likedPosts.has(post.id) ? "text-red-500" : "text-gray-500"
          }`}
          onClick={() => onLikePost(post.id)}
        />
        <span>({post.likes}) Likes</span>
      </div>
      <div className="mt-2 space-y-2">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-blue-500 cursor-pointer">
              @{comment.postedBy}
            </p>
            <p className="text-sm italic flex-1">{comment.comment}</p>
            <FontAwesomeIcon
              icon={faHeart}
              className={`cursor-pointer text-lg ${
                likedComments.has(comment.id) ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() => onLikeComment(comment.id)}
            />
          </div>
        ))}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img
              src={post.images[selectedImage]}
              alt="Selected"
              className="max-w-full max-h-screen mx-auto"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Post;
