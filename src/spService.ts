/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";

export interface IPost {
  ID: number;
  Title: string;
  PostedBy: {
    EMail: string;
    Title: string;
  };
  PostLikedBy?: string;
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
  public setup(spfxContext: any): void {
    sp.setup({
      spfxContext,
      sp: { headers: { Accept: "application/json; odata=nometadata" } },
    });
  }

  public async getPosts(): Promise<IPost[]> {
    return sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.select(
        "ID",
        "Title",
        "PostedBy/Title",
        "PostedBy/EMail",
        "Createed"
      )
      .orderBy("ID", false)
      .expand("PostedBy")
      .get();
  }

  public async getImages(): Promise<IImage[]> {
    return sp.web.lists
      .getByTitle("SnapAndShareImages")
      .items.select("FileLeafRef", "PostID", "FileRef")
      .get();
  }

  public async getComments(): Promise<IComment[]> {
    return sp.web.lists
      .getByTitle("SnapAndShareComments")
      .items.select("ID", "Title", "PostID", "Created", "CommentAuthor/Title")
      .expand("CommentAuthor")
      .orderBy("Created", false)
      .get();
  }

  public async addPost(caption: string, userId: number): Promise<any> {
    return sp.web.lists.getByTitle("SnapAndSharePosts").items.add({
      Title: caption,
      Created: new Date().toISOString(),
      PostedById: userId,
    });
  }

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

  public async addComment(
    postId: number,
    comment: string,
    author: number
  ): Promise<void> {
    await sp.web.lists.getByTitle("SnapAndShareComments").items.add({
      Title: comment,
      Comment: comment,
      PostID: postId,
      CommentAuthorId: author,
    });
  }

  public async likePost(postId: number): Promise<void> {
    await sp.web.lists
      .getByTitle("SnapAndSharePosts")
      .items.getById(postId)
      .update({
        PostLikedBy: {
          results: ["1"],
        },
      });
  }

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
