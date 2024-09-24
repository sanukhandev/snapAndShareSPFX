import * as React from "react";

interface ToastProps {
  message: string;
}

interface ToastState {}

class Toast extends React.Component<ToastProps, ToastState> {
  constructor(props: ToastProps) {
    super(props);
  }

  render(): React.ReactElement {
    const { message } = this.props;

    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
        {message}
      </div>
    );
  }
}

export default Toast;
