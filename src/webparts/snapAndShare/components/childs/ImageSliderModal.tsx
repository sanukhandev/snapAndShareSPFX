import * as React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  // Update userComment when props change
  componentDidUpdate(prevProps: ImageSliderModalProps): void {
    if (prevProps.userComment !== this.props.userComment) {
      this.setState({ userComment: this.props.userComment });
    }
  }

  // Handle comment text change
  handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ userComment: e.target.value });
  }

  // Handle adding a comment
  handleAddComment(): void {
    const { postId, onAddComment } = this.props;
    const { userComment } = this.state;
    if (userComment.trim()) {
      onAddComment(postId, userComment);
      this.setState({ userComment: "" }); // Clear comment after adding
    }
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
      adaptiveHeight: true,
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-slider-modal-title"
      >
        <div className="relative bg-white w-full md:w-4/5 lg:w-3/4 xl:w-2/3 h-5/6 flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-black text-2xl z-10 focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Image Slider */}
          <div className="w-full md:w-2/3 bg-black rounded-l-lg overflow-hidden">
            <Slider {...sliderSettings}>
              {images.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`Slide ${index + 1}`}
                    className="object-contain w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Caption and Comments Section */}
          <div className="w-full md:w-1/3 p-4 bg-gray-50 flex flex-col justify-between overflow-y-auto">
            <div>
              <h4
                id="image-slider-modal-title"
                className="text-xl font-bold mb-2 text-gray-700"
              >
                {user}
              </h4>
              <p className="italic text-gray-500 mb-4 text-lg">
                &quot;{caption}&quot;
              </p>

              {/* Comments */}
              <div className="mb-4">
                <h5 className="text-md font-semibold text-gray-600">
                  Comments
                </h5>
                {comments.length > 0 ? (
                  comments.map((comment, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-sm text-gray-700">
                        <strong>@{comment.CommentAuthor.Title}</strong>: &quot;
                        {comment.Title}&quot;
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            </div>

            {/* Add Comment */}
            <div>
              <textarea
                placeholder="Write a comment..."
                className="w-full border border-gray-300 p-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={userComment}
                onChange={this.handleCommentChange}
                aria-label="Write a comment"
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none"
                onClick={this.handleAddComment}
                aria-label="Add comment"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageSliderModal;
