import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import ImageSliderModal from "./ImageSliderModal";
import LikeShareActions from "./LikeShareActions";

interface Comment {
  id: number;
  comment: string;
  postedBy: string;
  postedByEmail: string;
  Title: string;
}

interface PostProps {
  post: {
    id: number;
    title: string;
    postedBy: string;
    postedByEmail: string;
    postedByRole: string;
    likes: number;
    images: string[];
    comments: Comment[];
  };
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onShare: (postId: number) => void;
}

interface PostState {
  userComment: string;
  isModalOpen: boolean;
}

class Post extends React.Component<PostProps, PostState> {
  constructor(props: PostProps) {
    super(props);
    this.state = {
      userComment: "",
      isModalOpen: false,
    };
  }

  openModal = (): void => {
    this.setState({ isModalOpen: true });
  };

  closeModal = (): void => {
    this.setState({ isModalOpen: false });
  };

  handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ userComment: e.target.value });
  };

  handleAddComment = (): void => {
    const { userComment } = this.state;
    if (userComment.trim()) {
      this.props.onAddComment(this.props.post.id, userComment);
      this.setState({ userComment: "" });
    }
  };

  render(): JSX.Element {
    const { post, onLike, onShare } = this.props;
    const { isModalOpen, userComment } = this.state;

    const latestComment = post.comments.length
      ? post.comments[0]
      : { id: 0, comment: "No comments yet." };

    return (
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="p-4 border-b flex items-center">
          <div className="flex flex-col">
            <h4 className="text-lg font-bold">{post.postedBy}</h4>
            <p className="text-gray-500">{post.postedByRole}</p>
          </div>
        </div>

        <div
          className="w-full h-64 overflow-hidden flex justify-center items-center cursor-pointer"
          onClick={this.openModal}
        >
          <img
            src={post.images[0]}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        {isModalOpen && (
          <ImageSliderModal
            images={post.images.map((image) => ({ FileRef: image }))}
            caption={post.title}
            comments={post.comments.map(comment => ({
              CommentAuthor: { Title: comment.postedBy },
              Title: comment.comment
            }))}
            postId={post.id}
            user={post.postedBy}
            userComment={userComment}
            isOpen={isModalOpen}
            onClose={this.closeModal}
            onAddComment={this.props.onAddComment}
          />
        )}

        <div className="p-4">
          <p className="italic text-gray-600 text-small ml-2">
            &quot;{post.title}&quot;
          </p>
          <div className="mt-4 flex justify-between">
            <LikeShareActions
              isLiked={post.likes > 0}
              likeCount={post.likes}
              onLike={() => onLike(post.id)}
              onShare={() => onShare(post.id)}
            />
            <button className="text-blue-500 flex items-center">
              <FontAwesomeIcon icon={faComment} className="m-2" /> Comment
            </button>
          </div>

          <div className="mt-2">
            <div className="flex items-start space-x-4 mt-2">
              <div className="bg-gray-100 rounded-lg p-2 shadow-md w-full">
                <p className="text-gray-700 font-semibold">@{post.postedBy}</p>
                <p className="text-gray-600">{latestComment.comment}</p>
              </div>
            </div>

            <textarea
              value={userComment}
              onChange={this.handleCommentChange}
              placeholder="Write a comment..."
              className="w-full border p-2 mt-2 rounded-lg"
            />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={this.handleAddComment}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
