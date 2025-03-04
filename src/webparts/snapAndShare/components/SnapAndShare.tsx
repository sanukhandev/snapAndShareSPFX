/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { spService } from "../../../spService";
import { ISnapAndShareProps } from "./ISnapAndShareProps";
import "../../../styles/dist/tailwind.css";

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
  newPostTitle: string;
  newComment: { [key: number]: string };
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
      newPostTitle: "",
      newComment: {},
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
          postedBy: comment.postedBy || "Unknown",
          postedByEmail: comment.postedByEmail || "unknown@example.com",
        })),
      }));
      this.setState({ posts: postsWithDefaultLikes });
    } catch (error) {
      console.error("Error loading posts and images:", error);
    }
  }

  private handleLikePost(postId: number): void {
    const updatedPosts = this.state.posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    this.setState({ posts: updatedPosts });
  }

  private handleAddComment(postId: number): void {
    const commentText = this.state.newComment[postId];
    if (!commentText) return;

    const updatedPosts = this.state.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              comment: commentText,
              postedBy: "Current User",
              postedByEmail: "user@example.com",
              likes: 0,
            },
          ],
        };
      }
      return post;
    });

    this.setState({
      posts: updatedPosts,
      newComment: { ...this.state.newComment, [postId]: "" },
    });
  }

  public render(): React.ReactElement<ISnapAndShareProps> {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Snap & Share</h2>
        {this.state.posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md p-4 mb-4 rounded-lg">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-500">By {post.postedBy}</p>
            <div className="flex gap-2 mt-2">
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Post"
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
            <div className="flex items-center mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => this.handleLikePost(post.id)}
              >
                👍 {post.likes}
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={this.state.newComment[post.id] || ""}
                onChange={(e) =>
                  this.setState({
                    newComment: {
                      ...this.state.newComment,
                      [post.id]: e.target.value,
                    },
                  })
                }
                placeholder="Add a comment..."
                className="border p-2 rounded-md w-full"
              />
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md"
                onClick={() => this.handleAddComment(post.id)}
              >
                Comment
              </button>
            </div>
            <div className="mt-2">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-2 rounded-md mt-2"
                >
                  <p className="text-sm font-semibold bg-blue-300">
                    @{comment.postedBy}:{" "}
                    <span className="text-sm font-normal bg-green-100">
                      {comment.comment}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
