import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare } from "@fortawesome/free-solid-svg-icons";

interface LikeShareActionsProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}

interface LikeShareActionsState {}

class LikeShareActions extends React.Component<
  LikeShareActionsProps,
  LikeShareActionsState
> {
  constructor(props: LikeShareActionsProps) {
    super(props);
  }

  render(): React.ReactElement {
    const { isLiked, likeCount, onLike, onShare } = this.props;

    return (
      <div className="flex space-x-4">
        <button
          className={`flex items-center ${
            isLiked ? "text-red-500" : "text-blue-500"
          }`}
          onClick={onLike}
        >
          <FontAwesomeIcon icon={faHeart} className="m-2" />
          {isLiked ? "Unlike" : "Like"} ({likeCount})
        </button>

        <button className="text-blue-500 flex items-center" onClick={onShare}>
          <FontAwesomeIcon icon={faShare} className="m-2" />
          Share
        </button>
      </div>
    );
  }
}

export default LikeShareActions;
