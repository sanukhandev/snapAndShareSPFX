/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";

export interface IPost {
  ID: number;
  Title: string;
  PostedBy: {
    EMail: string;
    Title: string;
  };
  PostLikedBy?: string; // User IDs of people who liked the post (semicolon-separated)
  Createed: string;
}

export interface IImage {
  FileLeafRef: string;
  PostID: number;
  FileRef: string;
}

export interface IComment {
  ID: number;
  Title: string;
  CommentAuthor: {
    Title: string;
  };
  PostID: number;
  Created: string;
  ParentCommentID?: number;
}

class SpService {
  // Setup the SPFx context
  public setup(spfxContext: any): void {
    sp.setup({
      spfxContext,
      sp: { headers: { Accept: "application/json; odata=nometadata" } },
    });
  }

  // Get all posts
  public async getPosts(): Promise<IPost[]> {
    return sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.select(
        "ID",
        "Title",
        "PostedBy/Title",
        "PostedBy/EMail",
        "Created",
        "PostLikedBy"
      )
      .orderBy("ID", false)
      .expand("PostedBy")
      .get();
  }

  // Get all images
  public async getImages(): Promise<IImage[]> {
    return sp.web.lists
      .getByTitle("SnapAndShareImages")
      .items.select("FileLeafRef", "PostID", "FileRef")
      .get();
  }

  // Get all comments
  public async getComments(): Promise<IComment[]> {
    return sp.web.lists
      .getByTitle("SnapAndShareComments")
      .items.select("ID", "Title", "PostID", "Created", "CommentAuthor/Title")
      .expand("CommentAuthor")
      .orderBy("Created", false)
      .get();
  }

  // Add a new post
  public async addPost(caption: string, userId: number): Promise<any> {
    return sp.web.lists.getByTitle("SnapAndSharePosts").items.add({
      Title: caption,
      Created: new Date().toISOString(),
      PostedById: userId,
    });
  }

  // Upload image to a specific post
  public async uploadImage(
    fileName: string,
    fileArrayBuffer: ArrayBuffer,
    postId: number
  ): Promise<void> {
    const uploadedFile = await sp.web
      .getFolderByServerRelativeUrl("/sites/Intranet_Site/SnapAndShareImages")
      .files.add(fileName, fileArrayBuffer, true);

    const listItemFields = await uploadedFile.file.listItemAllFields();
    const itemId = listItemFields.ID;

    await sp.web.lists
      .getByTitle("SnapAndShareImages")
      .items.getById(itemId)
      .update({
        PostID: postId,
      });
  }

  // Add a new comment to a post
  public async addComment(
    postId: number,
    comment: string,
    authorId: number
  ): Promise<void> {
    await sp.web.lists.getByTitle("SnapAndShareComments").items.add({
      Title: comment,
      PostID: postId,
      CommentAuthorId: authorId,
    });
  }

  // Like or Unlike a post
  public async likePost(postId: number, userId: number): Promise<void> {
    // Get the post by ID
    const post = await sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.getById(postId)
      .select("PostLikedBy")
      .get();

    // Check if PostLikedBy field exists and split it into an array
    let likedByArray = post.PostLikedBy ? post.PostLikedBy.split(";") : [];

    // Check if user already liked the post
    const isLiked = likedByArray.includes(userId.toString());

    // If liked, remove the user ID (unlike); otherwise, add the user ID (like)
    if (isLiked) {
      likedByArray = likedByArray.filter(
        (id: string) => id !== userId.toString()
      );
    } else {
      likedByArray.push(userId.toString());
    }

    // Join the updated list back into a semicolon-separated string
    const likedByString = likedByArray.join(";").trim();

    // Update the post with the new list of liked users
    await sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.getById(postId)
      .update({
        PostLikedBy: likedByString,
      });
  }

  // Share a post (this just triggers an alert for now)
  public async sharePost(postId: number): Promise<void> {
    const post = await sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.getById(postId)
      .select("Title")
      .get();

    const postTitle = post.Title;
    alert(`Post shared: ${postTitle}`);
  }
}

export const spService = new SpService();
