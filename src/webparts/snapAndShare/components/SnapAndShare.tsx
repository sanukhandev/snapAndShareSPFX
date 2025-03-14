/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { spService } from "../../../spService";
import { ISnapAndShareProps } from "./ISnapAndShareProps";
import "../../../styles/dist/tailwind.css";
import CreatePost from "./CreatePost";
import Post from "./Post";

interface IPost {
  id: number;
  title: string;
  postedBy: string;
  postedByEmail: string;
  postedByRole: string;
  likes: string; // Remove `?` to ensure it always has a value
  images: string[];
  comments: IComment[];
}

interface IComment {
  id: number;
  comment: string;
  postedBy: string;
  postedByEmail: string;
  likes?: string;
}

interface ISnapAndShareState {
  posts: IPost[];
  likedPosts: Set<number>;
  likedComments: Set<number>;
  showToast: boolean;
  toastMessage: string;
  currUserId: number;
}

export default class SnapAndShare extends React.Component<
  ISnapAndShareProps,
  ISnapAndShareState
> {
  constructor(props: ISnapAndShareProps) {
    super(props);

    this.state = {
      posts: [],
      likedPosts: new Set(),
      likedComments: new Set(),
      showToast: false,
      toastMessage: "",
      currUserId: 0,
    };

    spService.setup(this.props.context);
  }

  componentDidMount(): void {
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    this.setState({ currUserId: userId });
    this.loadPostsAndImages().catch((error) => {
      console.error("Error loading posts and images:", error);
    });

    // get current User id
   
  }

  private async loadPostsAndImages(): Promise<void> {
    try {
      const posts = await spService.getSnapPosts();
      const postsWithDefaults = posts.map((post) => ({
        ...post,
        likes: post.likes ?? "0", // Ensure likes always has a default value
        comments: post.comments.map((comment) => ({
          ...comment,
          postedBy: comment.postedBy || "Unknown", // Ensure postedBy is set
          postedByEmail: comment.postedByEmail || "unknown@example.com", // Ensure postedByEmail is set
        })),
      }));
      this.setState({ posts: postsWithDefaults });
    } catch (error) {
      console.error("Error loading posts and images:", error);
    }
  }

  private handleAddPost = async (
    title: string,
    images: File[]
  ): Promise<void> => {
    try {
      await spService.addPost(title, images);
      this.loadPostsAndImages().catch((error) => {
        console.error("Error loading posts and images:", error);
      });
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  private handleAddComment = async (
    postId: number,
    comment: string
  ): Promise<void> => {
    try {
      await spService.addComment(postId, comment);
      await this.loadPostsAndImages();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  private handleLikePost = async (
    postId: number,
    userEmail: string
  ): Promise<void> => {
    try {
      await spService.likePost(postId, this.state.currUserId + "");
      await this.loadPostsAndImages();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // private handleLikeComment = async (
  //   commentId: number,
  //   userEmail: string
  // ): Promise<void> => {
  //   try {
  //     await spService.likeComment(commentId, this.state.currUserId + "");
  //     await this.loadPostsAndImages();
  //   } catch (error) {
  //     console.error("Error liking comment:", error);
  //   }
  // };

  public render(): React.ReactElement<ISnapAndShareProps> {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Snap & Share</h2>
        <CreatePost onAddPost={this.handleAddPost} />
        {this.state.posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            userId={this.state.currUserId}
            likedPosts={this.state.likedPosts}
            likedComments={this.state.likedComments}
            onLikePost={(postId) =>
              this.handleLikePost(postId, post.postedByEmail)
            }
            // onLikeComment={(commentId) =>
            //   this.handleLikeComment(commentId, post.postedByEmail)
            // }
            onAddComment={this.handleAddComment}
          />
        ))}
      </div>
    );
  }
}
