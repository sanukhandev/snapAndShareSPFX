import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

interface IPost {
  id: number;
  title: string;
  postedBy: string;
  postedByEmail: string;
  postedByRole: string;
  likes: string;
  images: string[];
  comments: IComment[];
}
interface IComment {
  id: number;
  comment: string;
  postedBy: string;
  likes?: string;
}

interface PostProps {
  post: IPost;
  userId: number;
  likedPosts: Set<number>;
  likedComments: Set<number>;
  onLikePost: (postId: number) => void;
  onLikeComment: (commentId: number) => void;
  onAddComment: (postId: number, comment: string) => void;
}

interface PostState {
  isModalOpen: boolean;
  selectedImage: number;
  newComment: string;
}

class Post extends React.Component<PostProps, PostState> {
  constructor(props: PostProps) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedImage: 0,
      newComment: "",
    };
  }

  openModal = (index: number): void => {
    this.setState({ selectedImage: index, isModalOpen: true });
  };

  handleCommentSubmit = (): void => {
    if (this.state.newComment.trim()) {
      this.props.onAddComment(this.props.post.id, this.state.newComment);
      this.setState({ newComment: "" });
    }
  };

  render(): JSX.Element {
    const { post, onLikePost, onLikeComment } = this.props;
    return (
      <div className="post-container border p-4 mb-5 rounded-3">
        <h3>{post.title}</h3>
        <p className="text-muted text-base small">
          By <span className="text-black">{post.postedBy}</span>
        </p>

        <div className="row">
          {post.images.slice(0, 2).map((img, index) => (
            <div key={index} className="col-4">
              <div
                className="w-100 position-relative rounded-4"
                onClick={() => this.openModal(index)}
              >
                <img
                  className="img-thumbnail w-100 rounded-4 p-0"
                  src={img}
                  alt="Post"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex align-items-center my-4">
          <button
            className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white px-3 py-1 fw-bold"
            onClick={() => onLikePost(post.id)}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={
                post.likes.split(";").includes(this.props.userId + "")
                  ? "text-red-500"
                  : "text-gray-500"
              }
            />
            {post.likes.split(";").length}
          </button>
        </div>

        <div className="mt-2 d-flex">
          <input
            type="text"
            className="form-control comment-box"
            placeholder="Add your comment"
            value={this.state.newComment}
            onChange={(e) => this.setState({ newComment: e.target.value })}
          />
          <button
            className="btn btn-danger ms-2 btn btn-primary text-white ms-4"
            onClick={this.handleCommentSubmit}
          >
            Comment
          </button>
        </div>

        <div className="mt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="d-flex align-items-start mb-3">
              <div
                className="user-avatar bg-danger d-flex align-items-center justify-content-center me-3 p-2 rounded-circle text-white"
                style={{ width: "40px", height: "40px" }}
              >
                {comment.postedBy
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0">
                  <strong>{comment.postedBy}</strong>
                  <span className="text-muted small"> Feb 28 2025</span>
                </h6>
                <p className="mb-1">{comment.comment}</p>
              </div>
              {/* <div>
                <button
                  className="btn btn-secondary d-inline-flex align-items-center rounded-5 text-white text-12 px-3 py-1 fw-bold"
                  onClick={() => onLikeComment(comment.id)}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={
                      (comment.likes || "")
                        .split(";")
                        .includes(this.props.userId + "")
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />
                  {post.likes.split(";").length}
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {this.state.isModalOpen && (
          <Modal
            onClose={() => this.setState({ isModalOpen: false })}
            images={post.images}
          />
        )}
      </div>
    );
  }
}

export default Post;
