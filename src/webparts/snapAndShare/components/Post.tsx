// src/webparts/snapAndShare/components/Post.tsx
import React, { Component } from "react";
import IPostWithComments from "./SnapAndShare"; // Assuming this is where the interface is defined
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons"; // Icons for next/prev buttons

interface IPostProps {
  post: IPostWithComments;
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onShare: (postId: number) => void;
}

interface IPostState {
  currentImageIndex: number;
}

class Post extends Component<IPostProps, IPostState> {
  constructor(props: IPostProps) {
    super(props);
    this.state = {
      currentImageIndex: 0, // Track the current image in the carousel
    };

    this.handleNextImage = this.handleNextImage.bind(this);
    this.handlePrevImage = this.handlePrevImage.bind(this);
  }

  // Handle next image
  handleNextImage(): void {
    const { currentImageIndex } = this.state;
    const { post } = this.props;
    const { images } = post;

    this.setState({
      currentImageIndex: (currentImageIndex + 1) % images.length,
    });
  }

  // Handle previous image
  handlePrevImage(): void {
    const { currentImageIndex } = this.state;
    const { post } = this.props;
    const { images } = post;

    this.setState({
      currentImageIndex:
        (currentImageIndex - 1 + images.length) % images.length,
    });
  }

  render(): JSX.Element {
    const { post, onLike, onShare } = this.props;
    const { currentImageIndex } = this.state;
    const { images } = post;

    return (
      <div className="post-container">
        <div className="post-header">
          <img src={post.avatarUrl} alt="User Avatar" />
          <h2>{post.user}</h2>
        </div>

        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt="Post Image"
              className="w-full h-96 object-cover rounded-md mb-4"
            />

            {images.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                  onClick={this.handlePrevImage}
                >
                  <FontAwesomeIcon icon={faChevronCircleLeft} />
                </button>
                <button
                  className="absolute top-1/2 right-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1"
                  onClick={this.handleNextImage}
                >
                  <FontAwesomeIcon icon={faChevronCircleRight} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="post-body">
          <p>{post.Title}</p>
          <button onClick={() => onLike(Number(post.ID))}>Like</button>
          <button onClick={() => onShare(Number(post.ID))}>Share</button>
        </div>
      </div>
    );
  }
}

export default Post;
