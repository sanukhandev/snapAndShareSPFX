import * as React from "react";

interface CreatePostProps {
  onAddPost: (title: string, images: File[]) => Promise<void>;
}

interface CreatePostState {
  title: string;
  images: File[];
}

class CreatePost extends React.Component<CreatePostProps, CreatePostState> {
  private fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: CreatePostProps) {
    super(props);
    this.state = {
      title: "",
      images: [],
    };
    this.fileInputRef = React.createRef();
  }

  handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      this.setState((prevState) => ({
        images: [...prevState.images, ...filesArray],
      }));
    }
  };

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ title: event.target.value });
  };

  handleSubmit = async (): Promise<void> => {
    const { title, images } = this.state;
    if (!title.trim()) return;
    try {
      await this.props.onAddPost(title, images);
      this.setState({ title: "", images: [] });
      if (this.fileInputRef.current) this.fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };

  render(): JSX.Element {
    return (
      <div className="post-container bg-light-gray p-4 rounded-3 mb-4">
        <h5>Create a Post</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Post Title..."
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <div className="d-flex align-items-center">
          <label className="btn d-flex align-items-center main-btn btn-outline-primary me-2">
            Attach Files
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4067 6.2371L17.4067 17.9909C17.4067 20.7674 15.1559 23.0182 12.3794 23.0182C9.60286 23.0182 7.35204 20.7674 7.35204 17.9909L7.35204 7.00512"
                stroke="#2B2B6B"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.7035 14.0806V6.237"
                stroke="#2B2B6B"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.0552 7.00496L14.0552 17.9907C14.0552 18.9162 13.3049 19.6665 12.3794 19.6665C11.4539 19.6665 10.7036 18.9162 10.7036 17.9907L10.7036 14.0805"
                stroke="#2B2B6B"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.7036 6.23704C10.7036 4.38605 12.2042 2.88548 14.0551 2.88548C15.9061 2.88548 17.4067 4.38602 17.4068 6.23704"
                stroke="#2B2B6B"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="file"
              hidden
              ref={this.fileInputRef}
              multiple
              accept="image/*"
              onChange={this.handleImageUpload}
            />
          </label>
          <span>
            {this.state.images.length > 0
              ? `${this.state.images.length} file(s) chosen`
              : "No file chosen"}
          </span>
          <button
            className="btn btn-primary ms-auto text-white"
            onClick={this.handleSubmit}
          >
            Create Post
          </button>
        </div>
      </div>
    );
  }
}

export default CreatePost;
