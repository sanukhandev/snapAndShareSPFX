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
  likes: number;
  images: string[];
  comments: IComment[];
}

interface IComment {
  id: number;
  comment: string;
  postedBy: string;
  postedByEmail: string;
  likes?: number;
}

interface ISnapAndShareState {
  posts: IPost[];
  likedPosts: Set<number>;
  likedComments: Set<number>;
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
      likedPosts: new Set(),
      likedComments: new Set(),
      showToast: false,
      toastMessage: "",
    };

    spService.setup(this.props.context);
  }

  componentDidMount(): void {
    this.loadPostsAndImages().catch((error) => {
      console.error("Error loading posts and images:", error);
    });
  }

  private async loadPostsAndImages(): Promise<void> {
    try {
      const posts = await spService.getSnapPosts();
      const postsWithDefaultLikes = posts.map((post) => ({
        ...post,
        likes: post.likes ?? 0,
        comments: post.comments.map((comment: IComment) => ({
          ...comment,
          likes: comment.likes ?? 0,
          postedBy: comment.postedBy || "Unknown",
          postedByEmail: comment.postedByEmail || "unknown@example.com",
        })),
      }));
      this.setState({ posts: postsWithDefaultLikes });
    } catch (error) {
      console.error("Error loading posts and images:", error);
    }
  }

  private handleAddPost = (newPost: IPost): void => {
    this.setState((prevState) => ({ posts: [newPost, ...prevState.posts] }));
  };

  private handleLikePost = (postId: number): void => {
    this.setState((prevState) => {
      const likedPosts = new Set(prevState.likedPosts);
      if (likedPosts.has(postId)) {
        likedPosts.delete(postId);
      } else {
        likedPosts.add(postId);
      }
      return { likedPosts };
    });
  };

  private handleLikeComment = (commentId: number): void => {
    this.setState((prevState) => {
      const likedComments = new Set(prevState.likedComments);
      if (likedComments.has(commentId)) {
        likedComments.delete(commentId);
      } else {
        likedComments.add(commentId);
      }
      return { likedComments };
    });
  };

  public render(): React.ReactElement<ISnapAndShareProps> {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Snap & Share</h2>
        <CreatePost onAddPost={this.handleAddPost} />
        {this.state.posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            likedPosts={this.state.likedPosts}
            likedComments={this.state.likedComments}
            onLikePost={this.handleLikePost}
            onLikeComment={this.handleLikeComment}
          />
        ))}
      </div>
    );
  }
}
