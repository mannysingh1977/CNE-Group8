import React from "react";

interface StatusMessageProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  id,
  message,
  onClose,
}) => {
  return (
    <div
      className={`w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        className="absolute bottom-0 right-0 px-4 py-3"
        onClick={() => onClose(id)}
      >
        <svg
          className="fill-current h-6 w-6 text-${type}-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
        </svg>
      </span>
    </div>
  );
};

interface StatusMessageContainerProps {
  children: React.ReactNode;
}

export const StatusMessageContainer: React.FC<StatusMessageContainerProps> = ({
  children,
}) => {
  return (
    <div className="fixed w-1/3 top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
      {" "}
      {children}
    </div>
  );
};
