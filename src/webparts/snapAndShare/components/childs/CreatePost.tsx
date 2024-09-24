/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @rushstack/no-new-null */
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCamera,
  faVideo,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

interface CreatePostProps {
  onPostCreate: (caption: string, images: File[]) => Promise<void>;
}

interface CreatePostState {
  caption: string;
  images: File[];
  isSubmitting: boolean;
  errorMessage: string;
}

export default class CreatePost extends React.Component<
  CreatePostProps,
  CreatePostState
> {
  constructor(props: CreatePostProps) {
    super(props);
    this.state = {
      caption: "",
      images: [],
      isSubmitting: false,
      errorMessage: "",
    };
  }

  // Handle caption input change
  handleCaptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    this.setState({ caption: event.target.value });
  };

  // Handle image file changes
  handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      this.setState({ images: Array.from(event.target.files) });
    }
  };

  // Handle form submission
  handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const { caption, images } = this.state;

    if (!caption || images.length === 0) {
      this.setState({
        errorMessage: "Please provide a caption and select images.",
      });
      return;
    }

    this.setState({ isSubmitting: true, errorMessage: "" });

    try {
      await this.props.onPostCreate(caption, images);
      this.setState({ caption: "", images: [], isSubmitting: false });
    } catch (error) {
      this.setState({
        isSubmitting: false,
        errorMessage: "Failed to create post.",
      });
    }
  };

  // Clear selected images
  clearImages = (): void => {
    this.setState({ images: [] });
  };

  // Render caption input field
  renderCaptionInput(): React.ReactElement {
    return (
      <div className="mb-4">
        <textarea
          className="w-full border p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your story..."
          value={this.state.caption}
          onChange={this.handleCaptionChange}
          rows={2}
        />
      </div>
    );
  }

  // Render image attachment buttons
  renderImageAttachment(): React.ReactElement {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          {this.renderFileInput(faCamera, "image/*")}
          {this.renderFileInput(faVideo, "video/*")}
          {this.renderFileInput(faImages, "image/*", true)}
          {this.renderFileInput(faPaperclip, "*/*")}
        </div>

        {this.renderSubmitButton()}
      </div>
    );
  }

  // Render file input icon
  renderFileInput(
    icon: any,
    accept: string,
    multiple: boolean = false
  ): React.ReactElement {
    return (
      <label className="flex items-center text-gray-500 cursor-pointer">
        <FontAwesomeIcon icon={icon} className="text-xl mr-2" />
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={this.handleImageChange}
          className="hidden"
        />
      </label>
    );
  }

  // Render submit button
  renderSubmitButton(): React.ReactElement {
    return (
      <button
        type="submit"
        disabled={this.state.isSubmitting}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none ${
          this.state.isSubmitting
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
      >
        {this.state.isSubmitting ? "Posting..." : "Post"}
      </button>
    );
  }

  // Render preview of the post with images
  renderPostPreview(): React.ReactElement | null {
    const { caption, images } = this.state;

    if (!caption && images.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-md font-bold mb-2">Post Preview</h4>
        {caption && <p className="text-gray-800 mb-2">{caption}</p>}

        {images.length > 0 && (
          <div className="flex space-x-4 overflow-x-scroll py-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render error message if any
  renderErrorMessage(): React.ReactElement | null {
    if (!this.state.errorMessage) {
      return null;
    }

    return (
      <p className="text-red-500 text-sm mb-4">{this.state.errorMessage}</p>
    );
  }

  // Render component
  public render(): React.ReactElement<CreatePostProps> {
    return (
      <div className="container mx-auto p-2 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Snap & Share Your Stories</h2>

        <form onSubmit={this.handleSubmit} className="p-11">
          {this.renderCaptionInput()}
          {this.renderImageAttachment()}
          {this.renderErrorMessage()}
        </form>

        {this.renderPostPreview()}
      </div>
    );
  }
}
