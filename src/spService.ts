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

    return query.get(); // Ensuring proper execution
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
