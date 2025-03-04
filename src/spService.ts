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
  PostedBy: any;
  Comment: string;
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
    expandFields: string[] = [],
    filters: string[] = []
  ): Promise<T[]> {
    let query = sp.web.lists.getByTitle(listTitle).items;

    if (selectFields.length) {
      query = query.select(...selectFields);
    }
    if (expandFields.length) {
      query = query.expand(...expandFields);
    }
    if (filters.length) {
      query = query.filter(filters.join(" and "));
    }

    return query.get();
  }

  public async addPost(title: string, images: File[]): Promise<any> {
    const currentUser = await sp.web.currentUser.get(); // Get current user
    const newItem = await sp.web.lists
      .getByTitle("SnapAndShareList")
      .items.add({
        Title: title,
        PostedById: currentUser.Id,
      });

    const folderPath = `SnapAndShare/${newItem.data.ID}`;
    await sp.web.folders.add(folderPath);

    for (const image of images) {
      await sp.web
        .getFolderByServerRelativePath(folderPath)
        .files.add(image.name, image, true);
    }

    return newItem.data;
  }

  public async addComment(postId: number, comment: string): Promise<any> {
    const currentUser = await sp.web.currentUser.get(); // Get current user
    return sp.web.lists.getByTitle("BirthdayComments").items.add({
      Title: "Comment",
      Comment: comment,
      PostId: postId,
      CommentType: "SNP",
      PostedById: currentUser.Id, // Assign current user ID
    });
  }

  public async likePost(postId: number, userEmail: string): Promise<void> {
    const post = await sp.web.lists
      .getByTitle("SnapAndShareList")
      .items.getById(postId)
      .get();
    const likedBy = post.PostLikedBy ? post.PostLikedBy.split(";") : [];

    if (!likedBy.includes(userEmail)) {
      likedBy.push(userEmail);
      await sp.web.lists
        .getByTitle("SnapAndShareList")
        .items.getById(postId)
        .update({
          PostLikedBy: likedBy.join(";"),
        });
    }
  }

  public async likeComment(
    commentId: number,
    userEmail: string
  ): Promise<void> {
    const comment = await sp.web.lists
      .getByTitle("BirthdayComments")
      .items.getById(commentId)
      .get();
    const likedBy = comment.Likes ? comment.Likes.split(";") : [];

    if (!likedBy.includes(userEmail)) {
      likedBy.push(userEmail);
      await sp.web.lists
        .getByTitle("BirthdayComments")
        .items.getById(commentId)
        .update({
          Likes: likedBy.join(";"),
        });
    }
  }

  public async getSnapPosts(): Promise<
    {
      id: number;
      title: string;
      postedBy: string;
      postedByEmail: string;
      postedByRole: string;
      likes?: number;
      images: string[];
      comments: {
        postedByEmail: string;
        postedBy: string;
        id: number;
        comment: string;
      }[];
    }[]
  > {
    const web = sp.web;
    const siteUrl = await web.select("ServerRelativeUrl")();
    const listItems = await web.lists
      .getByTitle("SnapAndShareList")
      .items.select(
        "ID",
        "Title",
        "PostedBy/Id",
        "PostedBy/Title",
        "PostedBy/Name",
        "PostedBy/EMail",
        "PostedBy/Department",
        "PostedBy/JobTitle",
        "Likes"
      )
      .expand("PostedBy")()
      .then((items: any[]) =>
        items.map((item) => ({
          id: item.ID,
          title: item.Title,
          postedBy: item.PostedBy?.Title || "Unknown",
          postedByEmail: item.PostedBy?.EMail || "N/A",
          postedByRole: item.PostedBy?.JobTitle || "N/A",
          likes: item.Likes || 0,
          images: [] as string[],
          comments: [] as { id: number; comment: string }[], // Placeholder for comments, fetched later
        }))
      );
    const snapShareItems = await Promise.all(
      listItems.map(async (item: any) => {
        const folderPath = `${siteUrl.ServerRelativeUrl}/SnapAndShare/${item.id}`;
        try {
          const files = await web
            .getFolderByServerRelativePath(folderPath)
            .files.select("ServerRelativeUrl")();
          return {
            ...item,
            images: files.map(
              (file: { ServerRelativeUrl: string }) => file.ServerRelativeUrl
            ),
          };
        } catch (error) {
          console.warn(`No images found for item ID: ${item.id}`, error);
          return { ...item, images: [] };
        }
      })
    );

    const snapShareWithComments = await Promise.all(
      snapShareItems.map(async (item: any) => {
        try {
          const comments = await this.fetchListItems<IComment>(
            "BirthdayComments",
            ["ID", "Comment", "PostedBy/EMail", "PostedBy/Title"],
            ["PostedBy"],
            [`CommentType eq 'SNP'`, `PostId eq ${item.id}`]
          );

          const formattedComments = comments.map((comment) => ({
            id: comment.ID,
            comment: comment.Comment || "",
            postedBy: comment.PostedBy.Title,
            postedByEmail: comment.PostedBy.EMail,
          }));
          return { ...item, comments: formattedComments };
        } catch (error) {
          console.warn(
            `Error fetching comments for item ID: ${item.id}`,
            error
          );
          return { ...item, comments: [] }; // Return empty comments if none found
        }
      })
    );

    return snapShareWithComments;
  }
}

export const spService = new SpService();
