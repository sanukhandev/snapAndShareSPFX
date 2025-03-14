// import * as React from "react";

// interface ModalProps {
//   onClose: () => void;
//   images: string[];
// }

// interface ModalState {
//   activeIndex: number;
// }

// class Modal extends React.Component<ModalProps, ModalState> {
//   constructor(props: ModalProps) {
//     super(props);
//     this.state = {
//       activeIndex: 0,
//     };
//   }

//   handlePrev = (): void => {
//     this.setState((prevState) => ({
//       activeIndex:
//         prevState.activeIndex === 0
//           ? this.props.images.length - 1
//           : prevState.activeIndex - 1,
//     }));
//   };

//   handleNext = (): void => {
//     this.setState((prevState) => ({
//       activeIndex:
//         prevState.activeIndex === this.props.images.length - 1
//           ? 0
//           : prevState.activeIndex + 1,
//     }));
//   };

//   render(): JSX.Element {
//     const { onClose, images } = this.props;
//     const { activeIndex } = this.state;

//     return (
//       <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5" id="staticBackdropLabel">
//               Images
//             </h1>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//               onClick={onClose}
//             />
//           </div>
//           <div className="modal-body">
//             <div id="carouselExample" className="carousel slide">
//               <div className="carousel-inner">
//                 {images.map((img, index) => (
//                   <div
//                     key={index}
//                     className={`carousel-item ${
//                       index === activeIndex ? "active" : ""
//                     }`}
//                   >
//                     <img src={img} className="d-block w-100" alt="Slide" />
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className="carousel-control-prev"
//                 type="button"
//                 data-bs-target="#carouselExample"
//                 data-bs-slide="prev"
//                 onClick={this.handlePrev}
//               >
//                 <span
//                   className="carousel-control-prev-icon"
//                   aria-hidden="true"
//                 />
//                 <span className="visually-hidden">Previous</span>
//               </button>
//               <button
//                 className="carousel-control-next"
//                 type="button"
//                 data-bs-target="#carouselExample"
//                 data-bs-slide="next"
//                 onClick={this.handleNext}
//               >
//                 <span
//                   className="carousel-control-next-icon"
//                   aria-hidden="true"
//                 />
//                 <span className="visually-hidden">Next</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Modal;


import * as React from "react";

interface ModalProps {
  onClose: () => void;
  images: string[];
  title: string;
}

interface ModalState {
  activeIndex: number;
}

class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      activeIndex: 0,
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
      <div className="modal-overlay">
        <div className="modal-container">
          {/* Header Section */}
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>

          {/* Image Display */}
          <div className="modal-body">
            <div className="image-carousel">
              {images.length > 1 && (
                <button className="carousel-control prev" onClick={this.handlePrev}>
                  ❮
                </button>
              )}
              <img src={images[activeIndex]} className="modal-image" alt="Popup" />
              {images.length > 1 && (
                <button className="carousel-control next" onClick={this.handleNext}>
                  ❯
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
