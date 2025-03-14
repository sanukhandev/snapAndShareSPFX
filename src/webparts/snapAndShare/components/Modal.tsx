import * as React from "react";

interface ModalProps {
  onClose: () => void;
  images: string[];
  title: string;
  initialIndex?: number;
}

interface ModalState {
  activeIndex: number;
}

class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      activeIndex: props.initialIndex ?? 0,
    };
  }

  handlePrev = (): void => {
    this.setState((prevState) => ({
      activeIndex:
        prevState.activeIndex === 0
          ? this.props.images.length - 1
          : prevState.activeIndex - 1,
    }));
  };

  handleNext = (): void => {
    this.setState((prevState) => ({
      activeIndex:
        prevState.activeIndex === this.props.images.length - 1
          ? 0
          : prevState.activeIndex + 1,
    }));
  };

  render(): JSX.Element {
    const { onClose, images, title } = this.props;
    const { activeIndex } = this.state;

    return (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body text-center position-relative">
              {images.length > 1 && (
                <button
                  className="carousel-control-prev"
                  style={{ left: 0 }}
                  onClick={this.handlePrev}
                >
                  <span className="carousel-control-prev-icon" />
                </button>
              )}
              <img
                src={images[activeIndex]}
                className="img-fluid"
                alt="Popup"
                style={{ width: "100%" }}
              />
              {images.length > 1 && (
                <button
                  className="carousel-control-next"
                  style={{ right: 0 }}
                  onClick={this.handleNext}
                >
                  <span className="carousel-control-next-icon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
