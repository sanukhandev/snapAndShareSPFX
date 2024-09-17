import * as React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface IComment {
  CommentAuthor: {
    Title: string;
  };
  Title: string;
}

interface ImageSliderModalProps {
  images: string[];
  caption: string;
  comments: IComment[];
  postId: number;
  user: string;
  userComment: string;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: number, comment: string) => void;
}

interface ImageSliderModalState {
  userComment: string;
}

class ImageSliderModal extends React.Component<
  ImageSliderModalProps,
  ImageSliderModalState
> {
  constructor(props: ImageSliderModalProps) {
    super(props);

    this.state = {
      userComment: this.props.userComment || "",
    };

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  // Handle comment text change
  handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ userComment: e.target.value });
  }

  // Handle adding a comment
  handleAddComment(): void {
    const { postId, onAddComment } = this.props;
    const { userComment } = this.state;
    onAddComment(postId, userComment);
    this.setState({ userComment: "" }); // Clear comment after adding
  }

  render(): React.ReactElement<ImageSliderModalProps> | undefined {
    const { images, caption, comments, user, isOpen, onClose } = this.props;
    const { userComment } = this.state;

    if (!isOpen) return undefined;

    // Slider settings for react-slick
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative bg-white w-4/5 h-4/5 flex">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl z-10"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Image Slider */}
          <div className="w-2/3 bg-black">
            <Slider {...sliderSettings}>
              {images.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Caption and Comments Section */}
          <div className="w-1/3 p-4">
            <h4 className="text-lg font-bold mb-2">{user}</h4>
            <p className="italic text-gray-600 mb-4">&quot;{caption}&quot;</p>

            {/* Comments */}
            <div className="mb-4">
              <h5 className="text-md font-semibold">Comments</h5>
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-sm">
                      <strong>
                        {comment.CommentAuthor.Title.split(" ")[0]}
                      </strong>
                      : {comment.Title}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add Comment */}
            <textarea
              placeholder="Write a comment..."
              className="w-full border p-2 mt-2 rounded-lg"
              value={userComment}
              onChange={this.handleCommentChange}
            />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
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

export default ImageSliderModal;
