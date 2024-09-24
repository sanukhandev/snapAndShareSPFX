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
  // Initialize SPFx context
  public setup(spfxContext: any): void {
    sp.setup({
      spfxContext,
      sp: { headers: { Accept: "application/json; odata=nometadata" } },
    });
  }

  // Helper method for fetching list items
  private async fetchListItems<T>(
    listTitle: string,
    selectFields: string[],
    expandFields: string[] = []
  ): Promise<T[]> {
    return sp.web.lists
      .getByTitle(listTitle)
      .items.select(...selectFields)
      .expand(...expandFields)
      .orderBy("ID", false)
      .get();
  }

  // Get all posts
  public async getPosts(): Promise<IPost[]> {
    return this.fetchListItems<IPost>(
      "SnapAndSharePosts",
      [
        "ID",
        "Title",
        "PostedBy/Title",
        "PostedBy/EMail",
        "Createed",
        "PostLikedBy",
      ],
      ["PostedBy"]
    );
  }

  // Get all images
  public async getImages(): Promise<IImage[]> {
    return this.fetchListItems<IImage>("SnapAndShareImages", [
      "FileLeafRef",
      "PostID",
      "FileRef",
    ]);
  }

  // Get all comments
  public async getComments(): Promise<IComment[]> {
    return this.fetchListItems<IComment>(
      "SnapAndShareComments",
      ["ID", "Title", "PostID", "Created", "CommentAuthor/Title"],
      ["CommentAuthor"]
    );
  }

  // Add a new post
  public async addPost(caption: string, userId: number): Promise<any> {
    return sp.web.lists.getByTitle("SnapAndSharePosts").items.add({
      Title: caption,
      Createed: new Date().toISOString(),
      PostedById: userId,
    });
  }

  // Upload image to a specific post
  public async uploadImage(
    fileName: string,
    fileArrayBuffer: ArrayBuffer,
    postId: number
  ): Promise<void> {
    const folderUrl = "/sites/Intranet_Site/SnapAndShareImages";

    // Upload the file
    const uploadedFile = await sp.web
      .getFolderByServerRelativeUrl(folderUrl)
      .files.add(fileName, fileArrayBuffer, true);

    // Get the item's ID from the uploaded file
    const listItemFields = await uploadedFile.file.listItemAllFields();
    const itemId = listItemFields.ID;

    // Update the image's list item with the post ID
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

  // Like or unlike a post based on the current user's interaction
  public async likePost(postId: number, userId: number): Promise<void> {
    try {
      const post = await sp.web.lists
        .getByTitle("SnapAndSharePosts")
        .items.getById(postId)
        .select("PostLikedBy")
        .get();
      const likedByArray = post.PostLikedBy ? post.PostLikedBy.split(";") : [];
      const userIdStr = userId.toString();
      const isLiked = likedByArray.includes(userIdStr);

      // Add or remove user from the likedByArray
      const updatedLikedByArray = isLiked
        ? likedByArray.filter((id: string) => id !== userIdStr)
        : [...likedByArray, userIdStr];

      // Update the liked users in the post
      await sp.web.lists
        .getByTitle("SnapAndSharePosts")
        .items.getById(postId)
        .update({
          PostLikedBy: updatedLikedByArray.join(";").trim(),
        });
    } catch (error) {
      console.error(`Error updating likes for post ${postId}:`, error);
      throw new Error("Unable to update post likes.");
    }
  }

  // Share a post (this triggers an alert for now)
  public async sharePost(postId: number): Promise<void> {
    try {
      const post = await sp.web.lists
        .getByTitle("SnapAndSharePosts")
        .items.getById(postId)
        .select("Title")
        .get();
      alert(`Post shared: ${post.Title}`);
    } catch (error) {
      console.error(`Error sharing post ${postId}:`, error);
      throw new Error("Unable to share post.");
    }
  }
}

export const spService = new SpService();
