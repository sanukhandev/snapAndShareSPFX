import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

interface IComment {
  CommentAuthor: {
    Title: string;
  };
  Title: string;
}

interface ImageSliderModalProps {
  images: { FileRef: string }[];
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
  currentImageIndex: number;
}

class ImageSliderModal extends React.Component<
  ImageSliderModalProps,
  ImageSliderModalState
> {
  constructor(props: ImageSliderModalProps) {
    super(props);
    this.state = {
      userComment: this.props.userComment || "",
      currentImageIndex: 0, // Track the current image in the slider
    };

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleNextImage = this.handleNextImage.bind(this);
    this.handlePrevImage = this.handlePrevImage.bind(this);
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

  // Handle next image
  handleNextImage(): void {
    const { currentImageIndex } = this.state;
    const { images } = this.props;
    this.setState({
      currentImageIndex: (currentImageIndex + 1) % images.length,
    });
  }

  // Handle previous image
  handlePrevImage(): void {
    const { currentImageIndex } = this.state;
    const { images } = this.props;
    this.setState({
      currentImageIndex:
        (currentImageIndex - 1 + images.length) % images.length,
    });
  }

  render(): React.ReactElement<ImageSliderModalProps> | undefined {
    const { images, caption, comments, user, isOpen, onClose } = this.props;
    const { userComment, currentImageIndex } = this.state;

    if (!isOpen) return undefined;

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
          <div className="w-full md:w-2/3 bg-black rounded-l-lg overflow-hidden relative">
            {images.length > 0 && (
              <>
                <img
                  src={images[currentImageIndex].FileRef}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="object-contain w-full h-full rounded-lg"
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-70 rounded-full p-2 z-20 hover:bg-opacity-100 transition-all duration-300"
                      onClick={this.handlePrevImage}
                    >
                      <FontAwesomeIcon icon={faChevronCircleLeft} size="2x" />
                    </button>
                    <button
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-70 rounded-full p-2 z-20 hover:bg-opacity-100 transition-all duration-300"
                      onClick={this.handleNextImage}
                    >
                      <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
                    </button>
                  </>
                )}
              </>
            )}
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
