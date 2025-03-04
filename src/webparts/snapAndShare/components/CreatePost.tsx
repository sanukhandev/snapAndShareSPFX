import * as React from "react";

interface CreatePostProps {
  onAddPost: (title: string, images: File[]) => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onAddPost }) => {
  const [title, setTitle] = React.useState("");
  const [images, setImages] = React.useState<File[]>([]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      await onAddPost(title, images);
      setTitle("");
      setImages([]);
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-2">Create a Post</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="border p-2 rounded-md w-full mb-2"
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="mb-2"
      />
      <div className="flex gap-2 flex-wrap">
        {images.map((img, index) => (
          <img
            key={index}
            src={URL.createObjectURL(img)}
            alt="Uploaded"
            className="w-16 h-16 object-cover rounded-md"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;
