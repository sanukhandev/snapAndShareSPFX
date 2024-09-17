/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ISnapAndShareProps } from "./ISnapAndShareProps";
import "../../../styles/dist/tailwind.css";

import CreatePost from "./childs/CreatePost";
import Post from "./childs/Post";
import Toast from "./childs/Toast";
import { spService, IPost, IComment } from "../../../spService";

interface IPostWithComments extends IPost {
  avatarUrl: string;
  user: string;
  imageUrl: string;
  comments: IComment[]; // Use IComment to match the expected type
  userComment: string;
  isLiked: boolean; // Add this property
  likeCount: number; // Add this property
}

interface ISnapAndShareState {
  posts: IPostWithComments[];
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

    // Setup the SPFx context in the service
    spService.setup(this.props.context);

    this.handlePostCreate = this.handlePostCreate.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.showToast = this.showToast.bind(this);
    this.closeToast = this.closeToast.bind(this);
  }

  componentDidMount(): void {
    this.loadPostsAndImages().catch((error) => {
      console.error("Error loading posts and images: ", error);
    });
  }

  private showToast(message: string): void {
    this.setState({ showToast: true, toastMessage: message });
    setTimeout(() => this.closeToast(), 3000);
  }

  private closeToast(): void {
    this.setState({ showToast: false, toastMessage: "" });
  }

  private async loadPostsAndImages(): Promise<void> {
    try {
      const [posts, images, comments] = await Promise.all([
        spService.getPosts(),
        spService.getImages(),
        spService.getComments(),
      ]);

      const imagesByPostId = this.groupBy(images, "PostID");
      const commentsByPostId = this.groupBy(comments, "PostID");

      const postsWithDetails = posts.map((post) => {
        const postImages = imagesByPostId[post.ID] || [];
        const postComments = commentsByPostId[post.ID] || [];

        return {
          ID: post.ID,
          Title: post.Title,
          PostedBy: post.PostedBy,
          Createed: post.Createed,
          user: post.PostedBy?.Title || "Unknown User",
          avatarUrl: post.PostedBy?.EMail
            ? `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?size=S&email=${post.PostedBy.EMail}`
            : "/_layouts/15/images/person.png",
          imageUrl: postImages.length > 0 ? postImages[0].FileRef : "",
          comments: postComments,
          userComment: "",
          isLiked: false,
          likeCount: 0,
        };
      });

      this.setState({ posts: postsWithDetails });
    } catch (error) {
      console.error("Error loading posts and images: ", error);
    }
  }

  private groupBy<T extends { [key: string]: any }>(
    array: T[],
    key: string
  ): { [key: string]: T[] } {
    return array.reduce((result: { [key: string]: T[] }, item: T) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
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
      // Call a service to handle the like logic
      await spService.likePost(postId);
      this.showToast("Post liked successfully!");
      await this.loadPostsAndImages(); // Reload the posts to update the like status
    } catch (error) {
      console.error("Error liking post:", error);
      this.showToast("Error liking post.");
    }
  }

  private async handleShare(postId: number): Promise<void> {
    try {
      // Call a service to handle the share logic
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
    return (
      <div className="container mx-auto p-2">
        <CreatePost onPostCreate={this.handlePostCreate} />
        {this.state.showToast && <Toast message={this.state.toastMessage} />}
        <div className="h-2" />
        {this.state.posts.map((post) => (
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
