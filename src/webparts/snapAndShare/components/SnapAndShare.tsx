/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import CreatePost from "./childs/CreatePost";
import Post from "./childs/Post"; // Correct the import path for the Post component
import Toast from "./childs/Toast";
import { spService } from "../../../spService";
import { ISnapAndShareProps } from "./ISnapAndShareProps";
import "../../../styles/dist/tailwind.css";

interface ISnapAndShareState {
  posts: any;
  showToast: boolean;
  toastMessage: string;
}

export default class SnapAndShare extends React.Component<
  ISnapAndShareProps,
  ISnapAndShareState
> {
  constructor(props: ISnapAndShareProps) {
    super(props);

    this.state = {
      posts: [],
      showToast: false,
      toastMessage: "",
    };

    spService.setup(this.props.context);

    // Binding methods to ensure proper context
    this.handlePostCreate = this.handlePostCreate.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.showToast = this.showToast.bind(this);
    this.closeToast = this.closeToast.bind(this);
  }

  componentDidMount(): void {
    this.loadPostsAndImages().catch((error) => {
      console.error("Error loading posts and images:", error);
    });
  }

  private showToast(message: string): void {
    this.setState({ showToast: true, toastMessage: message });
    setTimeout(this.closeToast, 3000);
  }

  private closeToast(): void {
    this.setState({ showToast: false, toastMessage: "" });
  }

  private async loadPostsAndImages(): Promise<void> {
    try {
      const posts = await spService.getSnapPosts();
      this.setState({ posts });
    } catch (error) {
      console.error("Error loading posts and images:", error);
    }
  }

  private async handlePostCreate(
    caption: string,
    images: File[]
  ): Promise<void> {
    if (!caption || images.length === 0) {
      this.showToast("Please provide a caption and at least one image.");
      return;
    }

    try {
      const addedPost = await spService.addPost(
        caption,
        this.props.context.pageContext.legacyPageContext.userId
      );

      const postId = addedPost.data.ID;

      const uploadPromises = images.map(async (image) => {
        const fileArrayBuffer = await image.arrayBuffer();
        await spService.uploadImage(image.name, fileArrayBuffer, postId);
      });

      await Promise.all(uploadPromises);
      this.showToast("Post created successfully!");
      await this.loadPostsAndImages();
    } catch (error) {
      console.error("Error creating post:", error);
      this.showToast("Error creating post.");
    }
  }

  private async handleLike(postId: number): Promise<void> {
    try {
      await spService.likePost(
        postId,
        this.props.context.pageContext.legacyPageContext.userId
      );
      this.showToast("Post liked successfully!");
      await this.loadPostsAndImages();
    } catch (error) {
      console.error("Error liking post:", error);
      this.showToast("Error liking post.");
    }
  }

  private async handleShare(postId: number): Promise<void> {
    try {
      await spService.sharePost(postId);
      this.showToast("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post:", error);
      this.showToast("Error sharing post.");
    }
  }

  private async handleAddComment(
    postId: number,
    comment: string
  ): Promise<void> {
    try {
      await spService.addComment(
        postId,
        comment,
        this.props.context.pageContext.legacyPageContext.userId
      );
      this.showToast("Comment added successfully!");
      await this.loadPostsAndImages();
    } catch (error) {
      console.error("Error adding comment:", error);
      this.showToast("Error adding comment.");
    }
  }

  public render(): React.ReactElement<ISnapAndShareProps> {
    const { posts, showToast, toastMessage } = this.state;
    return (
      <div className="container mx-auto p-2">
        <CreatePost onPostCreate={this.handlePostCreate} />
        {showToast && <Toast message={toastMessage} />}
        <div className="h-2" />
        {posts.map((post: any) => (
          <Post
            key={post.ID}
            post={post}
            onAddComment={this.handleAddComment}
            onLike={this.handleLike}
            onShare={this.handleShare}
          />
        ))}
      </div>
    );
  }
}
