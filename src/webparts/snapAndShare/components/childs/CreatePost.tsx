import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCamera,
  faVideo,
  faImages,
} from "@fortawesome/free-solid-svg-icons"; // Import new icons
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

    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearImages = this.clearImages.bind(this);
  }

  handleCaptionChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({ caption: event.target.value });
  }

  handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      this.setState({ images: Array.from(event.target.files) });
    }
  }

  async handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    if (!this.state.caption || this.state.images.length === 0) {
      this.setState({
        errorMessage: "Please provide a caption and select images.",
      });
      return;
    }

    this.setState({ isSubmitting: true, errorMessage: "" });

    try {
      await this.props.onPostCreate(this.state.caption, this.state.images);
      this.setState({ caption: "", images: [], isSubmitting: false });
    } catch (error) {
      this.setState({
        isSubmitting: false,
        errorMessage: "Failed to create post.",
      });
    }
  }

  clearImages(): void {
    this.setState({ images: [] });
  }

  /**
   * Renders the caption textarea input.
   */
  private renderCaptionInput(): React.ReactElement {
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

  /**
   * Renders the image attachment section with the icon.
   */

  private renderImageAttachment(): React.ReactElement {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          {/* Photo icon */}
          <label className="flex items-center text-gray-500 cursor-pointer">
            <FontAwesomeIcon icon={faCamera} className="text-xl mr-2" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={this.handleImageChange}
              className="hidden" // Hide file input button
            />
          </label>

          {/* Video icon */}
          <label className="flex items-center text-gray-500 cursor-pointer">
            <FontAwesomeIcon icon={faVideo} className="text-xl mr-2" />
            <input
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={this.handleImageChange}
              className="hidden" // Hide file input button
            />
          </label>

          {/* Gallery icon */}
          <label className="flex items-center text-gray-500 cursor-pointer">
            <FontAwesomeIcon icon={faImages} className="text-xl mr-2" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              multiple
              onChange={this.handleImageChange}
              className="hidden" // Hide file input button
            />
          </label>

          {/* Attachment (Document) icon */}
          <label className="flex items-center text-gray-500 cursor-pointer">
            <FontAwesomeIcon icon={faPaperclip} className="text-xl mr-2" />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={this.handleImageChange}
              className="hidden" // Hide file input button
            />
          </label>
        </div>

        {this.renderSubmitButton()}
      </div>
    );
  }

  /**
   * Renders the submit button.
   */
  private renderSubmitButton(): React.ReactElement {
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

  /**
   * Renders a preview of the post with the caption and selected images.
   */
  private renderPostPreview(): React.ReactElement | null {
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

  /**
   * Renders any error message that might have occurred.
   */
  private renderErrorMessage(): React.ReactElement | null {
    if (!this.state.errorMessage) {
      return null;
    }

    return (
      <p className="text-red-500 text-sm mb-4">{this.state.errorMessage}</p>
    );
  }

  public render(): React.ReactElement<CreatePostProps> {
    return (
      <div className="container mx-auto p-2 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Snap & Share Your Stories</h2>

        <form onSubmit={this.handleSubmit} className="p-11">
          {this.renderCaptionInput()}
          {this.renderImageAttachment()}
          {this.renderErrorMessage()}
        </form>

        {/* Render Post Preview */}
        {this.renderPostPreview()}
      </div>
    );
  }
}
